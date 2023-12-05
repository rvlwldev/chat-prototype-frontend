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

	toMyImageHTML(message) {
		return $(`
			<div class="message me">
				<img class="image" src="${message.filePath}">
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			  </div>
		`);
	}
	toMyVideoHTML(message) {
		let extension = Stringify.getExtension(message.filePath);

		return $(`
			<div class="message me">
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					<video class="video" controls>
						<source src="${message.filePath}" type="video/${extension}">
					</video>
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toMyFileHTML(message) {
		return $(`
			<div class="message me">
				<div class="file-info">
					<div class="file-name">${message.fileName}</div>
					<div class="file-size">용량: ${Stringify.formatBytes(message.fileSize)}</div>
					<a class="download-link" href="${message.filePath}" target="_blank" download>
						Download
					</a>
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toMyTextHTML(message) {
		return $(`
			<div class="message me">
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					${message.text}
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}

	toImageHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message">
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
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					<video class="video" controls>
						<source src="${message.filePath}" type="video/${extension}">
					</video>
				</div>
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
				
				<div class="file-info">
					<div class="file-name">${message.fileName}</div>
					<div class="file-size">용량: ${Stringify.formatBytes(message.fileSize)}</div>
					<a class="download-link" href="${message.filePath}" target="_blank" download>
						Download
					</a>
				</div>

				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
	toTextHTML(message) {
		let userImage = message.profileImageUrl || Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					${message.text}
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
}
