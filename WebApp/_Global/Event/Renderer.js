export class Renderer {
	constructor() {
		try {
			if (nativeDesktopApp) window.nativeDesktopApp = nativeDesktopApp;
		} catch (err) {
			window.nativeDesktopApp = undefined;
		}
	}

	alert(message) {
		if (typeof nativeDesktopApp != "undefined")
			nativeDesktopApp.alert("by electron : " + message);
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
}
