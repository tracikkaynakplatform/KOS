import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useWizard } from "../../../../hooks/useWizard";
import { PROVIDER_TYPE } from "../../../../providers";
import { StepWizardWrapper } from "../../../Steps";
import { useForm } from "react-hook-form";
import { InputSelect } from "../../../FormInputs";

export default function StepSelectVersion({ goToNamedStep, ...props }) {
	const [versions, setVersions] = useState([]);
	const wizard = useWizard();
	const { handleSubmit, control } = useForm();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<StepWizardWrapper
			disableBack
			onLoad={async () => {
				if (wizard.data.provider == PROVIDER_TYPE.DOCKER) {
					setVersions([
						{
							label: "v1.24.6",
							value: "kindest/node:v1.24.0",
						},
						{
							label: "v1.25.1",
							value: "kindest/node:v1.25.1",
						},
						{
							label: "v1.25.2",
							value: "kindest/node:v1.25.2",
						},
					]);
				} else if (wizard.data.provider == PROVIDER_TYPE.AWS) {
					setVersions([
						{
							label: "v1.24.1",
							value: "ami-0afc5e75ac5599f0c",
						},
						{
							label: "v1.24.3",
							value: "ami-05c1cad52ff9bf3d1",
						},
						{
							label: "v1.25.2",
							value: "ami-07aa950fad9bc438a",
						},
					]);
				}
			}}
			onNextClick={handleSubmit(async (fields) => {
				try {
					// TODO: Girdileri doğrula
					// TODO: Provider'ı tespit edip ona göre template'i düzenle
					// Cluster'ın kind cluster'ı olduğu varsayılıyor.
					for (let field of Object.keys(fields))
						await wizard.updateData(field, fields[field]);
					_goto("applyTemplates");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
				}
			})}
			title="Yükseltme bilgilerini girin"
			fields={{
				kubVersion: {
					title: "Kubernetes Sürümü",
					type: "select",
					items: versions,
				},
			}}
			{...props}
		>
			<InputSelect name="kubVersion" control={control} items={versions} />
		</StepWizardWrapper>
	);
}
