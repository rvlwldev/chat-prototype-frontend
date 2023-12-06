import Preloader from "./Preload.mjs";

import APIHandler from "../../Util/APIHandler.js";
import Chat from "../Chat/Chat.js";

import CommonDOMevent from "../../_Global/Event/DOMevent.js";

export default class User {
	static INFO = null;
	static CLIENT;

	static CI_API = new APIHandler();
	static CHAT_API = new APIHandler("http://192.168.2.65:3000/");

	constructor() {
		this.#initializeChat();
	}

	async #initializeChat() {
		let initResult = await Preloader.USER_init();
		if (!initResult) throw new Error();

		this.CHAT = new Chat();

		this.#initializeChatEventListner();
	}

	async #initializeChatEventListner() {
		CommonDOMevent.initializeDefaultDOMeventListner();

		// 사용자 메세지 전송 이벤트
		CommonDOMevent.setMessageInputEnterCallback.bind(this.CHAT)(this.CHAT.sendMessage);
		CommonDOMevent.setMessageSendButtonCallback.bind(this.CHAT)(this.CHAT.sendMessage);
		CommonDOMevent.setImageSendCallback.bind(this.CHAT)(this.CHAT.sendMessage);
		CommonDOMevent.setVideoSendCallback.bind(this.CHAT)(this.CHAT.sendMessage);
		CommonDOMevent.setFileSendCallback.bind(this.CHAT)(this.CHAT.sendMessage);

		// 사용자 스크롤 이벤트
		CommonDOMevent.messageScroll.setEvent.bind(this.CHAT)();
	}
}
