import cheerio from 'cheerio'

export function parseUpcoming(html) {
	const $ = cheerio.load(html)

	const events = []
	const eventNodes = $('div[data-type="event"]').toArray()
	for (let node of eventNodes) {
		const courseId = $(node).attr('data-course-id')
		const eventId = $(node).attr('data-event-id')
		const eventType = $(node).attr('data-event-eventtype')
		const title = $(node).attr('data-event-title')
		const date = $(node).find('.card-body > div:first-child .col-11').text()
		const courseLink = $(node).find('.card-body > div:last-child a').attr('href')
		const courseName = $(node).find('.card-body > div:last-child a').text()
		const description = $(node).find('.card-body .description-content').text()
		const activityLink = $(node).find('.card-link').attr('href')
		events.push({ courseId, eventId, eventType, title, date, courseName, courseLink, description, activityLink })
	}
	return events
}
