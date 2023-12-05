export default class Renderer {
	static activeNotification = null;

	constructor() {}

	static requestPermission() {
		if (Notification.permission !== "granted")
			Notification.requestPermission(() => {
				if (Notification.permission == "granted") Renderer.activeNotification = true;
				else Renderer.activeNotification = false;
			});
	}

	static alert(message) {
		if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.alert(message);
		else alert(message);
	}

	static registerDynamicContextMenu(groupName, menuName, callback) {
		if (typeof nativeDesktopApp != "undefined") {
			nativeDesktopApp.register.contextMenu(groupName, menuName, callback.name, callback);
		}
	}

	static async showContextMenu(/** @type MouseEvent */ e, registeredEventName, paramObj) {
		e.preventDefault();
		if (typeof nativeDesktopApp != "undefined")
			nativeDesktopApp.trigger.contextMenu(e, registeredEventName, paramObj);
	}

	static notify(title, body) {
		if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.showNotification(title, body);
		else {
			if (Notification.permission === "granted") this.showWindowNotification(title, body);
			else {
				Notification.requestPermission().then(() => console.log(Notification.permission));
				this.showWindowNotification(title, body);
			}
		}
	}

	static showWindowNotification(title, body) {
		if (this.activeNotification) this.activeNotification.close();

		this.activeNotification = new Notification(title, { body: body });

		this.activeNotification.onshow = () => {};
		this.activeNotification.onclick = () => {};
		this.activeNotification.onclose = () => {};
	}
}
