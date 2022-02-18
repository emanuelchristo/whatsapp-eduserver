import axios from 'axios'
import cheerio from 'cheerio'
import { parseSessionCookie, saveCookie } from './utils.js'
import { UserAgent } from '../config.js'

export async function login(username, password) {
	try {
		// Getting login page html
		const loginUrl = 'https://eduserver.nitc.ac.in/login/index.php'
		const loginPageRes = await axios.get(loginUrl).catch((err) => {
			throw new Error('Failded to load login page')
		})

		// Getting session cookie
		const logInCookie = parseSessionCookie(loginPageRes.headers['set-cookie'][0])
		if (!logInCookie) throw new Error('Session cookie for login not found')

		// Extracting login token
		let $ = cheerio.load(loginPageRes.data)
		const loginToken = $('input[name="logintoken"]').attr('value')
		if (!loginToken) throw new Error('Failed to extract login token')

		// Url encoded login data
		const loginData = new URLSearchParams({
			logintoken: loginToken,
			username: username,
			password: password,
		}).toString()

		// Logging in
		const loggedInRes = await axios.post(loginUrl, loginData, {
			maxRedirects: 0,
			validateStatus: function (status) {
				return status >= 200 && status <= 303
			},
			headers: {
				'User-Agent': UserAgent,
				'Content-Type': 'application/x-www-form-urlencoded',
				Cookie: logInCookie,
			},
		})

		// Login failed
		if (loggedInRes.headers.location === loginUrl) throw new Error('Incorrect credentials')

		// Getting logged in session cookie
		const loggedInCookie = parseSessionCookie(loggedInRes.headers['set-cookie'][0])
		await saveCookie(loggedInCookie)
		return loggedInCookie
	} catch (err) {
		console.error(err)
	}
	return null
}
