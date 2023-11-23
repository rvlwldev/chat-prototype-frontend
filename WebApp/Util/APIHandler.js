export class APIHandler {
	#URL;

	constructor(url) {
		if (url) this.#URL = url;
		else this.#URL = "http://192.168.2.65/chatapi/"; // CI_API
	}

	#formRequest(url, body, method = "POST") {
		const FORM = new FormData();

		for (const KEY in body) {
			const VAL = body[KEY];

			if (VAL instanceof File) FORM.append("file", VAL, VAL.name);
			else FORM.append(KEY, VAL);
		}

		return $.ajax({
			method: method,
			url: this.#URL + url,
			data: FORM,
			processData: false,
			contentType: false,
		}).fail((err) => console.log(err));
	}

	#request(url, body = {}, method) {
		// console.log("(" + method + ") " + this.#URL + url);

		return $.ajax({
			method: method,
			url: this.#URL + url,
			data: body,
		});
	}

	get(url, body = null) {
		return this.#request(url, body, "GET");
	}

	post(url, body) {
		return this.#request(url, body, "POST");
	}

	postForm(url, body) {
		return this.#formRequest(url, body, "POST");
	}

	patch(url, body) {
		return this.#request(url, body, "PATCH");
	}

	put(url, body) {
		return this.#request(url, body, "PUT");
	}

	delete(url, body = null) {
		return this.#request(url, body, "DELETE");
	}
}
