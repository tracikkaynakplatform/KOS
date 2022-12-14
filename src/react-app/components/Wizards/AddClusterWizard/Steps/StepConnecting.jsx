import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { StepBaseLoading } from "../../../Steps";
import { logger } from "../../../../logger";
import { clusterConfig, kubectl } from "../../../../api";
import { useLayout } from "../../../../hooks/useLayout";

export default function StepConnecting(props) {
	const [info, setInfo] = useState("");
	const snack = useSnackbar().enqueueSnackbar;
	const layout = useLayout();
	const errSnack = (msg) => {
		snack(msg, {
			variant: "error",
			autoHideDuration: 5000,
		});
		_goto("kubeConfig");
	};
	const wizard = useWizard();
	const _goto = props.goToNamedStep;

	return (
		<StepBaseLoading
			title="Kümeye bağlanılıyor..."
			info={info}
			disableBack
			disableNext
			stepName={props.stepName}
			onLoad={async () => {
				layout.disableBack();
				try {
					let manName;
					try {
						setInfo("Yönetim kümesinin adı alınıyor...");
						manName = await kubectl.currentContext(
							wizard.data.config
						);
					} catch (err) {
						logger.error(err.message);
						errSnack(
							"Küme ile bağlantı sağlanamadı! kubeconfig dosyasının içeriğini kontrol edin."
						);
						return;
					}

					setInfo(
						"Desteklenen altyapı sağlayıcılarının bilgisi alınıyor..."
					);
					let supportedProviders =
						await clusterConfig.getSupportedProviders(
							wizard.data.config
						);

					if (supportedProviders.length == 0) {
						errSnack(
							"Desteklenen altyapı sağlayıcıları bulunamadı!\nKümenin bir yönetim kümesi olduğundan emin olun."
						);
						return;
					}
					wizard.updateData("clusterName", manName);
					wizard.updateData("supportedProviders", supportedProviders);
					_goto("enterClusterName");
				} catch (err) {
					logger.error(err.message);
					errSnack("Bir hata oluştu");
				}
				layout.enableBack();
			}}
		/>
	);
}
