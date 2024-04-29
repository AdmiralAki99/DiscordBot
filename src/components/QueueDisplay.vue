<script>
import { ref } from 'vue';
import axios from 'axios';
let queue = ref([])

export default{
  methods:{
    async getQueue(){
     await fetch('http://localhost:3000/queue').then((response) => {
        return response.json();
      }).then((data) => {
        queue = data;
      }
      )
    }
  }
}

</script>

<template>
  <div class="bg-gray-600">
    <div>
        <h2>Queue</h2>
        <ul>
          <li v-for="song in queue" :key="song.id">
            {{song.title}}
          </li>
        </ul>
        <button @click="getQueue">Get Queue</button>
    </div>
  </div>
</template>