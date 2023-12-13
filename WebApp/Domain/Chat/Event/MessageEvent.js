import Renderer from "../../../_Global/Event/Renderer.js";

export default class MessageEvent {
	constructor() {}

	static initEvent() {
		Renderer.registerDynamicContextMenu("userImageContextMenu", "1:1 채팅", CHAT.createChannel);
	}

	onUserImageClickEvent(HTML) {
		HTML.find(".user-image").on("click", (e) => {
			let targetName = $(e.target).siblings(".name").text();
			Renderer.alert(targetName + " 정보확인 준비중");
		});
	}

	onUserImageContextMenuEvent(HTML) {
		HTML.find(".user-image").on("contextmenu", (e) => {
			let targetId = $(e.target).parent().data("userid");
			let targetName = $(e.target).siblings(".name").text();

			Renderer.showContextMenu(e, "userImageContextMenu", {
				userId: targetId,
				username: targetName,
			});
		});
	}
}
