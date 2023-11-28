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

			User.CLIENT = new TalkPlus.Client({ appId: "7033fa01-881d-46e5-8ed2-63c472d83a89" });

			if (User.INFO.id.startsWith("admin"))
				CHAT_API.post("admin/" + User.INFO.id).then(async (response) => {
					this.CHAT = new Chat(User.INFO, User.CLIENT, CHAT_API);

					await this.initializeChatEventListner();
					this.initializeSDKeventListner();
					await this.#SDK_login(response);
				});
			else
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
			let userInfo = sessionStorage.getItem("userinfo");
			if (!userInfo) throw new Error("로그인 정보 없이 접근");

			User.INFO = JSON.parse(userInfo);

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
			if (event.type === "message") this.CHAT.receiveMessage(event.message);

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
