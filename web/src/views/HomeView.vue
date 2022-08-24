<template>
    <!-- <main class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true"> -->
    <main class="bg-gray-700 h-screen py-5">
        <!-- Background backdrop, show/hide based on slide-over state. -->
        <!-- <div class="fixed inset-0"></div> -->

        <div class="p-5 h-full max-w-3xl mx-auto bg-yellow-100 border-8 border-yellow-300 rounded-xl overflow-y-scroll">
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

        const exampleSocket = new WebSocket("ws://electrum.nexa.org")
        console.log('EXAMPLE SOCKET', exampleSocket);
    },
    mounted: function () {
        //
    },
}
</script>
