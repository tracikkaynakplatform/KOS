import React from "react";
import { Typography, Link as MUILink, Box, TextField } from "@mui/material";
import { useState } from "react";
import { translate } from "../../locales";
import Wrapper from "../StepWizardWrapper.jsx";

export default function StepDigitalOceanSSHkey({ goToNamedStep, ...props }) {
	const [fingerprint, setFingerprint] = useState("");
	const _goto = goToNamedStep;

	return (
		<Wrapper
			onNextClick={() => {
				// TODO: doctl kullanarak parmak izini doğrula
				_goto("digitalocean-clusterconfig");
			}}
			onBackClick={() => {
				_goto("selectProvider");
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
				DigitalOcean kimlik bilgileri
			</Typography>
			<Typography>
				DigitalOcean hesabınızda işlem yapabilmek için{" "}
				<MUILink href="https://docs.digitalocean.com/glossary/ssh/">
					SSH anahtarı parmak izi
				</MUILink>{" "}
				bilgisini girin.
			</Typography>
			<Box
				sx={{
					mt: "10px",
					mb: "10px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<TextField
					onChange={(e) => setFingerprint(e.target.value)}
					value={fingerprint}
					label={translate("sshKeyFingerprint")}
				/>
			</Box>
		</Wrapper>
	);
}