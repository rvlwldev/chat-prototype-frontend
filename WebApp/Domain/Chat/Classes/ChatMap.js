export class ChatMap extends Map {
	constructor() {
		super();
	}

	getObjectById(id) {
		for (const [key, val] of this) if (key.id === id) return val;
		return undefined;
	}

	get(id) {
		return super.get(id) || this.getObjectById(id);
	}

	hasId(id) {
		for (const [key, val] of this) if (key.id === id) return true;
		return false;
	}

	has(id) {
		return super.has(id) || this.hasId(id);
	}
}
