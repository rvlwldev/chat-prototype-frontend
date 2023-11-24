import { ChannelEvent } from "../Event/Channel.js";

import { Chat } from "../Chat.js";

export class ChannelTemplate extends ChannelEvent {
	#main;
	constructor(_main) {
		super(_main);
		this.#main = _main;
	}

	prepend(channel) {
		const HTML = this.getHTML(channel);
		this.setChannelClickEvent(HTML);
		$("#channelList").prepend(HTML);
	}

	prependAll(channels) {
		channels.forEach((channel) => this.prepend(channel));
	}

	getName(channel) {
		let name = channel.name;

		if (channel.type.indexOf("private") > -1) {
			let members = new Array();

			for (const MEMBER of channel.members) {
				if (Chat.USER.id != MEMBER.id) members.push(MEMBER);
			}

			name = channel.members[0].username;
			if (members.length > 2) name += " 외" + members.length - 1 + "명";
		}

		return name;
	}

	getHTML(channel) {
		let name = this.getName(channel);

		let imageUrl = channel.imageUrl ? channel.imageUrl : Chat.NO_CHANNEL_IMAGE;
		let lastText = channel.lastMessage ? channel.lastMessage.text : "";
		let lastMessageId = channel.lastMessage ? channel.lastMessage.id : "";

		if (lastText.length > 10) lastText = lastText.slice(0, 9) + "...";

		return $(`
			<li data-id="${channel.id}">
				<a href="">
				<img src="${imageUrl}" alt="Avatar"> 
				<div class="contact">
					<div class="name" data-time="${channel.updatedAt}">${name}</div>
					<div class="message" data-lastMessageId="${lastMessageId}">${lastText}</div>
				</div>
				</a>
			</li>
		`);
	}

	setLastMessageText(message) {
		const channelId = message.channelId;
		const lastMessageId = message.id;
		const lastMessageText = message.text;

		const targetLi = $('li[data-id="' + channelId + '"]');

		targetLi.attr("data-lastmessageid", lastMessageId);
		targetLi.find(".message").attr("data-lastmessageid", lastMessageId).text(lastMessageText);
	}

	active(channelId) {
		$("#channelList li").removeClass("active");
		$(`#channelList li[data-id="${channelId}"]`).addClass("active");
	}

	clear() {
		$("#channelList").find("li").remove();
		$("#channelTitle").text("");
	}
}
