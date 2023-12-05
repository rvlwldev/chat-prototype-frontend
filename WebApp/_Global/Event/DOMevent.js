export default class CommonDOMevent {
	constructor() {}

	static initializeDefaultDOMeventListner() {
		$("#imageBtn").on("click", (e) => {
			e.preventDefault();
			$("#image").trigger("click");
		});

		$("#videoBtn").on("click", (e) => {
			e.preventDefault();
			$("#video").trigger("click");
		});

		$("#fileBtn").on("click", (e) => {
			e.preventDefault();
			$("#file").trigger("click");
		});

		$("#sendBtn").on("click", (e) => {
			e.preventDefault();
		});

		// TODO : 검색기능
		$("#searchInput");
	}

	static setMessageInputEnterCallback(callback) {
		$("#textInput").on("keypress", (e) => {
			let messageText = $("#textInput").val();
			if (e.keyCode == 13 && messageText) {
				callback.bind(this)(messageText);

				$("#textInput").val("");
			}
		});
	}

	static setMessageSendButtonCallback(callback) {
		$("#sendBtn").on("click", (e) => {
			let messageText = $("#textInput").val();
			callback.bind(this)(messageText);

			$("#textInput").val("");
		});
	}

	static setImageSendCallback(callback) {
		$("#image").on("change", (e) => {
			let file = e.target.files[0];
			if (!file) return;
			callback.bind(this)(file);
			$("#image").val("");
		});
	}
	static setVideoSendCallback(callback) {
		$("#video").on("change", (e) => {
			let file = e.target.files[0];
			if (!file) return;
			callback.bind(this)(file);
			$("#video").val("");
		});
	}
	static setFileSendCallback(callback) {
		$("#file").on("change", (e) => {
			let file = e.target.files[0];
			if (!file) return;
			callback.bind(this)(file);
			$("#file").val("");
		});
	}

	static scroll = {
		height: 0,

		down: () => {
			let target = $("#messageList");
			target.scrollTop(target.prop("scrollHeight"));
		},

		saveLocation: () => {
			let height = 0;

			$("#messageList")
				.children()
				.each((i, child) => {
					height += $(child).height();
				});

			CommonDOMevent.scroll.height = height;
		},
		restoreLocation: () => {
			let currentHeight = 0;

			$("#messageList")
				.children()
				.each((i, child) => {
					currentHeight += $(child).height();
				});

			$("#messageList").scrollTop(currentHeight - CommonDOMevent.scroll.height);
		},

		isScrollingUp: false,

		setEvent: function () {
			const event = async (e) => {
				const currentScrollTop = $("#messageList").scrollTop();

				if (currentScrollTop === 0) {
					if (!CommonDOMevent.scroll.isScrollingUp) {
						CommonDOMevent.scroll.isScrollingUp = true;
						this.currentMessage.loadMore();
					}
				} else CommonDOMevent.scroll.isScrollingUp = false;
			};

			$("#messageList").on("scroll", async (e) => await event(e));
			$("#messageList").on("wheel", async (e) => await event(e));
		},
	};

	// static setScrollEvent(callback) {
	// 	let isScrollingUp = false;
	// 	let savedScrollTop = 0;

	// 	// 스크롤 타겟 선택
	// 	const $messageList = $("#messageList");

	// 	$messageList.on("scroll", (e) => {
	// 		const currentScrollTop = $messageList.scrollTop();

	// 		// 스크롤이 최상단에 도달했을 때
	// 		if (currentScrollTop === 0) {
	// 			if (!isScrollingUp) {
	// 				// 최상단에 도달하면서 처음으로 스크롤을 위로 올린 경우에만 콜백 실행
	// 				isScrollingUp = true;
	// 				savedScrollTop = currentScrollTop;
	// 				callback.bind(this)();
	// 			}
	// 		} else {
	// 			// 스크롤이 최상단이 아닌 경우 플래그 초기화
	// 			isScrollingUp = false;
	// 		}
	// 	});

	// 	// 이벤트가 끝날 때 스크롤 위치 복원
	// 	$messageList.on("scrollend", () => {
	// 		$messageList.scrollTop(savedScrollTop);
	// 	});
	// }
}
