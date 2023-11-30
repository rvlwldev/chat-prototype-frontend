export class Renderer {
	constructor() {
		if (Notification.permission !== "granted") Notification.requestPermission();

		this.activeNotification = null;
		try {
			if (nativeDesktopApp) nativeDesktopApp;
		} catch (err) {
			window.nativeDesktopApp = undefined;
		}
	}

	alert(message) {
		if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.alert(message);
		else alert(message);
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
		else {
			if (Notification.permission === "granted") this.showWindowNotification(title, body);
			else {
				Notification.requestPermission().then(() => console.log(Notification.permission));
				this.showWindowNotification(title, body);
			}
		}
	}

	showWindowNotification(title, body) {
		if (this.activeNotification) this.activeNotification.close();

		this.activeNotification = new Notification(title, { body: body });

		this.activeNotification.onshow = () => {};
		this.activeNotification.onclick = () => {};
		this.activeNotification.onclose = () => {};
	}
}
