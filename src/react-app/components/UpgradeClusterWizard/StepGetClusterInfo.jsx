import React from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../hooks/useWizard";
import StepBaseLoading from "../StepBaseLoading.jsx";
import { PROVIDER_CLASS } from "../../providers";
import kubectl from "../../api/kubectl";
import kubeConfig from "../../api/kubeConfig";
import clusterConfig from "../../api/clusterConfig";

export default function StepGetClusterInfo({
	onError,
	goToNamedStep,
	...props
}) {
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepBaseLoading
			title="Küme ile ilgili bilgi toplanıyor..."
			disableNext
			disableBack
			onLoad={async () => {
				try {
					const config = await kubeConfig.loadManagementConfig(
						wizard.manClusterName
					);

					const cluster = await clusterConfig.getCluster(
						config,
						wizard.clusterName
					);
					if (!cluster) throw new Error("Küme bulunamadı");

					const machineTemplate = `${
						PROVIDER_CLASS[cluster.provider]
					}machinetemplate`;

					const clusterResource = await kubectl.get(
						config,
						"cluster",
						"json",
						wizard.clusterName
					);

					const kubeadmResource = await kubectl.get(
						config,
						"KubeadmControlPlane",
						"json",
						clusterResource.spec.controlPlaneRef.name
					);

					var controlPlaneTemplate = await kubectl.get(
						config,
						machineTemplate,
						"json",
						kubeadmResource.spec.machineTemplate.infrastructureRef
							.name
					);

					var machineDeployment = (
						await kubectl.get(
							config,
							"machinedeployment",
							"json",
							"-l",
							`cluster.x-k8s.io/cluster-name=${wizard.clusterName}`
						)
					).items[0];
					console.log(machineDeployment);
					var workerTemplate = await kubectl.get(
						config,
						machineTemplate,
						"json",
						machineDeployment.spec.template.spec.infrastructureRef
							.name
					);
					console.log(controlPlaneTemplate, workerTemplate);
					if (!workerTemplate || !controlPlaneTemplate)
						throw new Error("Makine şemaları bulunamadı");

					delete controlPlaneTemplate.metadata.creationTimestamp;
					delete controlPlaneTemplate.metadata.generation;
					delete controlPlaneTemplate.metadata.resourceVersion;
					delete controlPlaneTemplate.metadata.uid;
					delete controlPlaneTemplate.metadata.annotations;

					delete workerTemplate.metadata.creationTimestamp;
					delete workerTemplate.metadata.generation;
					delete workerTemplate.metadata.resourceVersion;
					delete workerTemplate.metadata.uid;
					delete workerTemplate.metadata.annotations;

					controlPlaneTemplate.metadata.name += "-kos-upgrade";
					workerTemplate.metadata.name += "-kos-upgrade";

					wizard.updateData("provider", cluster.provider);
					wizard.updateData(
						"controlPlaneTemplate",
						controlPlaneTemplate
					);
					wizard.updateData("workerTemplate", workerTemplate);
					wizard.updateData("config", config);

					_goto("selectVersion");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					onError?.();
				}
			}}
			{...props}
		/>
	);
}
