/**
 * Plaintext Email Template
 *
 * This version will accompany the message and will be displayed in the event
 * that HTML is unavailable or disabled by the user.
 */
const template = (_details) => {
    /* Set transaction id. */
    const txid = _details.txid

    return `
        Nexa Transaction Event
        ----------------------------------------

        We just saw a transaction on your watched wallet.
        ${txid}

        ________________________________________
        https://nexa.events

        The FREE delivery of this message is sponsored by:
        [ SPONSOR NAME ]
        [ SPONSOR BANNER ]
    `
}

/* Export module. */
module.exports = template
