<template>
    <!-- <main class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true"> -->
    <main class="bg-gradient-to-r from-gray-800 via-gray-900 to-purple-900 h-screen py-5">
        <!-- Background backdrop, show/hide based on slide-over state. -->
        <!-- <div class="fixed inset-0"></div> -->

        <div class="p-5 h-full max-w-3xl mx-auto bg-rose-100 border-8 border-rose-300 rounded-xl overflow-y-scroll">
            <TimelineWin />
        </div>

        <SidePanel class="hidden" />
    </main>
</template>

<script>
// const { ElectrumClient } = require('electrum-cash')

/* Import components. */
import SidePanel from '@/components/SidePanel'
import TimelineWin from '@/components/TimelineWin'

export default {
    components: {
        SidePanel,
        TimelineWin,
    },
    data: () => ({
        //
    }),
    computed: {
        //
    },
    methods: {
        //
    },
    created: async function () {
        // const electrum = new ElectrumClient('Electrum client example', '1.4.1', 'electrum.nexa.org:50002');
        // console.log('ELECTRUM', electrum);

        // Wait for the client to connect
        // const result = await electrum.connect()
        // console.log('RESULT', result);

        const socket = new WebSocket("ws://electrum.nexa.org:7230")
        console.log('EXAMPLE SOCKET', socket);

        const request = `{"method":"blockchain.address.get_balance","params":["nexa:nqtsq5g5mtglrfqmnr45s0x364pxcg2uw88h72hl9c864cyj"],"id":1}`

        socket.onopen = function () {
              console.log('ONOPEN');

              socket.send(request + '\n')
        }

        socket.onmessage = function (msg) {
            console.log('ONMESSAGE', msg);

            if (msg && msg.data) {
                try {
                    const data = JSON.parse(msg.data)
                    console.log('DATA', data);

                    if (data && data.result) {
                        const result = data.result
                        console.log('RESULT', result);
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }

        socket.onclose = function () {
            console.log('ONCLOSE');
        }

        socket.onerror = function (e) {
            console.log('ONERROR', e);
        }

        // socket.addEventListener("error", e => {
        //     console.log("error", e);
        // });

        // Connection opened
        // socket.addEventListener('open', async (event) => {
        //     console.log('CONNECTION IS OPEN', event);
        //
        //     const response = await socket.send(request)
        //     console.log('RESPONSE', response);
        // });


    },
    mounted: function () {
        //
    },
}
</script>
