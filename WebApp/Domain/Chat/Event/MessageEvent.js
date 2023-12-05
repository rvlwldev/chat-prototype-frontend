import Renderer from "../../../_Global/Event/Renderer.js";

export default class MessageEvent {
	constructor(self) {
		this._self = self;
	}

	onUserImageClickEvent(HTML) {
		try {
			HTML.find(".user-image").on("click", this.userImageClickEvent);
		} catch (err) {
			console.log(HTML);
		}
	}

	userImageContextMenuEvent(e) {
		let userid = $(e.target).siblings("div .bubble").data("userid");
		Renderer.showContextMenu(e, "userImageContextMenu", { userid: userid });
	}

	onUserImageContextMenuEvent(HTML) {
		HTML.find(".user-image").on("contextmenu", this.userImageContextMenuEvent);
	}
}
