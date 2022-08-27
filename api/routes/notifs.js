/* Import modules. */
const moment = require('moment')
const nodemailer = require('nodemailer')
const PouchDB = require('pouchdb')
const util = require('util')
const { v4: uuidv4 } = require('uuid')

/* Initialize databases. */
// const logsDb = new PouchDB(`http://${process.env.COUCHDB_AUTH}@localhost:5984/logs`)
// const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_AUTH}@localhost:5984/sessions`)
const notifsDb = new PouchDB('db/notifs')
const sessionsDb = new PouchDB('db/sessions')

const txtTemplate = (_msgDetails) => {
    return `
        NEXA Transaction Event
        ----------------------------------------

        We just saw a transaction on your watched wallet.
        ${_msgDetails.txid}

        ________________________________________
        https://nexa.events
        brought to you with ❤️ from Ava's DAO
    `
}

const htmlTemplate = (_msgDetails) => {
    return `
        <h2>NEXA Transaction Event</h2>

        <p>
            i have a <strong>BOLD</strong> body!
        </p>

        <p>
            We just saw a transaction on your watched wallet.
            <br>
            <a href="https://explorer.nexa.org/tx/${_msgDetails.txid}">
                ${_msgDetails.txid}
            </a>
        </p>

        <div style="text-align: center;">
            <hr />

            <a href="https://nexa.events" style="text-decoration: none;">
                https://nexa.events
            </a>

            <br />
            brought to you with ❤️ from
            <a href="https://avasdao.org" style="text-decoration: none;">Ava's DAO</a>
        </div>
    `
}

/**
 * Notifications
 */
const notifs = async function (req, res) {
    let id
    let body
    let response
    let results

    body = req.body
    console.log('BODY', body)

    /* Validate body. */
    if (!body) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Missing body parameter.'
        })
    }

    /* Generate id. */
    id = uuidv4()

    /* Add record to database. */
    response = await notifsDb
        .put({
            _id: id,
            ...body,
        })
        .catch(err => {
            console.error(err)

            return res.json(err)
        })

    const msgFrom = '"Nexa Events" <notify@nexa.events>'

    const msgRecipient = 'info@avasdao.org'

    const msgSubject = 'NEXA Transaction Event'

    const msgDetails = {
        txid: 'd465b82e9d9e74a19b5ea0ac09308be93be8e5f3b46ad8ceb0da99005b7e9b2e',
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: msgFrom,
        to: msgRecipient,
        subject: msgSubject,
        text: txtTemplate(msgDetails),
        html: htmlTemplate(msgDetails),
    })
    console.log('Message sent: %s', info.messageId)

    /* Send response back to client. */
    res.json({
        databaseId: response.id,
        messageId: info.messageId,
    })
}

/* Export module. */
module.exports = notifs
