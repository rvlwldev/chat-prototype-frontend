export default class initializeSDKError extends Error {
	constructor(error) {
		super("톡플러스 SDK 초기화 오류");
		this.name = "initializeSDKError";
	}
}
