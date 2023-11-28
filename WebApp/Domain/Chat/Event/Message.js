import { Renderer } from "../../../_Global/Event/Renderer.js";

export class MessageEvent extends Renderer {
	#self;

	constructor(_self) {
		super(_self);

		this.#self = _self;
		this.#initContextMenu();
	}

	#initContextMenu() {
		this.registerDynamicContextMenu(
			"userImageContextMenu",
			"1:1 채팅하기",
			this.toPrivateChannel
		);

		this.registerDynamicContextMenu(
			"userImageContextMenu",
			"파라미터 Example",
			this.checkParams
		);
	}

	onUserImageClickEvent(HTML) {
		try {
			HTML.find(".user-image").on("click", this.userImageClickEvent);
		} catch (err) {
			console.log(HTML);
		}
	}

	userImageClickEvent(e) {
		e.preventDefault();
		super.alert("유저 프로필 클릭!");
	}

	onUserImageContextMenuEvent(HTML) {
		HTML.find(".user-image").on("contextmenu", this.userImageContextMenuEvent);
	}

	userImageContextMenuEvent(e) {
		let userid = $(e.target).siblings("div .bubble").data("userid");
		super.showContextMenu(e, "userImageContextMenu", { userid: userid });
	}

	toPrivateChannel(e, paramObj) {
		console.log(window.Chat);

		// 이벤트 객체 활용 가능하게...
		let userId = $(e.target).siblings("div .bubble").data("userid");
		console.log(window.Chat.hasChannel(userId));
	}

	// example
	checkParams(e, paramObj) {
		this.alert("check parameters");
		console.log(paramObj);
	}
}
