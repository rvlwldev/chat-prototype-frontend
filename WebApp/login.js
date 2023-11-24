$("#username").on("keypress", (e) => {
	if (e.keyCode === 13) document.getElementById("password").focus();
});

$("#password").on("keypress", (e) => {
	if (e.keyCode === 13) CI_SERVER_LOGIN();
});

$("#login").on("click", (e) => CI_SERVER_LOGIN());

const appAlert = (message) => {
	if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.alert(message);
	else alert(message);
};

function CI_SERVER_LOGIN() {
	/** @type String */ const ID = $("#username").val();
	const PW = $("#password").val();
	const DB = "cug";

	// 개발용
	// admin01 ~ admin10
	if (ID.startsWith("admin")) {
		let name = "관리자" + ID.match(/\d+/g)[0];

		redirectToApp({
			id: ID,
			name: name,
		});

		return;
	}

	if (!ID || !PW) {
		appAlert("아이디/비밀번호를 입력해주세요");
		$("#username").focus();
		return;
	}

	$.ajax({
		type: "POST",
		url: "http://192.168.2.65/chatapi/login",
		data: {
			id: ID,
			pw: PW,
			intranet: DB,
		},
		success: (data) => redirectToApp(data),
		error: function (xhr, status, error) {
			console.log(status);
			if (xhr.responseText) appAlert(xhr.responseText);
		},
	});
}

function redirectToApp(userinfo) {
	// const userinfoString = encodeURIComponent(JSON.stringify(userinfo));
	// const url = "./WebApp/index.html?data=" + userinfoString;
	// window.location.href = url;

	const userinfoString = JSON.stringify(userinfo);

	// 사용자 정보를 sessionStorage에 저장
	sessionStorage.setItem("userinfo", userinfoString);

	// 대상 페이지로 리디렉션
	window.location.href = "./index.html";
}
