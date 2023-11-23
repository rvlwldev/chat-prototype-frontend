import { CommonDOMevent } from "../../_Global/Event/DOMevent.js";

import { APIHandler } from "../../Util/APIHandler.js";

import { Chat } from "../Chat/Chat.js";

export class User {
	static INFO = null;
	static CLIENT;

	constructor() {
		this.CI_API = new APIHandler();

		if (this.#setGlobalUserInfo()) {
			const CHAT_API = new APIHandler("http://192.168.2.65:3000/");

			this.#login().then(() =>
				CHAT_API.post("init/" + User.INFO.id)
					.then(() => (this.CHAT = new Chat(User.INFO, User.CLIENT, CHAT_API)))
					.then(() => this.initializeChatEventListner())
					.then(() => this.initializeSDKeventListner())
			);
		} else console.error("올바르지 않은 로그인");
	}

	#setGlobalUserInfo() {
		try {
			let params = new URLSearchParams(window.location.search);
			User.INFO = JSON.parse(decodeURIComponent(params.get("data")));

			console.log(User.INFO);

			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}
	async #login() {
		await this.CI_API.get("token", { userId: User.INFO.id })
			.then((response) => {
				User.CLIENT = new TalkPlus.Client({ appId: response.AppID });

				return this.#SDK_login(response);
			})
			.catch((err) => {
				// TODO : Interceptor 구현
				ipcRenderer.send("alert", "에러");
				console.log(err);

				return false;
			});
	}

	async #SDK_login(response) {
		return await User.CLIENT.loginWithToken({
			userId: response.user.id,
			username: response.user.username,
			loginToken: response.loginToken,
		})
			.then(() => true)
			.catch(() => false);
	}

	initializeSDKeventListner() {
		User.CLIENT.on("event", (event) => {
			if (event.type === "message") {
				this.CHAT.receiveMessage(event.message);
				console.log("new message received");
			}

			if (event.type === "channelAdded") {
				this.CHAT.addChannel(event.channel);
				console.log("new channel added with me as member");
			}

			if (event.type === "channelRemoved") {
				console.log("one of my channels was removed");
			}

			if (event.type === "memberAdded") {
				console.log("new channel member");
			}

			if (event.type === "memberLeft") {
				console.log("channel member left");
			}
		});
	}

	async initializeChatEventListner() {
		CommonDOMevent.initializeDefaultDOMeventListner();

		CommonDOMevent.setMessageInputEnterCallback.bind(this.CHAT)(this.CHAT.sendTextMessasge);
		CommonDOMevent.setMessageSendButtonCallback.bind(this.CHAT)(this.CHAT.sendTextMessasge);

		CommonDOMevent.setImageSendCallback.bind(this.CHAT)(this.CHAT.sendImageMessage);
		CommonDOMevent.setVideoSendCallback.bind(this.CHAT)(this.CHAT.sendVideoMessage);
		CommonDOMevent.setFileSendCallback.bind(this.CHAT)(this.CHAT.sendFileMessage);

		CommonDOMevent.scroll.setEvent.bind(this.CHAT)(this.CHAT.loadMessage);
	}
}
