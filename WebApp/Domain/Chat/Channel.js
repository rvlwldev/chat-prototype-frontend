import User from "../User/User.js";
import ChannelTemplate from "./Template/ChannelTemplate.js";

export default class Channel extends ChannelTemplate {
	id;
	name;
	type;

	constructor(channelObj) {
		super();

		if (typeof channelObj == "object") {
			this.id = channelObj.id;
			this.name = channelObj.name;
			this.type = channelObj.type;
			this.append(channelObj);
		} else if (typeof channelObj == "string") this.#getInitChannelInfo(channelObj);
	}

	async #getInitChannelInfo(channelId) {
		return await User.CHAT_API.get(`channels/${channelId}`).then((res) => this.append(res));
	}

	increaseUnreadCount() {
		let currentCount = this.getCurrentUnreadcount(this.id);

		if (!currentCount) this.setUnreadcount(this.id, 1);
		else {
			let count = parseInt(currentCount.replace(/[^0-9]/g, "")) || 0;
			count++;

			this.setUnreadcount(this.id, count);
		}
	}

	showName() {
		super.showName(this.name);
	}

	async join() {
		return await User.CHAT_API.post(`channels/${this.id}/users`, {
			users: [User.INFO.id],
		}).then((channel) => {
			super.append(channel);
			return channel;
		});
	}

	leave() {}
}
