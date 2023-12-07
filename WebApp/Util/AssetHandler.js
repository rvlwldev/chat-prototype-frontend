import { API_URL } from "../_Global/Constant/API.js";

export default class AssetHandler {
	constructor() {}

	async getStaticFileDataURL(fileName) {
		return new Promise((resolve) => {
			let requestFileURL = `${API_URL.CHAT_SERVER}asset/img/${fileName}`;

			fetch(requestFileURL)
				.then((response) => response.blob())
				.then((blob) => {
					const reader = new FileReader();

					reader.onloadend = () => resolve(reader.result);
					reader.readAsDataURL(blob);
				})
				.catch((error) => {
					console.error("Error fetching image:", error);
					resolve(null);
				});
		});
	}
}

/*
return new Promise((resolve) => {
			let requestFileURL = `asset/img/${fileName}`;

			User.CHAT_API.get(requestFileURL).then((img) => {
				const blob = new Blob([img], { type: "image/png" });
				const reader = new FileReader();

				reader.onloadend = () =>
					resolve(reader.result.replace(/[\r\n]+/g, "").replace(/\s/g, ""));

				reader.readAsDataURL(blob);
			});
		});
*/
