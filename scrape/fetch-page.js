import axios from 'axios'
import { login } from './login.js'
import { UserAgent } from '../config.js'
import {
	parseUpcoming,
	parseProfile,
	parseCourse,
	parseCourses,
	parseGrades,
	parseMeeting,
	parseAssignment,
	parseAttendance,
} from './parsers.js'

import { promises as fs } from 'fs'

export async function fetchPage(url, sessionCookie, username, password) {
	try {
		let sessionExpired = false
		let res = await axios
			.get(url, {
				maxRedirects: 0,
				headers: {
					Cookie: sessionCookie,
					'User-Agent': UserAgent,
				},
			})
			.catch((err) => {
				console.error(new Error('Session expired'))
				sessionExpired = true
			})

		// If session expired
		if (sessionExpired) {
			const newSessionCookie = await login(username, password)
			res = await axios.get(url, {
				headers: {
					Cookie: newSessionCookie,
					'User-Agent': UserAgent,
				},
			})
		}

		await fs.writeFile('html.txt', res.data)

		return res.data
	} catch (err) {
		console.error(err)
	}
	return null
}

export async function fetchCourses(sessionCookie, username, password) {
	const homeUrl = 'https://eduserver.nitc.ac.in/'
	const html = await fetchPage(homeUrl, sessionCookie, username, password)
	if (!html) return null
	return parseCourses(html)
}

export async function fetchUpcoming(sessionCookie, username, password) {
	const calendarUrl = 'https://eduserver.nitc.ac.in/calendar/view.php'
	const html = await fetchPage(calendarUrl, sessionCookie, username, password)
	if (!html) return null
	return parseUpcoming(html)
}

export async function fetchProfile(sessionCookie, username, password) {
	const profileUrl = 'https://eduserver.nitc.ac.in/user/profile.php'
	const html = await fetchPage(profileUrl, sessionCookie, username, password)
	if (!html) return null
	return parseProfile(html)
}

export async function fetchCourse(sessionCookie, username, password, courseId) {
	const courseUrl = `https://eduserver.nitc.ac.in/course/view.php?id=${courseId}`
	const html = await fetchPage(courseUrl, sessionCookie, username, password)
	if (!html) return null
	return parseCourse(html)
}

export async function fetchGrades(sessionCookie, username, password, courseId) {
	const gradesUrl = `https://eduserver.nitc.ac.in/grade/report/user/index.php?id=${courseId}`
	const html = await fetchPage(gradesUrl, sessionCookie, username, password)
	if (!html) return null
	return parseGrades(html)
}

export async function fetchMeeting(sessionCookie, username, password, meetingUrl) {
	const html = await fetchPage(meetingUrl, sessionCookie, username, password)
	if (!html) return null
	return parseMeeting(html)
}

export async function fetchAssignment(sessionCookie, username, password, assignmentUrl) {
	const html = await fetchPage(assignmentUrl, sessionCookie, username, password)
	if (!html) return null
	return parseAssignment(html)
}

export async function fetchAttendance(sessionCookie, username, password, attendanceUrl) {
	const html = await fetchPage(attendanceUrl, sessionCookie, username, password)
	if (!html) return null
	return parseAttendance(html)
}
