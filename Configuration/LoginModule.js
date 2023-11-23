const LoginModule = {
	proceed: () => {
		console.log("Preload Bridge 연결 완료");

		document.getElementById("username").addEventListener("keypress", (e) => {
			if (e.keyCode === 13) document.getElementById("password").focus();
		});

		document.getElementById("password").addEventListener("keypress", (e) => {
			if (e.keyCode === 13) CI_SERVER_LOGIN();
		});

		document.getElementById("login").addEventListener("click", () => {
			CI_SERVER_LOGIN();
		});

		function CI_SERVER_LOGIN() {
			const ID = document.getElementById("username").value;
			const PW = document.getElementById("password").value;
			const DB = "cug";

			if (!ID || !PW) {
				ipcRenderer.send("alert", "아이디/비밀번호를 입력해주세요");
				document.getElementById("username").focus();
				return;
			}

			const xhr = new XMLHttpRequest();
			xhr.open("POST", "http://192.168.2.65/chatapi/login", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xhr.onload = function () {
				if (xhr.status === 200) redirectToApp(JSON.parse(xhr.responseText));
				else {
					console.log(xhr.statusText);
					if (xhr.responseText) ipcRenderer.send("alert", xhr.responseText);
				}
			};

			xhr.onerror = function () {
				console.error("Network error");
			};

			const data = `id=${encodeURIComponent(ID)}&pw=${encodeURIComponent(PW)}&intranet=${DB}`;

			xhr.send(data);
		}

		function redirectToApp(userinfo) {
			const userinfoString = encodeURIComponent(JSON.stringify(userinfo));
			const url = "./WebApp/index.html?data=" + userinfoString;

			window.location.href = url;
		}
	},
};

module.exports = LoginModule;

/*
{
	cugcpg: "cug",
	intranet: "CUG",
	jumin_log: "47e2beb243c5bb9c",
	jumin: "990711-1405617",
	name: "김형준(전산)",
	email: "rvlwlasd77@gmail.com",
	post_code: null,
	johap: "A013",
	belong: "004",
	johapPost: "전산팀",
	m_code: "",
	pic_exe: "",
	gender: "1",
	my_tel: "010-0000-0000",
	my_table: "cug_orgbbs_confirm_039",
	admin_hr_oCode: null,
	hr_m_code: "2023090010",
	hr_o_code: "0005",
}
*/
