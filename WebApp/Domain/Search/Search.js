import User from "../User/User.js";

export default class Search {
	#div;
	#input;
	#noResult;

	constructor() {
		this.#div = $(".search");
		this.#input = $("#searchInput");
		this.button = $("#searchButton");

		this.#noResult = $(`<p>검색 결과가 없습니다.</p>`);

		this.#initDOMevent();
	}

	#initDOMevent() {
		this.#input.on("keypress", (/** @type KeyboardEvent */ e) => {
			let searchValue = $(e.target).val();

			if (e.keyCode == 13 && searchValue) this.search($(e.target).val());
		});

		this.button.on("click", () => this.toggle);

		this.clear();
	}

	clear() {
		this.#input.val("");
		this.#div.find(".result").find("p, a").remove();
		// this.#div.find(".result-title").append(this.#noResult);
	}

	hide() {
		this.#div.hide();
	}

	toggle() {
		let display = this.#div.css("display");

		if (display == "none") {
			this.#input.val("");
			this.#div.show();
			this.#input.trigger("focus");
		} else this.hide();
	}

	// TODO : 세션 CI와 동기화 후 세션 활용해서 userId 서버에서 활용하기
	// TODO : 클릭시 채널이동
	// TODO : 메세지 클릭 시 채널이동 -> 메세지 찾기
	async search(text) {
		this.clear();

		this.#searchChannels(text);
		this.#searchMessages(text);
		this.#searchMembers(text);
	}

	async #searchChannels(text) {
		return User.CHAT_API.get(`search/channels/${User.INFO.id}/${text}`).then((res) => {
			if (res.length < 1) $("#searchChannels").append(this.#noResult.clone());
			else {
				for (const channel of res) {
					$("#searchChannels").append(`<a> ${channel.name} </a>`);
				}
			}
		});
	}

	async #searchMessages(text) {
		return User.CHAT_API.get(`search/messages/${User.INFO.id}/${text}`).then((res) => {
			if (res.length < 1) $("#searchMessages").append(this.#noResult.clone());
			else {
				for (const message of res) {
					$("#searchMessages").append(`<a> ${message.text} </a>`);
				}
			}
		});
	}

	async #searchMembers(text) {
		return User.CHAT_API.get(`search/users/${User.INFO.id}/${text}`).then((res) => {
			if (res.length < 1) $("#searchUsers").append(this.#noResult.clone());
			else {
				for (const user of res) {
					console.log(user);
					$("#searchUsers").append(`<a> ${user.username} </a>`);
				}
			}
		});
	}
}
