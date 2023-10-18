import { NextResponse } from 'next/server'

export class ApiExeption {
	static messageFromCodeObj = {
		400: 'Required Parameter is Missing',
		401: 'Unauthorized',
		500: 'Internal Error',
	}

	static throw(
		code: keyof typeof ApiExeption.messageFromCodeObj,
		title?: any,
		...optionalParams: any[]
	) {
		if (title) {
			console.log(`[${title}]`, optionalParams)
		}
		return new NextResponse(ApiExeption.messageFromCodeObj[code], {
			status: code,
		})
	}
}
