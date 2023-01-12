<template>
    <main class="bg-gradient-to-r from-gray-800 via-gray-900 to-indigo-900 h-screen p-5">
        <div class="flex flex-col h-full max-w-3xl mx-auto space-y-4">
            <div class="flex justify-between items-center px-1 sm:px-3">
                <div>
                    <img class="h-10 lg:h-12 w-10 lg:w-12" src="/logo.png" />
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
/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

/* Import components. */
import AdminView from './components/AdminView.vue'
import ManagerView from './components/ManagerView.vue'
import TimelineWin from './components/TimelineWin.vue'


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
        initRostrum() {
            /* Initialize socket connection to Electrum server. */
            // const socket = new WebSocket('ws://electrum.nexa.org:7230')
            // const socket = new WebSocket('ws://electrum.nexa.org:20003')
            const socket = new WebSocket('ws://rostrum.devops.cash:20003')
            // console.log('EXAMPLE SOCKET', socket);

            // const request = `{"method":"blockchain.address.get_balance","params":["nexa:nqtsq5g5mtglrfqmnr45s0x364pxcg2uw88h72hl9c864cyj", true],"id":"${uuidv4()}"}`

            /* Handle open connection. */
            socket.onopen = () => {
                  // console.log('ONOPEN');

                  let request

                  // const txBytes = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'
                  // const txid = txBytes.match(/[a-fA-F0-9]{2}/g).reverse().join('')

                  request = `{"method":"blockchain.transaction.get","params":["66ce81cec5a010e151c68d63bd135133cd54cc5f4904817c738a4a19986ccb0c",true],"id":"${uuidv4()}"}`
                  // request = `{"method":"blockchain.transaction.get","params":["${txid}",true],"id":"${uuidv4()}"}`
                  // socket.send(request + '\n')

                  request = `{"method":"blockchain.headers.subscribe","params":[""],"id":"${uuidv4()}"}`
                  socket.send(request + '\n')

                  request = `{"method":"blockchain.block.header","params":[56332],"id":"${uuidv4()}"}`
                  socket.send(request + '\n')
            }

            /* Handle message. */
            socket.onmessage = (msg) => {
                // console.log('ONMESSAGE', msg);

                let data
                let result
                let params

                if (msg && msg.data) {
                    try {
                        data = JSON.parse(msg.data)
                        console.log('DATA', data)

                        if (data && data.result) {
                            result = data.result
                            console.log('MESSAGE RESULT', data.id, result)

                            // TODO: Validate result isHex
                            // this.parseTx(result)
                        }

                        if (data && data.params) {
                            params = data.params
                            console.log('PARAMS', params)
                        }

                        if (params && params[0].height) {
                            console.log('NEW BLOCK', params[0])

                            // TODO: Validate result isHex
                            this.parseBlock(params[0].hex)

                            const height = parseInt(params[0].height)
                            console.log('HEIGHT', height)

                            if (height > 0) {
                                // let request

                                // request = `{"method":"blockchain.block.header","params":[${height}],"id":"${uuidv4()}"}`
                                // socket.send(request + '\n')
                            }
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

        toggleMenu() {
            this.showingMenu = !this.showingMenu
        },


        isHex(_str) {
            /* Define regex. */
            const regexp = /^[0-9a-fA-F]+$/

            /* Test regex. */
            if (regexp.test(_str)) {
                return true
            } else {
                return false
            }
        },

/*

Block # 56241

Raw Data
9fcf961578ca8a7a2a99a02ec5e279b295498284ae85dffd33ebbec442dacb90f055091d0d5e3d9771a01061a4d5002b8ac49c27d33f45ec492b1a2f8e16f40536a5ffc20f9fba807ac9794a87d796cf827452c29a095a4dde5df050462e450e4c32c518000000000000000000000000000000000000000000000000000000000000000008150c6382b63118283bf668160000000000000000000000000000000000000000000000000000f90000000000000001000000046a659130

Parsed Data
9fcf961578ca8a7a2a99a02ec5e279b295498284ae85dffd33ebbec442dacb90 <-- previous hash
f055091d <-- bits (BE)
0d5e3d9771a01061a4d5002b8ac49c27d33f45ec492b1a2f8e16f40536a5ffc2 <-- ancestor hash
0f9fba807ac9794a87d796cf827452c29a095a4dde5df050462e450e4c32c518 <-- coinbase txid (LE) / merkle root
0000000000000000000000000000000000000000000000000000000000000000 <-- ??
08150c6382b631 <-- ??
18283bf668160000000000000000000000000000000000000000000000000000 <-- chainwork (BE)
f900000000000000 <-- size (249 bytes)
01 <-- # of transactions??
00000004 <-- xx type??
6a659130 <-- nonce

*/
        parseBlock(_rawBlock) {
            if (!this.isHex(_rawBlock)) return

            const block = _rawBlock

            const version = block.slice(0, 2)
            console.info('Block version:', version, parseInt(version, 16))

            const inputCount = block.slice(2, 4)
            console.info('Block input count:', inputCount, parseInt(inputCount, 16))

            // const val1 = block.slice(4, 4 + (parseInt(inputCount, 16) * 2))
            // console.info('Block value #1:', val1)

        },

        parseTx(_rawTx) {
            if (!this.isHex(_rawTx)) return

            const tx = _rawTx

            const version = tx.slice(0, 2)
            console.info('Transaction version:', version, parseInt(version, 16))

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

        this.initRostrum()

    },
    mounted: function () {
        //
    },
}
</script>
