<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';
let logs = ref([])
export default{
    methods: {
        async getLogs(){
            await fetch('http://localhost:3000/admin/logs').then((response) => {
                return response.json();
            }).then((data) => {
                logs.value = data;
            })
        },
        pollData (func_to_call, interval) {
            this.polling = setInterval(() => {
            func_to_call()
            }, interval)
        },
    },
    data(){
        return{
        logs
        }
    },
    created(){
        this.pollData(this.getLogs, 1000);
    },
    destroyed(){
        clearInterval(this.polling)
    }
}

</script> 

<template>
  <VaCard
    color="backgroundSecondary"
  >
    <VaCardTitle class="text-white text-5xl">Server Logs</VaCardTitle>
    <VaCardContent>
        <div class="flex items-center">
           <VaVirtualScroller v-slot="{item}" :items="logs" :wrapper-size="200" :bench="10">
                <VaBadge class="pb-2" color="backgroundPrimary" :text="`${item.timestamp}: ${item.message} `"/>
           </VaVirtualScroller>
        </div>
    </VaCardContent>
  </VaCard>
</template>
