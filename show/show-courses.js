import { fetchCourses } from './fetch-page.js.js.js'

export async function viewCourses(sessionCookie, username, password) {
	const courses = await fetchCourses(sessionCookie, username, password)
	return courses
}
