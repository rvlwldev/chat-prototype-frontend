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
		console.log(`channels/${channelId}`);

		return await User.CHAT_API.get(`channels/${channelId}/info`).then((res) =>
			this.append(res)
		);
	}

	showName() {
		super.showName(this.name);
	}

	async join() {
		return await User.CHAT_API.post(`channels/${this.id}/members/add`, {
			members: [User.INFO.id],
		}).then((channel) => {
			super.append(channel);
			return channel;
		});
	}

	leave() {}
}
