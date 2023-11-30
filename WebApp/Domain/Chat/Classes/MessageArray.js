export class MessageArray extends Array {
	hasNext = true;
	constructor(elements) {
		super();

		if (Array.isArray(elements)) elements.forEach((element) => this.push(element));
		else if (elements) this.push(elements);
	}

	get hasNext() {
		return this.hasNext;
	}

	set hasNext(hasNext) {
		this.hasNext = Boolean.valueOf(hasNext);
	}

	pushAll(elements) {
		for (const element of elements) super.push(element);
	}

	front(element) {
		super.unshift(element);
	}

	frontAll(elements) {
		for (const element of elements.reverse()) super.unshift(element);
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
