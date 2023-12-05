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

	getHTML(channel) {
		return $(`
			<li data-id="${channel.id}">
				<a href="">
				<img src="${"http://192.168.2.65:3000/asset/img/no_picture_user.png"}"> 
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
