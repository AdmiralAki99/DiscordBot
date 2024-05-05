<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';
let currentSong = ref("")
let repeatSong = ref(false)
let requester = ref("")
let shuffle = ref(false)
let repeatPlaylist = ref(false)

export default{
    methods:{
        async getStatus(){
            await fetch('http://localhost:3000/status').then((response) => {
                return response.json();
            }).then((data) => {
                if(data.currently_playing == "Nothing"){
                    currentSong.value = "No song currently playing"
                    requester.value = ""
                    repeatSong.value = data.repeat_song;
                    repeatPlaylist.value = data.repeat_playlist;
                }else{
                    currentSong.value = data.currently_playing;
                    requester.value = data.requester;
                    repeatSong.value = data.repeat_song;
                    repeatPlaylist.value = data.repeat_playlist;
                }

            })
        },
        pollData (func_to_call, interval) {
            this.polling = setInterval(() => {
                func_to_call()
            }, interval)
        }
    },

    data(){
        return{
            repeatSong,
            shuffle,
            repeatPlaylist,
            currentSong,
            requester
        }
    },
    created(){
        this.pollData(this.getStatus, 1000);
    },
    beforeDestroy(){
        clearInterval(this.polling)
    }
}

</script>

<template>
    <div>
        <h2 class="text-2xl pb-5 text-white">Current Media</h2>
        <div class="flex">
            <div class="grid grid-cols-1 gap-4">
                <div v-html="currentSong" class="text-white">
                    
                </div>
                <div v-html="requester" class="text-white">
                    
                </div>
            </div>
        </div>
        <div class="grid grid-cols-5 gap-4 grid-rows-1 pt-4">
                <div>Shuffle</div>
                <div><-</div>
                <div>Play</div>
                <div>Skip</div>
                <div>Repeat</div>
            </div>
    </div>
</template>