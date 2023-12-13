import Chat from "../Chat.js";
import ChannelEvent from "../Event/ChannelEvent.js";

export default class ChannelTemplate extends ChannelEvent {
	constructor() {
		super();
	}

	append(channel) {
		const HTML = this.getHTML(channel);
		this.setChannelClickEvent(HTML);
		$("#channelList").append(HTML);
	}

	clear() {
		$("#channelList").find("li").remove();
	}

	showName(name) {
		$(".message-header").find("#channelTitle").text(name);
	}

	getCurrentUnreadcount(channelId) {
		return $("li[data-id='" + channelId + "'] a")
			.find(".unread-count")
			.text();
	}

	setUnreadcount(channelId, count) {
		let counter = $(`<div class="unread-count">${count}</div>`);

		$("li[data-id='" + channelId + "'] a")
			.find(".unread-count")
			.remove();

		$("li[data-id='" + channelId + "'] a").append(counter);
	}

	removeUnreadCount(channelId) {
		$("li[data-id='" + channelId + "'] a")
			.find(".unread-count")
			.remove();
	}

	getHTML(channel) {
		return $(`
			<li data-id="${channel.id}">
				<a href="">
				<img src="${Chat.NO_CHANNEL_IMAGE_URL}"> 
				<div class="contact">
					<div class="name" data-time="${channel.updatedAt}">${channel.name}</div>
				</div>
				</a>
			</li>
		`);

		// lastMessage
		// <div class="message" data-lastMessageId="${lastMessageId}">${lastText}</div>
	}
}
