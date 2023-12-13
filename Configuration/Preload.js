const { contextBridge, ipcRenderer } = require("electron");

/** @type Map<String, Map<String, Function>> */
const contextMenuCallbackMap = new Map();

/** @type Map<String, MouseEvent> */
const contextMenuEventMap = new Map();

ipcRenderer.on("invoke-callback", (event, contextEventName, menuName, callbackName, paramObj) => {
	const callbackMap = contextMenuCallbackMap.get(menuName);
	const callback = callbackMap.get(callbackName);

	if (callback) {
		const DOMevent = contextMenuEventMap.get(contextEventName);
		callback(paramObj, DOMevent);
	}
});

contextBridge.exposeInMainWorld("nativeDesktopApp", {
	register: {
		// 우클릭 메뉴 설정
		contextMenu: (contextEventName, menuName, callbackName, callback) => {
			ipcRenderer.send(
				"register-client-context-menu",
				contextEventName,
				menuName,
				callbackName
			);

			let contextMenuMap = contextMenuCallbackMap.get(menuName);

			if (contextMenuMap) contextMenuMap.set(callbackName, callback);
			else contextMenuCallbackMap.set(menuName, new Map([[callbackName, callback]]));
		},
	},

	trigger: {
		// 우클릭 메뉴 실행
		contextMenu: (/** @type MouseEvent */ e, contextEventName, paramObj) => {
			let position = { x: e.clientX, y: e.clientY };

			contextMenuEventMap.set(contextEventName, e);
			ipcRenderer.send("trigger-client-context-menu", position, contextEventName, paramObj);
		},
	},

	// 윈도우 기본 함수 덮어쓰기
	alert: (message) => ipcRenderer.send("alert", message),

	// 알람 표시
	showNotification: (title, body) => {
		ipcRenderer.send("show-notification", { title, body });
	},
});
