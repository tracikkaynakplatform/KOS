import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { translate } from "../../locales";
import { useWizard } from "../../hooks/useWizard";
import Wrapper from "../StepWizardWrapper";

export default function StepManagementCluster({
	nextStep,
	previousStep,
	...props
}) {
	const [kubeconfigData, setKubeconfigData] = useState("");
	const [textFieldEnabled, setTextFieldEnabled] = useState(true);
	const [buttonsEnabled, setButtonsEnabled] = useState(true);
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const closeSnack = useSnackbar().closeSnackbar;
	const _next = nextStep;
	const _back = previousStep;

	return (
		<Wrapper
			disableBack={!buttonsEnabled}
			disableNext={!buttonsEnabled}
			onLoad={async () => {
				try {
					setKubeconfigData(await kubeConfig.defaultConfig());
				} catch (err) {}
			}}
			onNextClick={async () => {
				setTextFieldEnabled(false);
				setButtonsEnabled(false);
				try {
					try {
						await kubectl.check();
					} catch (err) {
						const downloadSnack = snack(
							"kubectl bulunamadı! İndiriliyor...", // TODO: snackbar yükleniyor tasarımında olacak.
							{ variant: "info", persist: true }
						);

						await kubectl.download();
						closeSnack(downloadSnack);
					}

					snack("kubectl çalıştırılıyor...", {
						variant: "info",
						autoHideDuration: 2000,
					});
					await kubectl.setConfig(kubeconfigData);
					await kubectl.get("namespace", "json", "-A");
					snack("Küme ile bağlantı sağlandı", {
						variant: "success",
						autoHideDuration: 2000,
					});
					wizard.updateData("config", kubeconfigData);
					_next();
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
				}
				setTextFieldEnabled(true);
				setButtonsEnabled(true);
			}}
			onBackClick={() => {
				_back();
			}}
			{...props}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Yönetim kümesinin bilgileri
			</Typography>
			<Typography>
				Yeni küme oluşturmak için kullanılacak yönetim kümesine ait olan
				kube config bilgilerini girin.
				<br />
				(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği
				alınmıştır)
			</Typography>
			<TextField
				disabled={!textFieldEnabled}
				onChange={(e) => setKubeconfigData(e.target.value)}
				value={kubeconfigData}
				sx={{ mt: 2, mb: 2, width: "700px" }}
				label={translate("kubeConfigContent")}
				multiline
				rows={15}
			/>
		</Wrapper>
	);
}