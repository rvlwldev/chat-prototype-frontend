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
				return isUserMessage ? this.toMyTextHTML(message) : this.toFileHTML(message);
			case "image":
				return isUserMessage ? this.toMyTextHTML(message) : this.toImageHTML(message);
			case "video":
				return isUserMessage ? this.toMyTextHTML(message) : this.toVideoHTML(message);
			default:
				console.error("올바르지 않은 메세지");
				console.error(message);
				break;
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
		console.log("비디오 어펜드!");
	}
	toMyFileHTML(message) {
		console.log("파일 어펜드!");
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

	toImageHTML(message) {}
	toVideoHTML(message) {}
	toFileHTML(message) {}
	toTextHTML(message) {
		return $(`
			<div class="message">
				<img class="user-image" src="${
					message.profileImageUrl ? message.profileImageUrl : Chat.NO_USER_PROFILE_IMAGE
				}">
				<div class="name">${message.username}</div>
				<div class="bubble" data-userId="${message.userId}" data-messageId="${message.id}">
					${message.text}
				</div>
				<div class="time">${Stringify.getTimestampsString(message.createdAt)}</div>
			</div>
		`);
	}
}
