import axios from 'axios'
import playwright from 'playwright'
import { UserAgent } from '../config.js'

export async function getHtmlAxios(url) {
	try {
		const { data } = await axios.get(url, {
			headers: {
				'User-Agent': UserAgent,
			},
		})
		return data
	} catch (err) {
		console.error(err)
	}
	return null
}

export async function getHtmlPlaywright(url) {
	try {
		const browser = await playwright.chromium.launch()
		const context = await browser.newContext()
		const page = await context.newPage()
		await page.goto(url)
		const html = await page.content()
		await browser.close()
		return html
	} catch (err) {
		console.error(err)
	}
	return null
}
