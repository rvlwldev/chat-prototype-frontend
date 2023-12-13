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
	/** @type String */
	const ID = $("#username").val();
	const PW = $("#password").val();
	const DB = "cug";

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

$("#register").on("click", (e) => registerUser());
async function registerUser() {
	const ID = $("#register-userId").val();
	const NM = $("#register-username").val();
	const PW = $("#register-password").val();
	const RE_PW = $("#register-password-confirm").val();

	if (PW !== RE_PW) {
		appAlert("비밀번호를 확인해주세요");
		document.getElementById("register-password").focus();
		return;
	}

	let check = await $.ajax({
		type: "POST",
		url: "http://localhost:3000/users/check",
		data: {
			id: ID,
			pw: PW,
		},

		success: (res) => res,

		error: (err) => {
			if (err.status == 409) appAlert("아이디 중복");
			else {
				console.log(err);
				appAlert("내부 서버 오류");
			}

			return false;
		},
	});

	if (!check) return;

	await $.ajax({
		type: "POST",
		url: "http://localhost:3000/users/register",
		data: {
			id: ID,
			name: NM,
			pw: PW,
		},
		success: (data) => redirectToApp({ id: data.userId, name: data.username }),
		error: (err) => {
			console.log(err);
			appAlert("내부 서버 오류");
		},
	});
}

function redirectToApp(userinfo) {
	sessionStorage.setItem("userinfo", JSON.stringify(userinfo));

	window.location.href = "./index.html";
}
