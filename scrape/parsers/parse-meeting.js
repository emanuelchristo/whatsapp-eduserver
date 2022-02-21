import cheerio from 'cheerio'

export function parseMeeting(html) {
	try {
		const meeting = {
			courseName: '',
			meetingName: '',
			description: '',
			startTime: '',
			expectedDuration: '',
			meetingLink: '',
			meetingStatus: '',
		}
		const $ = cheerio.load(html)
		meeting.courseName = $('h1').text()
		meeting.meetingName = $('div[role="main"] h2').text()
		const infoNodes = $('#region-main table tr')
		for (let node of infoNodes) {
			try {
				const infoName = $(node).find('b').text().replace(':', '').toLocaleLowerCase()
				const infoValue = $(node).find('td[align="left"]').text()
				const meetingLink = $(node).find('a').attr('href')
				const meetingStatus = $(node).text()
				if (meetingLink) meeting.meetingLink = meetingLink
				else if (infoName === 'description') meeting.description = infoValue
				else if (infoName === 'start time') meeting.startTime = infoValue
				else if (infoName === 'expected duration') meeting.expectedDuration = infoValue
				if (!infoName) meeting.meetingStatus = meetingStatus || ''
			} catch (err) {
				console.error(new Error('Failed to parse a meeting info'))
			}
		}

		return meeting
	} catch (err) {
		console.error(new Error('Failed to parse meeting'))
	}
	return null
}
