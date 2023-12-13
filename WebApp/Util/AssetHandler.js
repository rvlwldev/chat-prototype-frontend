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
