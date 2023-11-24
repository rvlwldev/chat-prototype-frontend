export class Renderer {
	constructor() {
		try {
			if (nativeDesktopApp) nativeDesktopApp;
		} catch (err) {
			window.nativeDesktopApp = undefined;
		}
	}

	alert(message) {
		if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.alert(message);
		else alert("by electron : " + message);
	}

	registerDynamicContextMenu(groupName, menuName, callback) {
		if (typeof nativeDesktopApp != "undefined") {
			nativeDesktopApp.register.contextMenu(groupName, menuName, callback.name, callback);
		}
	}

	async showContextMenu(/** @type MouseEvent */ e, registeredEventName, paramObj) {
		if (typeof nativeDesktopApp != "undefined") {
			e.preventDefault();
			nativeDesktopApp.trigger.contextMenu(e, registeredEventName, paramObj);
		}
	}

	notify(title, body) {
		if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.showNotification(title, body);
	}
}
