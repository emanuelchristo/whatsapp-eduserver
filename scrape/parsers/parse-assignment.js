import cheerio from 'cheerio'

export function parseAssignment(html) {
	try {
		const assignment = {
			courseName: '',
			assignmentName: '',
			description: '',
			submissionStatus: '',
			gradingStatus: '',
			dueDate: '',
			timeRemaining: '',
			lastModified: '',
			fileSubmissions: [],
		}

		const $ = cheerio.load(html)

		assignment.courseName = $('h1').text()
		assignment.assignmentName = $('h2').text()
		assignment.description = $('#intro').text()

		const tableNodes = $('.submissionstatustable table tr').toArray()
		tableNodes.pop()
		for (let node of tableNodes) {
			try {
				const property = $(node).find('th').text().toLowerCase().trim()
				const value = $(node).find('td').text()
				if (property === 'submission status') assignment.submissionStatus = value
				else if (property === 'grading status') assignment.gradingStatus = value
				else if (property === 'due date') assignment.dueDate = value
				else if (property === 'time remaining') assignment.timeRemaining = value
				else if (property === 'last modified') assignment.lastModified = value
				else if (property === 'file submissions') assignment.fileSubmissions = value
			} catch (err) {
				console.error(new Error('Failed to parse an assignment property'))
			}
		}

		return assignment
	} catch (err) {
		console.error(new Error('Failed to parse assignment'))
	}
	return null
}
