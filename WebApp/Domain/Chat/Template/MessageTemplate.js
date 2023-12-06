import Stringify from "../../../Util/Stringify.js";
import CommonDOMevent from "../../../_Global/Event/DOMevent.js";
import User from "../../User/User.js";
import Chat from "../Chat.js";
import MessageEvent from "../Event/MessageEvent.js";

export default class MessageTemplate extends MessageEvent {
	constructor() {
		super();
	}

	append(message) {
		const HTML = this.getHTML(message);
		this.onUserImageClickEvent(HTML);
		this.onUserImageContextMenuEvent(HTML);

		$("#messageList").append(HTML);

		if (message.userId === User.INFO.id) CommonDOMevent.scroll.down();
	}

	appendAll(messageArray) {
		messageArray.forEach((message) => this.append(message, false));
	}

	prepend(message, scrollDown = true) {
		const HTML = this.getHTML(message);
		this.onUserImageClickEvent(HTML);
		this.onUserImageContextMenuEvent(HTML);

		$("#messageList").prepend(HTML);

		if (scrollDown) CommonDOMevent.scroll.down();
	}

	prependAll(messageArray) {
		messageArray.forEach((message) => this.prepend(message));
	}

	clear() {
		$("#messageList").find("div").remove();
	}

	getHTML(message) {
		let type = message.type;

		const isUserMessage = message.userId == User.INFO.id;

		switch (type) {
			case "text":
				return isUserMessage ? this.toMyTextHTML(message) : this.toTextHTML(message);
			case "file":
				return isUserMessage ? this.toMyFileHTML(message) : this.toFileHTML(message);
			case "image":
				return isUserMessage ? this.toMyImageHTML(message) : this.toImageHTML(message);
			case "video":
				return isUserMessage ? this.toMyVideoHTML(message) : this.toVideoHTML(message);
		}

		throw new Error("올바르지 않은 메세지");
	}

	toMyTextHTML(message) {
		return $(`
			<div class="message me" data-userId="${message.userId}" data-messageId="${message.id}">
				<div class="bubble">${message.text}</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toMyFileHTML(message) {
		return $(`
			<div class="message me" data-userId="${message.userId}" data-messageId="${message.id}">
				<div class="bubble file">
					<div class="file-name">${message.fileName}</div>
					<div class="file-size">용량: ${Stringify.formatBytes(message.fileSize)}</div>
					<a class="file-download" href="${message.filePath}" target="_blank" download>
						<img src="${Chat.DOWNLOAD_BUTTON_WHITE_IMAGE}">
					</a>
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toMyImageHTML(message) {
		return $(`
			<div class="message me" data-userId="${message.userId}" data-messageId="${message.id}">
				<img class="image" src="${message.filePath}">
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toMyVideoHTML(message) {
		let extension = Stringify.getExtension(message.filePath);

		return $(`
			<div class="message me" data-userId="${message.userId}" data-messageId="${message.id}">
				<video class="video" controls>
					<source src="${message.filePath}" type="video/${extension}">
				</video>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}

	toTextHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message"  data-userId="${message.userId}" data-messageId="${message.id}">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<div class="bubble">${message.text}</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toFileHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<div class="bubble">
					<div class="file">
						<div class="file-name">${message.fileName}</div>
						<div class="file-size">용량: ${Stringify.formatBytes(message.fileSize)}</div>
						<a class="file-download" href="${message.filePath}" target="_blank" download>
							<img src="${Chat.DOWNLOAD_BUTTON_BLACK_IMAGE}">
						</a>
					</div>
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toImageHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message" data-userId="${message.userId}" data-messageId="${message.id}">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<img class="image" src="${message.filePath}">
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toVideoHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;
		let extension = Stringify.getExtension(message.filePath);

		return $(`
			<div class="message"  data-userId="${message.userId}" data-messageId="${message.id}">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>

				<video class="video" controls>
					<source src="${message.filePath}" type="video/${extension}">
				</video>

				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
}
