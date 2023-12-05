import { ErrorMessage } from "../../../_Global/Constant/Message.js";

export default class AuthenticationError extends Error {
	constructor() {
		super(ErrorMessage.AuthenticationError);
		this.name = "Authentication Error";
	}
}
