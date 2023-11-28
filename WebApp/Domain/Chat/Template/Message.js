import { MessageEvent } from "../Event/Message.js";
import { User } from "../../User/User.js";
import { Stringify } from "../../../Util/Stringify.js";
import { Chat } from "../Chat.js";

export class MessageTemplate extends MessageEvent {
	constructor(_self) {
		super(_self);
	}

	// TODO : event
	append(message) {
		const HTML = this.getHTML(message);
		this.onUserImageClickEvent(HTML);
		this.onUserImageContextMenuEvent(HTML);

		$("#messageList").append(HTML);
	}

	// TODO : event
	prepend(message) {
		const HTML = this.getHTML(message);
		this.onUserImageClickEvent(HTML);
		this.onUserImageContextMenuEvent(HTML);

		$("#messageList").prepend(HTML);
	}

	prependAll(messages) {
		messages.forEach((message) => this.prepend(message));
	}

	appendAll(messages) {
		messages.forEach((message) => this.append(message));
	}

	clear() {
		$("#messageList").find("div").remove();
	}

	getHTML(message) {
		let type = message.data.type;

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
			default:
				console.log("올바르지 않은 메세지");
				console.log(message);
				return isUserMessage ? this.toMyTextHTML(message) : this.toTextHTML(message);
		}
	}

	toMyImageHTML(message) {
		return $(`
			<div class="message me">
				<img class="image" src="${message.data.filePath}">
				<div class="time">1월 1일 오전 04:23</div>
			  </div>
		`);
	}
	toMyVideoHTML(message) {
		let extension = Stringify.getExtension(message.data.filePath);

		return $(`
			<div class="message me">
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					<video class="video" controls>
						<source src="${message.data.filePath}" type="video/${extension}">
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
					<div class="file-name">${message.data.fileName}</div>
					<div class="file-size">용량: ${Stringify.formatBytes(message.data.fileSize)}</div>
					<a class="download-link" href="${message.data.filePath}" target="_blank" download>
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
		let userImage = message.profileImageUrl
			? message.profileImageUrl
			: Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<img class="image" src="${message.data.filePath}">
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}

	toVideoHTML(message) {
		let userImage = message.profileImageUrl
			? message.profileImageUrl
			: Chat.NO_USER_PROFILE_IMAGE;

		let extension = Stringify.getExtension(message.data.filePath);

		return $(`
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					<video class="video" controls>
						<source src="${message.data.filePath}" type="video/${extension}">
					</video>
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}

	toFileHTML(message) {
		let userImage = message.profileImageUrl
			? message.profileImageUrl
			: Chat.NO_USER_PROFILE_IMAGE;

		return $(`
			<div class="message">
				<img class="user-image" src="${userImage}">
				<div class="name">${message.username}</div>
				
				<div class="file-info">
					<div class="file-name">${message.data.fileName}</div>
					<div class="file-size">용량: ${Stringify.formatBytes(message.data.fileSize)}</div>
					<a class="download-link" href="${message.data.filePath}" target="_blank" download>
						Download
					</a>
				</div>

				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}

	toTextHTML(message) {
		let userImage = message.profileImageUrl
			? message.profileImageUrl
			: Chat.NO_USER_PROFILE_IMAGE;

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
