import User from "../User/User.js";
import MessageTemplate from "./Template/MessageTemplate.js";

class MessageArray extends Array {
	constructor(elements) {
		if (Array.isArray(elements)) super(...elements);
		else super(elements);
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
		});
	}

	async load() {
		super.clear();

		let requestURL = `channels/${this.#channelId}/messages`;
		await User.CHAT_API.get(requestURL).then((data) => {
			this.array = new MessageArray(data.messages);
			super.prependAll(data.messages);
			this.hasHistory = data.hasHistory;
		});
	}

	async loadMore() {
		let oldestMessageObj = this.array.getOldest();

		if (!this.hasHistory) return false;
		else if (!oldestMessageObj) return false;

		let requestURL = `channels/${this.#channelId}/messages`;
		requestURL += `?lastMessageId=${oldestMessageObj.id}`;

		User.CHAT_API.get(requestURL).then((data) => {
			// console.log(data);
			this.array.push(...data.messages);
			super.prependAll(data.messages, true);
			this.hasHistory = data.hasHistory;

			// console.log($("#messageList").outerHeight());
			// console.log($("#messageList").height());
			// console.log($("#messageList").prop("scrollHeight"));
		});
	}

	sendText(text) {
		let requestURL = `channels/${this.#channelId}/messages`;
		let body = { senderId: User.INFO.id, text: text };

		// TODO : 예외 처리
		User.CHAT_API.post(requestURL, body).catch((err) => console.log(err));
	}

	sendFile(file) {
		let body = {
			senderId: User.INFO.id,
			type: "file",
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		User.CHAT_API.postForm("channels/" + this.#channelId + "/messages", body)
			.then((res) => res)
			.catch((err) => console.log(err));
	}

	sendImage(file) {
		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		User.CHAT_API.postForm("channels/" + this.#channelId + "/messages", body)
			.then((res) => {
				console.log(res);
				res;
			})
			.catch((err) => console.log(err));
	}

	sendVideo(file) {
		let body = {
			senderId: User.INFO.id,
			type: file.type.split("/")[0],
			file: file,
			fileName: file.name,
			fileSize: file.size,
		};

		User.CHAT_API.postForm("channels/" + this.#channelId + "/messages", body)
			.then((res) => res)
			.catch((err) => console.log(err));
	}
}
