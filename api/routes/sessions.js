/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import superagent from 'superagent'
import { v4 as uuidv4 } from 'uuid'

/**
 * Sessions Module
 */
const sessions = async (req, res) => {
    const body = req.body
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

    const id = uuidv4()
    console.log('ID', id)

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

    const createdAt = moment().unix()

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
