const { ipcRenderer } = require("electron");

ipcRenderer.on("callback-invoke", (event, callbackName) => {
	let invoker = new Object(invoke);

	if (invoker.hasOwnProperty(callbackName)) {
		invoker[callbackName]();
	}
});

const invoke = {
	createPrivateChannel: () => {
		console.log("createPrivateChannel is invoked!");
	},
};

module.exports = eventCallback;
