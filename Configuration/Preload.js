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
		callback(DOMevent, paramObj);
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

// contextBridge.exposeInMainWorld("loginModule", {
// 	proceed: () => {
// 		console.log("Preload Bridge 연결");

// 		document.getElementById("username").addEventListener("keypress", (e) => {
// 			if (e.keyCode === 13) document.getElementById("password").focus();
// 		});

// 		document.getElementById("password").addEventListener("keypress", (e) => {
// 			if (e.keyCode === 13) CI_SERVER_LOGIN();
// 		});

// 		document.getElementById("login").addEventListener("click", () => CI_SERVER_LOGIN());

// 		function CI_SERVER_LOGIN() {
// 			const ID = document.getElementById("username").value;
// 			const PW = document.getElementById("password").value;
// 			const DB = "cug";

// 			if (!ID || !PW) {
// 				ipcRenderer.send("alert", "아이디/비밀번호를 입력해주세요");
// 				document.getElementById("username").focus();
// 				return;
// 			}

// 			const xhr = new XMLHttpRequest();
// 			xhr.open("POST", "http://192.168.2.65/chatapi/login", true);
// 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

// 			xhr.onload = function () {
// 				if (xhr.status === 200) redirectToApp(JSON.parse(xhr.responseText));
// 				else {
// 					console.log(xhr.statusText);
// 					if (xhr.responseText) ipcRenderer.send("alert", xhr.responseText);
// 				}
// 			};

// 			xhr.onerror = function () {
// 				console.error("Network error");
// 			};

// 			const data = `id=${encodeURIComponent(ID)}&pw=${encodeURIComponent(PW)}&intranet=${DB}`;

// 			xhr.send(data);
// 		}

// 		function redirectToApp(userinfo) {
// 			const userinfoString = encodeURIComponent(JSON.stringify(userinfo));
// 			const url = "./WebApp/index.html?data=" + userinfoString;

// 			window.location.href = url;
// 		}
// 	},
// });
