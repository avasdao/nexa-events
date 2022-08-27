'use strict'

const express = require('express')

/* Set constants. */
const HOST = '0.0.0.0'
const PORT = 3000

/* Initialize application. */
const app = express()

/* Initialize JSON parser. */
app.use(express.json())

/* Initialize URL parser. */
app.use(express.urlencoded({ extended: true }))

/* Configure application. */
app.use(function (req, res, next) {
    /* Initialize headers. */
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    /* Move to next process. */
    next()
})

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
app.post('/v1/admin', require('./routes/admin'))

/* Initialize Sessions route. */
app.get('/v1/sessions', require('./routes/sessions'))
app.post('/v1/sessions', require('./routes/sessions'))

/* Initialize Notifications route. */
app.get('/v1/notifs/:address', require('./routes/notifs'))
app.post('/v1/notifs/:address', require('./routes/notifs'))

/* Initialize Magic (Email) Link route. */
// app.get('/v1/magiclink', require('./routes/magiclink'))
app.post('/v1/magiclink', require('./routes/magiclink'))

// TODO: Offer help.
app.get('/v1', (req, res) => {
    res.end('Oops! I think you forgot something.')
})

/* Start listening for connections. */
app.listen(PORT, HOST)

/* Display current environment variables. */
console.info()
console.log(`Running on http://${HOST}:${PORT}`)
console.info()
console.info('Current Environment Variables')
console.info('-----------------------------')
console.info('  - NODE_ENV       :', process.env.NODE_ENV)
console.info('  - COUCHDB_AUTH   :', process.env.COUCHDB_AUTH)
console.info('  - MAGIC_LINK_KEY :', process.env.MAGIC_LINK_KEY)
console.info()
