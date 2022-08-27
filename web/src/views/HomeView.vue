<template>
    <main class="bg-gradient-to-r from-gray-800 via-gray-900 to-indigo-900 h-screen p-5">
        <div class="flex flex-col h-full max-w-3xl mx-auto space-y-4">
            <div class="flex justify-between items-center px-1 sm:px-3">
                <div>
                    <img class="h-10 lg:h-12 w-10 lg:w-12" :src="require('../assets/logo.png')" />
                </div>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl text-indigo-400 font-bold tracking-tighter opacity-70">
                    NEXA Events
                </h1>

                <svg @click="toggleMenu" class="w-12 lg:w-14 h-12 lg:h-14 text-gray-200 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </div>

            <div class="flex-1 p-5 bg-indigo-100 border-8 border-indigo-300 rounded-xl overflow-y-scroll">
                <TimelineWin />
            </div>

            <div class="flex justify-center">
                <span class="text-gray-200 text-xs">
                    brought to you with ❤️ from <a class="text-rose-300 font-medium" href="https://avasdao.org" target="_blank">Ava's DAO</a>
                </span>
            </div>
        </div>

        <AdminView v-if="isAdmin" :class="{ hidden: !showingMenu }" @toggleMenu="showingMenu = !showingMenu" />
        <ManagerView v-else :class="{ hidden: !showingMenu }" @toggleMenu="showingMenu = !showingMenu" />
    </main>
</template>

<script>
/* Import components. */
import AdminView from '@/components/AdminView'
import ManagerView from '@/components/ManagerView'
import TimelineWin from '@/components/TimelineWin'

export default {
    components: {
        AdminView,
        ManagerView,
        TimelineWin,
    },
    data: () => ({
        showingMenu: null,
        isAdmin: null,
        isManager: null,
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

        /* Handle admin user. */
        if (this.$route && this.$route.path === '/admin') {
            this.isAdmin = true
        } else {
            this.isAdmin = false
        }

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
