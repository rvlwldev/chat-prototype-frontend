export class MessageArray extends Array {
	hasNext = true;
	constructor(elements) {
		super();

		if (Array.isArray(elements)) elements.forEach((element) => this.push(element));
		else if (elements) this.push(elements);
	}

	front(...elements) {
		for (const element of elements) this.unshift(element);
	}

	getFirst() {
		if (this.length < 1) return undefined;
		return this[0];
	}

	getLast() {
		if (this.length < 1) return undefined;
		return this[this.length - 1];
	}
}
