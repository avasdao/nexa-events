'use strict'

import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import PouchDB from 'pouchdb'
import { fileURLToPath } from 'url'

import { start, test } from './cron.js'
import rpc from './routes/rpc.js'
import sessions from './routes/sessions.js'

// NOTE: Polyfill for ES modules.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* Set database path. */
const dbPath = path.join(__dirname, 'dbs')
// console.log('DB PATH', dbPath)

/* Verify database folder exists. */
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath)
}

/* Initialize database holder. */
const dbs = {}

/* Initialize ALL databases. */
dbs.sessions = new PouchDB(path.join(dbPath, 'sessions'))

/* Set constants. */
const HOST = '0.0.0.0'
const PORT = process.env.PORT || 3000

/* Initialize application. */
const app = express()

/* Initialize CORS. */
// NOTE: Enables access from web browsers.
app.use(cors())

/* Initialize JSON parser. */
app.use(express.json())

/* Initialize URL parser. */
app.use(express.urlencoded({ extended: true }))

/* Initialize database middleware. */
// app.use(function (req, res, next) {
//     /* Add all databases to request object. */
//     req.dbs = dbs

//     /* Call next middleware. */
//     next()
// })

/* Build welcome message. */
const welcome = `
<html>
<body>

<h2>Welcome to the Nexa Events Manager API</h2>
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
app.get('/v1/sessions/:sessionid', sessions)
app.get('/v1/sessions', sessions)
app.post('/v1/sessions', sessions)

/* Initialize RPC route. */
app.post('/v1/rpc', rpc)

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
console.info('  - NODE_ENV    :', process.env.NODE_ENV)
console.info('  - ADMIN_KEY   :', process.env.ADMIN_KEY) // TODO: Implement (nexid) auth, then DEPRECATE.
console.info('  - ADMIN_NEXID :', process.env.ADMIN_KEY)
console.info('  - SMTP_HOST   :', process.env.SMTP_HOST)
console.info('  - SMTP_USER   :', process.env.SMTP_USER)
console.info('  - SMTP_PASS   :', process.env.SMTP_PASS)
console.info()

/* Start cron jobs. */
// start(dbs)
test(dbs)
