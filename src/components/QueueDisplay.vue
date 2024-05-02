<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';
let queue = ref([])

export default{
  methods:{
    async getQueue(){
     await fetch('http://localhost:3000/queue').then((response) => {
        return response.json();
      }).then((data) => {
        queue.value = data;
      }
      )
    },
    pollData (func_to_call, interval) {
        this.polling = setInterval(() => {
          func_to_call()
        }, interval)
      }
    },
  data(){
    return{
      queue
    }
  },
  created ()
  {
      this.pollData(this.getQueue, 1000);
  },
  beforeDestroy()
  {
    clearInterval(this.polling)
  }
}

</script>

<template>
  <div class="bg-gray-600">
    <div>
        <h2>Queue</h2>
        <ul>
          <li v-for="song in queue" :key="song.id">
            <div class="flex items-center">
              <div class="pr-10">
                <img :src="song.thumbnail" alt="album art" class="h-20 w-20 rounded-full flex-shrink-0 min-w-20 min-h-20" />
              </div>
              {{song.title}}
            </div>
          </li>
        </ul>
    </div>
  </div>
</template>