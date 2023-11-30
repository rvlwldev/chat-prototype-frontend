import { Chat } from "../Chat.js";

export class ChannelEvent {
	/** @type Chat*/ #main;

	constructor(main) {
		this.#main = main;
	}

	setChannelClickEvent(HTML) {
		HTML.find("a").on("click", (/** @type Event */ e) => {
			e.preventDefault();

			const li = $(e.target).closest("li");
			if (li.hasClass("active")) return;

			$("#channelList").find("li").removeClass("active");
			li.addClass("active");

			let channelId = li.data("id");

			this.#main.activateChannel(channelId);
		});
	}
}
