export default class APIHandler {
	#URL;

	constructor(url) {
		if (!url) throw new Error("APIHandler needs API URL on constructor");
		this.#URL = url;
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
			// xhrFields: { withCredentials: true },
		}).fail((err) => console.log(err));
	}

	#request(url, body = {}, method) {
		return $.ajax({
			method: method,
			url: this.#URL + url,
			data: body,
			// xhrFields: { withCredentials: true },
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
