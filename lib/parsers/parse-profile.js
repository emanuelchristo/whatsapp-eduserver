import cheerio from 'cheerio'

export function parseProfile(html) {
	try {
		const $ = cheerio.load(html)
		const name = $('h1').text()
		const avatarUrl = $('.userpicture').attr('src')
		const email = $('.profile_tree section:first-child div ul li:nth-child(2) a').text()

		return {
			name,
			avatarUrl,
			email,
		}
	} catch (err) {
		console.error(new Error('Failed to parse profile'))
	}
	return null
}
