import Renderer from "../../_Global/Event/Renderer.js";
import Search from "../Search/Search.js";
import User from "../User/User.js";

import Channel from "./Channel.js";
import Message from "./Message.js";

class ChatMap extends Map {
	constructor() {
		super();
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
	static isSDKeventInit = false;

	static NO_CHANNEL_IMAGE_URL;
	static NO_USER_PROFILE_IMAGE_URL;
	static DOWNLOAD_BUTTON_WHITE_IMAGE_URL;
	static DOWNLOAD_BUTTON_BLACK_IMAGE_URL;

	/** @type { Channel } */
	currentChannel;

	/** @type { Message }*/
	currentMessage;

	/** @type { ChatMap } */
	chatMap = new ChatMap();

	constructor() {
		this.search = new Search();

		this.#initialize();
	}

	async #initialize() {
		if (!Chat.isSDKeventInit) {
			window.CHAT = this;

			await this.#initAssets();
			await this.#initializeSDKeventListner();
			await this.#initChannels();
			this.#initShortcut();
			Chat.isSDKeventInit = true;
		} else throw new Error("isSDKeventInit is already true");
	}

	async #initializeSDKeventListner() {
		await User.TALKPLUS_CLIENT.on("event", async (event) => {
			if (event.type === "message") {
				this.receiveMessage(event.message);
			} else if (event.type === "channelAdded") {
				this.receiveChannel(event.channel);
			} else if (event.type === "channelRemoved") {
				console.log("one of my channels was removed");
			} else if (event.type === "memberAdded") {
				console.log("new channel member");
			} else if (event.type === "memberLeft") {
				console.log("channel member left");
			}
		});
	}

	async #initAssets() {
		let imageUrl;

		imageUrl = await User.assetHandler.getStaticFileDataURL("no_picture_user.png");
		Chat.NO_CHANNEL_IMAGE_URL = await User.assetHandler.getStaticFileDataURL(
			"no_picture_user.png"
		);

		imageUrl = await User.assetHandler.getStaticFileDataURL("no_picture_user.png");
		Chat.NO_USER_PROFILE_IMAGE_URL = await User.assetHandler.getStaticFileDataURL(
			"no_picture_user.png"
		);

		imageUrl = await User.assetHandler.getStaticFileDataURL("download_white.png");
		Chat.DOWNLOAD_BUTTON_WHITE_IMAGE_URL = await User.assetHandler.getStaticFileDataURL(
			"download_white.png"
		);

		imageUrl = await User.assetHandler.getStaticFileDataURL("download_black.png");
		Chat.DOWNLOAD_BUTTON_BLACK_IMAGE_URL = await User.assetHandler.getStaticFileDataURL(
			"download_black.png"
		);
	}

	async #initChannels() {
		await User.CHAT_API.get(`channels/${User.INFO.id}`).then((channels) => {
			channels.forEach((channel) => {
				this.chatMap.set(new Channel(channel), new Message(channel.id));
			});
		});
	}

	#initShortcut() {
		$(document).on("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "f") {
				e.preventDefault();
				this.search.toggle();
			}
		});
	}

	// TODO : 예외 처리
	// TODO : 스크롤 최하단 이동 버그
	// 이미지/동영상 등이 많을때, 태그를 다 붙여 넣고 스크롤 다운 -> 동영상/이미지 등이
	// lazyLoading되면서 스크롤이 밀려 올라감... (Promise 처리?)
	activateChannel(channelId) {
		this.currentChannel = this.chatMap.getChannel(channelId);
		this.currentChannel.showName();

		this.search.hide();

		this.currentMessage = this.chatMap.getMessage(channelId);
		this.currentMessage.load();
	}

	receiveChannel(channelObj) {
		this.chatMap.set(new Channel(channelObj), new Message(channelObj.id));
	}

	async receiveMessage(messageObj) {
		let isCurrentChannel = messageObj.channelId == this.currentChannel.id;

		if (isCurrentChannel) await this.currentMessage.loadReceivedMessage(messageObj);
		else this.chatMap.getChannel(messageObj.channelId).increaseUnreadCount();
	}

	async sendMessage(obj) {
		/** @type { Message }*/
		const message = this.chatMap.getMessage(this.currentChannel.id);

		if (typeof obj == "string") await message.sendText(obj);
		else if (obj instanceof File) {
			if (obj.type.includes("image")) await message.sendImage(obj);
			else if (obj.type.includes("video")) await message.sendVideo(obj);
			else await message.sendFile(obj);
		}
	}

	// TODO : noti 알람
	notify(messageObj) {
		let title = messageObj.channelId;
		let body = messageObj.senderId + " : " + messageObj.text;

		Renderer.notify(title, body);
	}
}
