<script>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
import {ref } from 'vue'
import { Bar } from 'vue-chartjs'
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

  let labels = ref([])
  let datasets = ref([{ data: [] }])
  let loaded = ref(false)
  let chartId = ref(0)

  export default {
    components: {
      Bar
    },
    methods: {
        async fetchData() {
            await fetch('http://localhost:3000/logs/get/records').then((response) => {
            return response.json();
            }).then((data) => {
                labels.value = [...data.labels] // Using spread operator to trigger reactivity
                datasets.value[0].data = [...data.frequency]
                this.loaded = true
                this.chartId++
            })  
        },
        startPolling() {
            this.polling = setInterval(() => {
                this.fetchData();
                }, 5000);
        },
        
        stopPolling() {
            clearInterval(this.polling);
            console.log('Polling stopped');
        },
    },
    data() {
      return {
        data: {
            labels,
            datasets
        },
        options: {
          responsive: true
        },
      }
    },

    created(){
        this.fetchData()
        this.startPolling()
    },

    beforeDestroy(){
        this.stopPolling()
    }

  }
  </script>

<template>
    <VaCard>
        <VaCardContent class="w-full">
            <Bar :data="data" :options="options" :key="chartId" />
        </VaCardContent>
    </VaCard>
</template>
