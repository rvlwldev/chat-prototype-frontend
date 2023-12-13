sessionStorage.setItem("userinfo", null);
const appAlert = (message) => {
	if (typeof nativeDesktopApp != "undefined") nativeDesktopApp.alert(message);
	else alert(message);
};

$("#username").on("keypress", (e) => {
	if (e.keyCode === 13) document.getElementById("password").focus();
});

$("#password").on("keypress", (e) => {
	if (e.keyCode === 13) LOGIN();
});

$("#login").on("click", (e) => LOGIN());

async function LOGIN() {
	const ID = $("#username").val();
	const PW = $("#password").val();

	if (!ID || !PW) {
		appAlert("아이디/비밀번호를 입력해주세요");
		$("#username").focus();
		return;
	}

	await $.ajax({
		type: "POST",
		url: "http://localhost:3000/users/login",
		data: { id: ID, pw: PW },
		success: (data) => redirectToApp(data),
		error: function (xhr, status, error) {
			console.log("error");
			if (xhr.responseText) appAlert(xhr.responseText);
		},
	});
}

$("#register").on("click", (e) => checkUser());
async function checkUser() {
	console.log("registerUser");

	const ID = $("#register-userId").val();
	const NM = $("#register-username").val();

	const PW = $("#register-password").val();
	const RE_PW = $("#register-password-confirm").val();

	if (PW !== RE_PW) {
		appAlert("비밀번호를 확인해주세요");
		document.getElementById("register-password").focus();

		return;
	}

	if (PW.length < 4) {
		appAlert("비번 4자 이상");
		document.getElementById("register-password").focus();
		return;
	}

	let check = await $.ajax({
		type: "POST",
		url: "http://localhost:3000/users/check",
		data: { id: ID, pw: PW },

		success: (res) => res,

		error: (err) => {
			if (err.status == 409) {
				appAlert("아이디 중복");
				document.getElementById("register-userId").focus();
			} else {
				appAlert("내부 서버 오류");
				console.log(err);
			}

			return false;
		},
	});

	if (check) registerUser(ID, NM, PW);
}

async function registerUser(ID, NM, PW) {
	let isRegisterd = await $.ajax({
		type: "POST",
		url: "http://localhost:3000/users/register",
		data: { id: ID, name: NM, pw: PW },
		success: (res) => {
			res;
		},
		error: () => false,
	});

	if (isRegisterd) {
		appAlert("가입 완료");
	} else {
		appAlert("가입 실패");
	}
}

function redirectToApp(userinfo) {
	sessionStorage.setItem("userinfo", JSON.stringify({ id: userinfo.id, name: userinfo.name }));
	window.location.href = "./index.html";
}
