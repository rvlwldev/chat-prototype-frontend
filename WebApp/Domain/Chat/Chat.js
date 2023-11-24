import { MessageArray } from "./Classes/MessageArray.js";
import { ChatMap } from "./Classes/ChatMap.js";

import { MessageTemplate } from "./Template/Message.js";
import { ChannelTemplate } from "./Template/Channel.js";
import { User } from "../User/User.js";

import { APIHandler } from "../../Util/APIHandler.js";
import { CommonDOMevent } from "../../_Global/Event/DOMevent.js";

export class Chat {
	// static NO_CHANNEL_IMAGE = "C:/projects/Chat-app/electron/WebApp/Asset/img/no_picture_user.png";
	// static NO_USER_PROFILE_IMAGE = "C:/projects/Chat-app/electron/WebApp/Asset/img/no_picture_user.png";

	static NO_CHANNEL_IMAGE = "http://192.168.2.65:3000/asset/img/no_picture_user.png";
	static NO_USER_PROFILE_IMAGE = "http://192.168.2.65:3000/asset/img/no_picture_user.png";

	/**
	 * @type { String }
	 */
	currentChannelId;

	/**
	 * @type { ChatMap<ChannelObject, MessageArray.<MessageObject>> }
	 */
	#messageMap = new ChatMap();

	/**
	 * @type { ChatMap<ChannelObject, MessageArray.<MemberObject>> }
	 */
	#memberMap = new ChatMap();

	constructor(userinfo, CLIENT, API) {
		window.Chat = this;

		this.userinfo = userinfo;
		this.CLIENT = CLIENT;

		/** @type APIHandler */
		this.API = API;

		this.messageTemplate = new MessageTemplate(this);
		this.channelTemplate = new ChannelTemplate(this);

		this.#initialize();
	}

	async #initialize() {
		let connect = await this.API.get("")
			.then(async (res) => res.connect)
			.catch((err) => {
				console.error(err);
				return false;
			});

		if (!connect) {
			console.error("채팅 서버에 연결 할 수 없습니다.");
			return false;
		}

		await this.#initializeUserChannels();
	}

	async #initializeUserChannels() {
		await this.API.get("channels?userId=" + User.INFO.id).then((channels) => {
			this.channelTemplate.clear();
			this.messageTemplate.clear();

			channels.forEach((channel) => this.addChannel(channel));
		});
	}

	async joinChannel(channelId) {
		await this.API.post(`channels/${channelId}/members/add`, {
			members: [this.userinfo.id],
		}).then((res) => this.addChannel(channelId));
	}

	addChannel(channel) {
		this.#messageMap.set(channel, new MessageArray());
		this.#memberMap.set(channel, new MessageArray());

		this.channelTemplate.prepend(channel);
	}

	hasChannel(channelId) {
		return this.#memberMap.hasId(channelId);
	}

	hasPrivateChannelWith(userId) {}

	async activateChannel(channelId) {
		if (!this.#messageMap.has(channelId)) return;

		this.messageTemplate.clear();
		this.currentChannelId = channelId;

		this.#messageMap.get(channelId).hasNext = true;

		await this.loadMessage();
	}

	async leaveChannel(channelId) {}

	/*
	메세지배열 : 인덱스 숫자가 낮을 수록 최근
	더 불러오면 뒤에 붙이기
	*/

	// TODO : 비동기 버그
	async loadMessage() {
		const MESSAGES = this.#messageMap.get(this.currentChannelId);
		if (!MESSAGES.hasNext) return;

		const isNewMessageLoad = MESSAGES.length < 1;

		let requestURL = `channels/${this.currentChannelId}/messages`;
		if (!isNewMessageLoad) requestURL += `/lastMessageId=${MESSAGES.getLast().id}`;

		await this.API.get(requestURL).then((/** @type Array */ response) => {
			MESSAGES.hasNext = response.hasNext;
			let responseMessages = response.messages;

			if (isNewMessageLoad) {
				MESSAGES.front(...responseMessages.reverse());
				responseMessages.forEach((message) => this.messageTemplate.append(message));

				CommonDOMevent.scrollDown();
			} else {
				CommonDOMevent.scroll.saveLocation();

				MESSAGES.push(...responseMessages);
				responseMessages.forEach((message) => this.messageTemplate.prepend(message));

				CommonDOMevent.scroll.restoreLocation();
			}
		});
	}

	receiveMessage(message) {
		this.#messageMap.get(this.currentChannelId).push(message);

		this.messageTemplate.append(message);
		this.channelTemplate.setLastMessageText(message);

		// if (this.CHAT.currentChannelId != event.message.channelId)
		// 	this.CHAT.notifyMessage(event.message);

		if (message.channelId != this.currentChannelId) this.#notifyMessage(message);

		if (message.userId == User.INFO.id) CommonDOMevent.scrollDown();
	}

	#notifyMessage(message) {
		let body;
		let type = message.data.type;

		switch (type) {
			case "text":
				body = message.text;
				break;
			case "file":
				body = "[파일]";
				break;
			case "image":
				body = "[이미지]";
				break;
			case "video":
				body = "[동영상]";
				break;
		}

		if (type) this.messageTemplate.notify(message.username, body);
	}

	sendTextMessasge(messageText) {
		let body = {
			senderId: User.INFO.id,
			text: messageText,
		};

		this.API.post("channels/" + this.currentChannelId + "/messages", body).catch((err) => {
			console.log(err);
		});
	}

	async sendImageMessage(file) {
		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		await this.API.postForm("channels/" + this.currentChannelId + "/messages", body)
			.then((res) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(err);
			});

		console.log("sendImageMessage");
	}

	async sendVideoMessage(file) {
		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		await this.API.postForm("channels/" + this.currentChannelId + "/messages", body)
			.then((res) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async sendFileMessage(file) {
		let body = {
			senderId: User.INFO.id,
			type: "file",
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		await this.API.postForm("channels/" + this.currentChannelId + "/messages", body)
			.then((res) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
