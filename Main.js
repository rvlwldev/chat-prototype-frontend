const {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	globalShortcut,
	Menu,
	MenuItem,
	Notification,
} = require("electron");
const path = require("path");

/** @type BrowserWindow */
var MAIN_WINDOW;

const CALLBACK_NAME_MAP = new Map();

app.commandLine.appendSwitch("disable-http-cache");
app.setPath("userData", path.join(__dirname, "userData"));

app.whenReady()
	.then(createMainWindow)
	.then(initIpcRenderer)
	.then(initCallbackEmitter)
	.then(blockGlobalShortcut)
	.then(console.log("APP IS ACTIVATED"));

function createMainWindow() {
	MAIN_WINDOW = new BrowserWindow({
		width: 1920, // 기본 가로 사이즈
		height: 1080, // 기본 세로 사이즈
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(__dirname, "Configuration", "Preload.js"),
		},
	});

	MAIN_WINDOW.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
		details.requestHeaders.Origin = "ELECTRON";
		callback({ cancel: false, requestHeaders: details.requestHeaders });
	});

	// NOTE : 개발용
	MAIN_WINDOW.webContents.openDevTools();
	MAIN_WINDOW.loadFile("./WebApp/login.html");
	MAIN_WINDOW.on("closed", () => app.quit());
}

function initIpcRenderer() {
	ipcMain.on("alert", (event, message) => {
		dialog.showMessageBoxSync({
			type: "info",
			message: message,
			buttons: ["확인"],
		});
	});
}

function initCallbackEmitter() {
	let activeNotifications = [];

	ipcMain.on("show-notification", (event, args) => {
		const { title, body } = args;

		activeNotifications.forEach(({ notification, timer }) => {
			notification.close();
			clearInterval(timer);
		});
		activeNotifications = [];

		const newNotification = new Notification({ title, body });
		newNotification.show();

		// TODO : 클릭 시 메인 앱의 채널 접속 함수 호출
		// newNotification.on("click", (e) => {})

		const newTimer = setTimeout(() => {
			newNotification.close();

			activeNotifications = activeNotifications.filter(
				({ notification }) => notification !== newNotification
			);
		}, 5000);

		activeNotifications.push({ notification: newNotification, timer: newTimer });
	});

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

	app.on("will-quit", () => globalShortcut.unregisterAll());
}
