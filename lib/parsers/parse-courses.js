import cheerio from 'cheerio'

export function parseCourses(html) {
	try {
		const courses = []

		const $ = cheerio.load(html)
		const dropdownNodes = $('nav .navbar-nav li:first-child .dropdown-menu a').toArray()
		for (let node of dropdownNodes) {
			try {
				const courseName = node.children[0]?.data || ''
				if (courseName.toLowerCase().trim() === 'dashboard') continue
				const courseTitle = node.attribs['title'] || ''
				const courseLink = node.attribs.href || ''
				courses.push({ courseLink, courseName, courseTitle })
			} catch (err) {
				console.error(new Error('Failed to parse a course link'))
			}
		}
		return courses
	} catch (err) {
		console.error(new Error('Failed to parse courses list'))
	}
	return null
}
