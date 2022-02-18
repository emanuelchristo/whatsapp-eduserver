import cheerio from 'cheerio'

export function parseCourse(html) {
	try {
		const activities = []

		const $ = cheerio.load(html)
		const activityNodes = $('li.activity').toArray()
		for (let node of activityNodes) {
			const activity = {
				activityType: '',
				activityLink: '',
				activityName: '',
			}

			try {
				// Getting activity type
				const classes = node.attribs['class'].split(' ')
				for (let cls of classes)
					if (cls.startsWith('modtype_')) {
						activity.activityType = cls.replace('modtype_', '')
						break
					}
				if (activity.activityType === 'label') continue

				// Getting activity link
				const linkNode = $(node).find('.activityinstance a').toArray()[0]
				activity.activityLink = linkNode?.attribs['href'] || ''

				// Getting activity name
				const instanceNameNode = $(linkNode).find('span.instancename').toArray()[0]
				for (let child of instanceNameNode.children)
					if (child.type === 'text') {
						activity.activityName = child.data
						break
					}
			} catch (err) {
				console.error(new Error('Failed to parse a course activity'))
			}

			activities.push(activity)
		}

		return activities
	} catch (err) {
		console.error(new Error('Failed to parse course page'))
	}
	return null
}
