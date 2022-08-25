<template>
    <main class="bg-gradient-to-r from-gray-800 via-gray-900 to-purple-900 h-screen p-5">
        <div class="flex flex-col h-full">
            <div class="flex justify-between items-center mb-3">
                <div>
                    <img class="h-10 lg:h-14 w-10 lg:w-14" :src="require('../assets/logo.png')" />
                </div>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl text-rose-400 font-bold tracking-tighter opacity-70">
                    NEXA Events
                </h1>

                <svg @click="toggleMenu" class="w-10 h-10 text-gray-200 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </div>

            <div class="flex-1 p-5 max-w-3xl mx-auto bg-rose-100 border-8 border-rose-300 rounded-xl overflow-y-scroll">
                <TimelineWin />
            </div>
        </div>

        <ManagerView :class="{ hidden: !showingMenu }" @toggleMenu="showingMenu = !showingMenu" />
    </main>
</template>

<script>
/* Import components. */
import ManagerView from '@/components/ManagerView'
import TimelineWin from '@/components/TimelineWin'

export default {
    components: {
        ManagerView,
        TimelineWin,
    },
    data: () => ({
        showingMenu: null,
    }),
    computed: {
        //
    },
    methods: {
        toggleMenu() {
            this.showingMenu = !this.showingMenu
        },

    },
    created: async function () {
        /* Initialize menu flag. */
        this.showingMenu = false

        /* Initialize socket connection to Electrum server. */
        const socket = new WebSocket('ws://electrum.nexa.org:7230')
        // console.log('EXAMPLE SOCKET', socket);

        // const request = `{"method":"blockchain.address.get_balance","params":["nexa:nqtsq5g5mtglrfqmnr45s0x364pxcg2uw88h72hl9c864cyj", true],"id":1}`

        /* Handle open connection. */
        socket.onopen = function () {
              // console.log('ONOPEN');

              let request

              // const txBytes = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'
              // const txid = txBytes.match(/[a-fA-F0-9]{2}/g).reverse().join('')

              // request = `{"method":"blockchain.transaction.get","params":["66ce81cec5a010e151c68d63bd135133cd54cc5f4904817c738a4a19986ccb0c",true],"id":194}`
              // request = `{"method":"blockchain.transaction.get","params":["${txid}",true],"id":194}`
              // socket.send(request + '\n')

              // request = `{"method":"blockchain.headers.subscribe","params":[""],"id":1}`
              // socket.send(request + '\n')

              request = `{"method":"blockchain.block.header","params":[53305],"id":1}`
              socket.send(request + '\n')
        }

        /* Handle message. */
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

        /* Handle connection close. */
        socket.onclose = function () {
            console.log('ONCLOSE');
        }

        /* Handle connection error. */
        socket.onerror = function (e) {
            console.log('ONERROR', e);
        }

    },
    mounted: function () {
        //
    },
}
</script>
