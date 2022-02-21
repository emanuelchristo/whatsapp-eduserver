import cheerio from 'cheerio'

export function parseGrades(html) {
	try {
		const $ = cheerio.load(html)

		const tableRowNodes = $('table.user-grade tbody tr').toArray()
		const courseName = $(tableRowNodes[0]).find('th.column-itemname').text()
		const items = []
		for (let i = 2; i < tableRowNodes.length; i++) {
			try {
				const node = tableRowNodes[i]
				const itemNameNode = $(node).find('th.column-itemname a').toArray()[0]
				const itemName = $(itemNameNode).text()
				const itemLink = itemNameNode.attribs['href']
				const itemType = $(itemNameNode).find('img').attr('alt')?.toLowerCase()
				const grade = $(node).find('td.column-grade').text()
				const range = $(node).find('td.column-range').text()
				const percentage = $(node).find('td.column-percentage').text()
				const rank = $(node).find('td.column-rank').text()
				const average = $(node).find('td.column-average').text()

				items.push({
					itemName,
					itemLink,
					itemType,
					grade,
					range,
					percentage,
					rank,
					average,
				})
			} catch (err) {
				console.error(new Error('Failed to parse a grade item'))
			}
		}

		return { courseName, items }
	} catch (err) {
		console.error(new Error('Failed to parse grades'))
	}
	return null
}
