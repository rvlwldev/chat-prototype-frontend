import Renderer from "../../_Global/Event/Renderer.js";
import User from "../User/User.js";

import Channel from "./Channel.js";
import Message from "./Message.js";

class ChatMap extends Map {
	constructor(entries) {
		super(entries);
	}

	/**
	 * @param { String } channelId
	 * @returns { Message }
	 */
	getMessage(channelId) {
		// TODO : 채널 없으면 예외
		for (const [channel, message] of this) if (channel.id == channelId) return message;
		return undefined;
	}

	/**
	 * @param { String } channelId
	 * @returns { Channel }
	 */
	getChannel(channelId) {
		// TODO : 채널 없으면 예외
		for (const [channel] of this) if (channel.id == channelId) return channel;
		return undefined;
	}
}

export default class Chat {
	static NO_CHANNEL_IMAGE = "http://192.168.2.65:3000/asset/img/no_picture_user.png";
	static NO_USER_PROFILE_IMAGE = "http://192.168.2.65:3000/asset/img/no_picture_user.png";

	static isSDKeventInit = false;

	/** @type { Channel } */
	currentChannel;

	/** @type { Message }*/
	currentMessage;

	/** @type { ChatMap } */
	chatMap = new ChatMap();

	constructor() {
		if (!Chat.isSDKeventInit) {
			window.CHAT = this;

			this.#initializeSDKeventListner();
			this.#initChannels();

			Chat.isSDKeventInit = true;
		}
	}

	async #initializeSDKeventListner() {
		await User.TALKPLUS_CLIENT.on("event", (event) => {
			if (event.type === "message") this.receiveMessage(event.message);
			else if (event.type === "channelAdded") this.receiveChannel(event.channel);
			else if (event.type === "channelRemoved") {
				console.log("one of my channels was removed");
			} else if (event.type === "memberAdded") {
				console.log("new channel member");
			} else if (event.type === "memberLeft") {
				console.log("channel member left");
			}
		});
	}

	async #initChannels() {
		await User.CHAT_API.get(`channels/${User.INFO.id}`).then((channels) => {
			channels.forEach((channel) => {
				this.chatMap.set(new Channel(channel), new Message(channel.id));
			});
		});
	}

	// TODO : 예외 처리
	activate(channelId) {
		this.currentChannel = this.chatMap.getChannel(channelId);
		this.currentChannel.showName();

		this.currentMessage = this.chatMap.getMessage(channelId);
		this.currentMessage.load();
	}

	receiveChannel(channelObj) {
		this.chatMap.set(new Channel(channelObj), new Message(channelObj.id));
	}

	sendMessage(obj) {
		/** @type { Message }*/
		const message = this.chatMap.getMessage(this.currentChannel.id);

		if (typeof obj == "string") message.sendText(obj);
		else if (obj instanceof File) {
			if (obj.type.includes("image")) {
				console.log("image message send");
				message.sendImage(obj);
			} else if (obj.type.includes("video")) {
				console.log("video message send");
				message.sendVideo(obj);
			} else {
				console.log("file message send");
				message.sendFile(obj);
			}
		}
	}

	receiveMessage(messageObj) {
		if (messageObj.channelId == this.currentChannel) currentMessage.receive(messageObj);
		else {
			this.chatMap.getMessage(messageObj.channelId).receive(messageObj);
			// this.notify(messageObj);
		}
	}

	// TODO : noti 알람
	notify(messageObj) {
		let title = messageObj.channelId;
		let body = messageObj.senderId + " : " + messageObj.text;

		Renderer.notify(title, body);
	}
}
