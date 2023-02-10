/* Import modules. */
import moment from 'moment'
import superagent from 'superagent'
import { v4 as uuidv4 } from 'uuid'
import { call } from '@nexajs/rpc'

/**
 * RPC (Node) Module
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
const rpc = async function (req, res) {
    let action
    let address
    let body
    let endpoint
    let params
    let pkg
    let response

    try {
        body = req.body
        console.log('BODY', body)

        if (!body) {
            return res.end('No body')
        }

        action = body.action
        address = body.address
        params = body.params

        /* Validate body. */
        if (!body) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: 'Missing body parameter.'
            })
        }

        if (action === 'getblock') {
            /* Make core request. */
            response = await call(action, params)

            /* Return response. */
            return res.json(response)
        }

        if (action === 'getwalletinfo') {
            /* Make core request. */
            response = await call(action, params)

            /* Return response. */
            return res.json(response)
        }

        if (action === 'getmininginfo') {
            const miningInfo = await call(action, params)

            return res.json(miningInfo)
        }

        if (action === 'validateaddress') {
            const validateAddress = await call(action, params)

            return res.json(validateAddress)
        }

        if (!pkg) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: 'Invalid action requested.'
            })
        }

        /* Fallback. */
        return res.end('Oops! Something went wrong.')
    } catch (err) {
        console.error('CORE ERROR', err)

        return res.json(err)
    }
}

/* Export module. */
export default rpc
