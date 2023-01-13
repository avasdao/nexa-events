/* Import modules. */
import moment from 'moment'
import superagent from 'superagent'
import { v4 as uuidv4 } from 'uuid'

/**
 * Sessions Module
 *
 * @param {Object} req
 * @param {Object} res
 */
const sessions = async (req, res) => {
    /* Initialize local variables. */
    let method

    /* Set request method. */
    method = req.method

    if (method === 'GET') {
        return _handleGet(req, res)
    }

    if (method === 'POST') {
        return _handlePost(req, res)
    }

    /* Fallback response. */
    res.end('Session error.')
}


/**
 * Handle Get Request
 *
 * @param {Object} req
 * @param {Object} res
 */
const _handleGet = async (req, res) => {
    /* Initialize local variables. */
    let error
    let params
    let response
    let session
    let sessionid

    /* Set request parameters. */
    params = req.params

    /* Validate parameters. */
    if (!params) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Missing request parameters.'
        })
    }

    /* Set session id. */
    sessionid = params.sessionid

    /* Validate session id. */
    if (!sessionid) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Missing session id.'
        })
    }

    /* Save session to database. */
    response = await req.dbs.sessions
        .get(sessionid)
        .catch(err => {
            // console.error(err)

            /* Set error. */
            error = err
        })

    /* Verify error status. */
    if (error && error.status) {
        if (error.status === 404) {
            error = {
                status: error.status,
                name: error.name,
                message: error.message,
            }

            /* Set status. */
            res.status(error.status)

            /* Return error. */
            return res.json(error)
        }
    }

    session = {
        client: response.client,
        ip: response.ip,
        createdAt: response.createdAt,
    }

    /* Return package. */
    res.json({
        ...session,
        error,
    })
}


/**
 * Handle Post Request
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
const _handlePost = async (req, res) => {
    /* Initialize local variables. */
    let body
    let createdAt
    let error
    let id
    let response

    /* Set request body. */
    body = req.body
    // console.log('BODY', body)

    /* Validate body. */
    if (!body) {
        /* Set status. */
        res.status(400)

        /* Return error. */
        return res.json({
            error: 'Missing body parameter.'
        })
    }

    /* Generate a unique id. */
    id = uuidv4()
    // console.log('ID', id)

    /* Generate timestamp. */
    createdAt = moment().unix()

    response = await req.dbs.sessions
        .put({
            _id: id,
            ...body,
            createdAt,
        })
        .catch(err => {
            /* Set error. */
            error = err
            console.error(err)
        })

    /* Send response back to client. */
    return res.json({
        id,
        response,
        error,
    })

    /* Validate signature. */
    // if (!signature) {
    //     /* Set status. */
    //     res.status(400)

    //     /* Return error. */
    //     return res.json({
    //         error: 'Missing signature parameter.'
    //     })
    // }

    let isVerified
    // isVerified = ethers.utils
    //     .verifyTypedData( domain, types, value, signature )
    // console.log('\nIS VERIFIED', isVerified)

return res.json({
    id,
    isVerified,
})

    const profileid = body.profileid

    createdAt = moment().unix()

    const updatedAt = null

    /* Build session object. */
    const session = {
        id,
        profileid,
        createdAt,
        updatedAt,
    }

    /* Set endpoint. */
    const endpoint = `http://127.0.0.1:9200/sessions/_doc/${session.id}`
    // console.log('ENDPOINT', endpoint)

    /* Request Elasticsearch query. */
    response = await superagent
        .put(endpoint)
        .send(session)
        .set('accept', 'json')
        .catch(err => console.error(err))
    console.log('\nSESSIONS ADD/UPDATE', response.body)


    return res.json(response.body)
}


/* Export module. */
export default sessions
