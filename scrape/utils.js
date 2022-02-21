import { promises as fs } from 'fs'

export function parseSessionCookie(cookieStr) {
	const cookies = cookieStr.split(';')
	if (cookies.length < 1) return null
	return cookies[0].trim()
}

export async function saveCookie(cookie) {
	await fs.writeFile('cookie.txt', cookie)
}

export async function readCookie() {
	try {
		const cookie = await fs.readFile('cookie.txt')
		return cookie
	} catch (err) {}
	return null
}
