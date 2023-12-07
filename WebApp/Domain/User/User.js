import Preloader from "./Preload.mjs";

import APIHandler from "../../Util/APIHandler.js";
import Chat from "../Chat/Chat.js";

import CommonDOMevent from "../../_Global/Event/DOMevent.js";
import AssetHandler from "../../Util/AssetHandler.js";

import { API_URL } from "../../_Global/Constant/API.js";

export default class User {
	static INFO = null;
	static CLIENT;

	static CI_API;
	static CHAT_API;

	/** @type AssetHandler */
	static assetHandler;

	constructor() {
		User.CI_API = new APIHandler(API_URL.CI_INTRANET);
		User.CHAT_API = new APIHandler(API_URL.CHAT_SERVER);
		User.assetHandler = new AssetHandler();

		this.#initializeChat();
	}

	async #initializeChat() {
		let initResult = await Preloader.USER_init();
		if (!initResult) throw new Error("유저 정보가 잘못되었습니다.");

		this.CHAT = new Chat();

		await this.#initializeChatEventListner();
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
