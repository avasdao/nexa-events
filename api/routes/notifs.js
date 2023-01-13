/* Import modules. */
import fs from 'fs'
const moment = require('moment')
import path from 'path'
const nodemailer = require('nodemailer')
const PouchDB = require('pouchdb')
const util = require('util')
const { v4: uuidv4 } = require('uuid')
const validator = require('validator')

// NOTE: Polyfill for ES modules.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* Set database path. */
const dbPath = path.join(__dirname, '..', 'dbs')
// console.log('DB PATH', dbPath)

/* Set Sessions (database) path. */
const notifsPath = path.join(dbPath, 'notifs')
const sessionsPath = path.join(dbPath, 'sessions')

/* Initialize Sessions database. */
const notifsDb = new PouchDB(notifsPath)
const sessionsDb = new PouchDB(sessionsPath)


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
    let address
    let body
    let email
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

    address = body.address
    console.log('\nNotification address:', address)

    /* Validate body. */
    if (!address) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Missing address parameter.'
        })
    }

    // result = await client.validateAddress(address)
    // console.log('\nIs address valid:', result.isvalid, result)

    /* Validate address. */
    if (!result.isvalid) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Your Nexa address is invalid.'
        })
    }

    email = body.email
    console.log('\nNotification email:', email)

    result = validator.isEmail(email)
    console.log('\nIs email valid:', result)

    /* Validate email. */
    if (!result) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Your email address is invalid.'
        })
    }

    /* Generate id. */
    id = uuidv4()

    /* Add record to database. */
    response = await notifsDb
        .put({
            _id: id,
            address,
            email,
        })
        .catch(err => {
            console.error(err)

            return res.json(err)
        })

    /* Send response back to client. */
    res.json({
        id,
        response,
    })
}

/* Export module. */
module.exports = notifs
