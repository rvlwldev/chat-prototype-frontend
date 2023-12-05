export default class ChannelEvent {
	constructor() {}

	setChannelClickEvent(HTML) {
		HTML.find("a").on("click", (/** @type Event */ e) => {
			e.preventDefault();

			const li = $(e.target).closest("li");
			if (li.hasClass("active")) return;

			$("#channelList").find("li").removeClass("active");
			li.addClass("active");

			let channelId = li.data("id");

			window.CHAT.activate(channelId);
		});
	}
}
