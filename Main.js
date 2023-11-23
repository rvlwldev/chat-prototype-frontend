const { app, BrowserWindow, ipcMain, dialog, globalShortcut, Menu, MenuItem } = require("electron");
const path = require("path");

/** @type BrowserWindow */ var MAIN_WINDOW;

const CALLBACK_NAME_MAP = new Map();

app.whenReady()
	.then(createMainWindow)
	.then(initIpcRenderer)
	.then(initCallbackEmitter)
	.then(blockGlobalShortcut)
	.then(console.log("APP IS ACTIVATED"));

function createMainWindow() {
	MAIN_WINDOW = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(__dirname, "Configuration", "Preload.js"),
		},
	});

	// NOTE : 개발용
	MAIN_WINDOW.webContents.openDevTools();

	MAIN_WINDOW.loadFile("login.html");
	MAIN_WINDOW.on("closed", () => app.quit());
}

function initIpcRenderer() {
	// alert
	ipcMain.on("alert", (event, message) => {
		dialog.showMessageBoxSync({
			type: "info",
			message: message,
			buttons: ["OK !"],
		});
	});
}

function initCallbackEmitter() {
	ipcMain.on(
		"register-client-context-menu",
		(event, contextEventName, menuName, callbackName) => {
			if (CALLBACK_NAME_MAP.has(contextEventName)) {
				CALLBACK_NAME_MAP.get(contextEventName).set(menuName, callbackName);
			} else CALLBACK_NAME_MAP.set(contextEventName, new Map([[menuName, callbackName]]));
		}
	);

	ipcMain.on("trigger-client-context-menu", (event, position, contextEventName, paramObj) => {
		const callbackNameByMenuMap = CALLBACK_NAME_MAP.get(contextEventName);
		if (!callbackNameByMenuMap) return false;

		let contextMenu = new Menu();

		for (let [menuName, callbackName] of callbackNameByMenuMap) {
			let clickEvent = () => {
				MAIN_WINDOW.webContents.send(
					"invoke-callback",
					contextEventName,
					menuName,
					callbackName,
					paramObj
				);
			};

			contextMenu.append(new MenuItem({ label: menuName, click: clickEvent }));
		}

		const { x, y } = position;
		contextMenu.popup(MAIN_WINDOW, x, y);
	});
}

function blockGlobalShortcut() {
	// globalShortcut.register("CommandOrControl+W", () => {});
	// globalShortcut.register("CommandOrControl+R", () => {});
}

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
