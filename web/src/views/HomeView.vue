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
        const socket = new WebSocket("ws://electrum.nexa.org:7230")
        // console.log('EXAMPLE SOCKET', socket);

        // const request = `{"method":"blockchain.address.get_balance","params":["nexa:nqtsq5g5mtglrfqmnr45s0x364pxcg2uw88h72hl9c864cyj", true],"id":1}`

        socket.onopen = function () {
              // console.log('ONOPEN');

              let request

              request = `{"method":"blockchain.transaction.get","params":["66ce81cec5a010e151c68d63bd135133cd54cc5f4904817c738a4a19986ccb0c",true],"id":194}`
              socket.send(request + '\n')

              request = `{"method":"blockchain.headers.subscribe","params":[""],"id":1}`
              socket.send(request + '\n')
        }

        socket.onmessage = function (msg) {
            // console.log('ONMESSAGE', msg);

            let data
            let result
            let params

            if (msg && msg.data) {
                try {
                    data = JSON.parse(msg.data)
                    // console.log('DATA', data);

                    if (data && data.result) {
                        result = data.result
                        console.log('RESULT', result);
                    }

                    if (data && data.params) {
                        params = data.params
                        console.log('PARAMS', params);
                    }

                    if (params && params[0].height) {
                        console.log('NEW BLOCK', params[0]);

                        const height = params[0].height

                        let request

                        request = `{"method":"blockchain.block.header","params":["${height}"],"id":1}`
                        socket.send(request + '\n')
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
