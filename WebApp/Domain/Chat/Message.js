import CommonDOMevent from "../../_Global/Event/DOMevent.js";
import User from "../User/User.js";
import MessageTemplate from "./Template/MessageTemplate.js";

class MessageArray extends Array {
	constructor(elements) {
		if (Array.isArray(elements)) super(...elements);
		else if (elements) super(elements);
		else super();
	}

	getLatest() {
		return this[0];
	}

	getOldest() {
		return this[this.length - 1];
	}
}

export default class Message extends MessageTemplate {
	#channelId;

	array;
	hasHistory;

	constructor(channelId) {
		super();

		this.#channelId = channelId;

		this.array = new MessageArray();
		this.hasHistory = true;
	}

	async receive(messageObj) {
		let messageId = messageObj.id;

		if (!messageId) throw new Error("잘못된 메세지 수신");

		let requestURL = `channels/${this.#channelId}/messages/${messageId}`;

		await User.CHAT_API.get(requestURL).then((data) => {
			super.append(data.message);
			this.array.push(data.message);
			CommonDOMevent.messageScroll.down();
		});
	}

	async load() {
		super.clear();

		let requestURL = `channels/${this.#channelId}/messages`;
		let lastestMessage = this.array.getLatest();

		if (this.array.length > 0 && lastestMessage)
			requestURL += `?lastMessageId=${lastestMessage.id}&order=latest`;

		await User.CHAT_API.get(requestURL).then((data) => {
			this.array.unshift(...data.messages);
			super.prependAll(this.array);
			this.hasHistory = data.hasHistory;
		});
	}

	async loadMore() {
		let oldestMessageObj = this.array.getOldest();

		if (!this.hasHistory || !oldestMessageObj) return false;

		let requestURL = `channels/${this.#channelId}/messages`;
		requestURL += `?lastMessageId=${oldestMessageObj.id}`;

		await User.CHAT_API.get(requestURL).then((data) => {
			this.array.push(...data.messages);
			super.prependAll(data.messages, true);
			this.hasHistory = data.hasHistory;
		});
	}

	async loadReceivedMessage(messageObj) {
		let requestURL = `channels/${this.#channelId}/messages/${messageObj.id}`;
		const message = await User.CHAT_API.get(requestURL).then((data) => data.message);

		try {
			this.array.push(message);
			if (message.userId != User.INFO.id) super.append(message, true);
		} catch (err) {
			await this.loadReceivedMessage(messageObj);
		}
	}

	async sendText(text) {
		let requestURL = `channels/${this.#channelId}/messages`;
		let body = { senderId: User.INFO.id, text: text };

		// TODO : 예외 처리
		await User.CHAT_API.post(requestURL, body)
			.then((res) => super.append(res, true))
			.catch((err) => console.log(err));
	}

	async sendFile(file) {
		let requestURL = `channels/${this.#channelId}/messages`;

		let body = {
			senderId: User.INFO.id,
			type: "file",
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		let sendMessage = await User.CHAT_API.postForm(requestURL, body)
			.then((res) => res)
			.catch((err) => console.log(err));

		super.append(sendMessage, true);
	}

	async sendImage(file) {
		let requestURL = `channels/${this.#channelId}/messages`;

		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		let sendMessage = await User.CHAT_API.postForm(requestURL, body)
			.then((res) => res)
			.catch((err) => console.log(err));

		super.append(sendMessage, true);
	}

	async sendVideo(file) {
		let requestURL = `channels/${this.#channelId}/messages`;

		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		let sendMessage = await User.CHAT_API.postForm(requestURL, body)
			.then((res) => res)
			.catch((err) => console.log(err));

		super.append(sendMessage, true);
	}
}
