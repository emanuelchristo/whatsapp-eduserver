import cheerio from 'cheerio'

export function parseAttendance(html) {
	try {
		const $ = cheerio.load(html)

		const summary = {
			takenSessions: '',
			points: '',
			percentage: '',
		}

		const summaryNodes = $('table.attlist tr').toArray()
		for (let node of summaryNodes) {
			try {
				const property = $(node).find('td:first-child').text().toLowerCase().trim().replace(':', '')
				const value = $(node).find('td:last-child').text()

				if (property === 'taken sessions') summary.takenSessions = value
				else if (property === 'points over taken sessions') summary.points = value
				else if (property === 'percentage over taken sessions') summary.percentage = value
			} catch (err) {
				console.error(new Error('Failed to parse an attendance summary'))
			}
		}

		const submitAttendanceLinks = []

		const attendanceNodes = $('table.generaltable tbody tr').toArray()
		for (let node of attendanceNodes) {
			try {
				const date = $(node).find('td.datecol').text()
				const link = $(node).find('td.statuscol a').attr('href')
				if (link) submitAttendanceLinks.push({ date, link })
			} catch (err) {
				console.error(new Error('Failed to parse an attendance node'))
			}
		}

		return { summary, submitAttendanceLinks }
	} catch (err) {
		console.error(new Error('Failed to parse attendance'))
	}
	return null
}
