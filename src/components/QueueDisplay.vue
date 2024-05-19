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
    },
    async removeSongFromIndex(index){
      await axios.post('http://localhost:3000/music/remove',{
        index: index
      }).then((response) => {
        console.log(response)
      })
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
<!-- Original template -->
<!-- <template>
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
</template> -->

<template>
  <VaCard
    color="backgroundSecondary"
  >
    <VaCardTitle class="text-white text-5xl">Music Queue</VaCardTitle>
    <VaCardContent>
      <VaList>
        <VaListItem
          v-for="song in queue"
          :key="song.id" class="pb-5">
          <div class="grid grid-cols-4 grid-rows-1 gap-10">
              <div class="col-span-3">
                <VaListItemAvatar>
                  <VaAvatar class="pr-2">
                    <img :src="song.thumbnail" alt="album art" />
                  </VaAvatar>
                </VaListItemAvatar>
                <VaListItemText class="pr-2 text-wrap">
                  <VaListItemTitle>{{ song.title }}</VaListItemTitle>
                </VaListItemText>
              </div>
                <div>
                  <div v-if="song.index == 0">
                    <VaButton disabled>
                      <VaIcon name="delete"></VaIcon>
                    </VaButton>
                  </div>
                  <div v-else>
                    <VaButton icon>
                      <VaIcon @click="removeSongFromIndex(song.index)" name="delete"></VaIcon>
                    </VaButton>
                  </div>
                </div>
          </div>
        </VaListItem>
      </VaList>
    </VaCardContent>
  </VaCard>
</template>
