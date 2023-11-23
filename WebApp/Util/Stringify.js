export class Stringify extends String {
	constructor() {
		super();
	}

	static getTimestampsString(createdAt) {
		let date = new Date(createdAt).toLocaleTimeString();
		return String(date).substring(0, 7);
	}

	static getDateString(fullDate) {
		const day = fullDate === undefined ? new Date() : new Date(fullDate);
		const year = day.getFullYear();
		const month = day.getMonth() + 1;
		const date = day.getDate();

		let result = year + "년 ";
		result += month + "월 ";
		result += date + "일";

		return result;
	}
	static formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		let result;
		result = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
		result += sizes[i];

		return result;
	}
}
