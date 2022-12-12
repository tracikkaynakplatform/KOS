import { app, BrowserWindow, Menu} from "electron";
import { initApis } from "./api";

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 1000,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	mainWindow.webContents.openDevTools();

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	 Menu.setApplicationMenu(mainMenu);
};

const mainMenuTemplate = [
	{
	  label : "Menu",
	  submenu : [
		{
		  label : "Çıkış",
		  accelerator : process.platform == "darwin" ? "Command+Q": "Ctrl+Q",
		  role : "quit"
		}
	  ]
	}
  ]
   
  if (process.platform == "darwin"){
	mainMenuTemplate.unshift({
	  label :app.getName(),
	  role : "TODO"
	})
  }



if (require("electron-squirrel-startup")) app.quit();
app.whenReady().then(() => initApis()); // API'lerin yüklenmesi ve kullanıma hazır hale gelmesi.
app.on("ready", createWindow);
app.on("activate", () =>
	BrowserWindow.getAllWindows().length === 0 ? createWindow() : null
);
app.on("window-all-closed", () =>
	process.platform !== "darwin" ? app.quit() : null
);
