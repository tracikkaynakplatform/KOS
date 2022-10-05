import { Typography, CircularProgress, Box } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import React from "react";
import Wrapper from "../StepWizardWrapper";
import { useWizard } from "../../hooks/useWizard";

export default function StepKindCreateCluster({ goToNamedStep, ...props }) {
	const [infoText, setInfoText] = useState("");
	const wizard = useWizard();
	const snack = useSnackbar().enqueueSnackbar;
	const _goto = goToNamedStep;

	return (
		<Wrapper
			disableNext
			disableBack
			onLoad={async () => {
				try {
					setInfoText(
						"Küme oluşturmak için yaml dosyası üretiliyor... (clsuterctl generate)"
					);
					let yaml = await clusterctl.generateCluster(
						wizard.data.config,
						wizard.data.clusterName,
						wizard.data.kubVersion,
						wizard.data.masterCount,
						wizard.data.workerCount,
						true,
						"docker"
					);
					setInfoText(
						"YAML dosyası yönetim kümesine uygulanıyor (kubectl apply)"
					);
					await kubectl.apply(wizard.data.config, yaml);
					_goto("addClusterComplete");
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 5000,
					});
					_goto("kindProviderConfig");
				}
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
				{infoText}
			</Typography>
			<Box
				sx={{
					m: 5,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		</Wrapper>
	);
}
