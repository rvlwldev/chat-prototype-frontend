import User from "./User.js";

import AuthenticationError from "./Error/AuthenticationError.js";
import initializeSDKError from "./Error/initializeSDKError.js";
import Renderer from "../../_Global/Event/Renderer.js";

export default class Preloader {
	static isUserInitialized = false;

	static USER_init = async () => {
		if (Preloader.isUserInitialized) return false;

		try {
			await initStaticUserInfo();
			await initTalkPlusSDK();

			Preloader.isUserInitialized = true;

			return true;
		} catch (err) {
			if (err instanceof AuthenticationError || err instanceof initializeSDKError) {
				Renderer.alert(err.message);
				window.location.href = "./login.html";
			} else {
				Renderer.alert(err.message);
				console.error(err);
			}
		}
	};
}

async function initStaticUserInfo() {
	User.INFO = JSON.parse(sessionStorage.getItem("userinfo"));
	if (!User.INFO) throw new AuthenticationError();

	await User.CHAT_API.post("users/login", { userId: User.INFO.id }).catch((err) => {
		console.error(err);
		throw new AuthenticationError("로그인 정보 검증 실패");
	});
}

async function initTalkPlusSDK() {
	const SDK_INFO = await User.CI_API.get("token", { userId: User.INFO.id }).then((response) => {
		User.TALKPLUS_CLIENT = new TalkPlus.Client({ appId: response.AppID });
		return response;
	});

	await User.TALKPLUS_CLIENT.loginWithToken({
		userId: SDK_INFO.user.id,
		username: SDK_INFO.user.username,
		loginToken: SDK_INFO.loginToken,
	}).catch((err) => {
		console.error(err);
		throw new initializeSDKError(err);
	});
}
