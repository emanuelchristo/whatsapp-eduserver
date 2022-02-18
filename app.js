import 'dotenv/config'
import {
	fetchUpcoming,
	fetchProfile,
	fetchCourse,
	fetchGrades,
	fetchMeeting,
	fetchAssignment,
	fetchAttendance,
} from './lib/fetch-page.js'
import { readCookie } from './lib/utils.js'

const username = process.env.USERNAME
const password = process.env.PASSWORD

async function main() {
	const cookie = await readCookie()

	const data = await fetchUpcoming(cookie, username, password)
	console.log(data)
}

main()
