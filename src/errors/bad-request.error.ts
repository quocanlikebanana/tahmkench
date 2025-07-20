export class BadRequestError extends Error {
	public readonly extra_code: number;

	constructor(message: string, extra_code: number = 0) {
		super(message);
		this.name = 'BadRequestError';
		this.extra_code = extra_code;
	}
}
