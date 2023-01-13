'use strict'

import express from 'express'
import cors from 'cors'

import sessions from './routes/sessions.js'

/* Set constants. */
const HOST = '127.0.0.1'
const PORT = process.env.PORT || 3000

/* Initialize application. */
const app = express()

/* Initialize CORS. */
app.use(cors())

/* Initialize JSON parser. */
app.use(express.json())

/* Initialize URL parser. */
app.use(express.urlencoded({ extended: true }))

/* Build welcome message. */
const welcome = `
<html>
<body>

<h2>Welcome to the NEXA Events Manager API</h2>
<h3>https://api.nexa.events</h3>

</body>
</html>
`

// TODO: Replace with a "static" site.
app.get('/', (req, res) => {
    res.end(welcome)
})

/* Initialize Administration route. */
// app.post('/v1/admin', import('./routes/admin'))

/* Initialize Sessions routes. */
app.get('/v1/sessions', sessions)
app.get('/v1/sessions/:sessionid', sessions)
app.post('/v1/sessions', sessions)

/* Initialize Users route. */
// app.post('/v1/users', import('./routes/users'))

/* Initialize v1 (default) route. */
app.get('/v1', (req, res) => {
    res.end('Oops! I think you forgot something.')
})

/* Start listening for connections. */
app.listen(PORT, HOST)

/* Display current environment variables. */
console.log()
console.log(`  Nexa Events Server is running at:`)
console.log(`  http://${HOST}:${PORT}`)

console.info()
console.info('  Current Environment Variables')
console.info('---------------------------------')
console.info('  - NODE_ENV  :', process.env.NODE_ENV)
console.info('  - ADMIN_KEY :', process.env.ADMIN_KEY) // TODO: Implement (nexid).
console.info('  - SMTP_HOST :', process.env.SMTP_HOST)
console.info('  - SMTP_USER :', process.env.SMTP_USER)
console.info('  - SMTP_PASS :', process.env.SMTP_PASS)
console.info()
