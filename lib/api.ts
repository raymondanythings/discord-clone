import { NextResponse } from 'next/server'

export class ApiExeption {
	static messageFromCodeObj = {
		401: 'Unauthorized',
		500: 'Internal Error',
	}

	static throw(code: keyof typeof ApiExeption.messageFromCodeObj) {
		return new NextResponse(ApiExeption.messageFromCodeObj[code], {
			status: code,
		})
	}
}
