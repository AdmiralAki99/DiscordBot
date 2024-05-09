<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';
let currentSong = ref("")
let repeatSong = ref(false)
let requester = ref("")
let shuffle = ref(false)
let repeatPlaylist = ref(false)
let playbackStatus = ref("")

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
                    playbackStatus.value = data.playback_status;
                }else{
                    currentSong.value = data.currently_playing;
                    requester.value = data.requester;
                    repeatSong.value = data.repeat_song;
                    repeatPlaylist.value = data.repeat_playlist;
                    playbackStatus.value = data.playback_status;
                }

            })
        },
        pollData (func_to_call, interval) {
            this.polling = setInterval(() => {
                func_to_call()
            }, interval)
        },
        async resumeSong(){
            await fetch('http://localhost:3000/resume').then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
            })
        },
        async pauseSong(){
            await fetch('http://localhost:3000/pause').then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
            })
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

<!-- <template>
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
</template> -->

<template>
    <VaCard
        color="backgroundSecondary"
        stripe
        stripe-color="info"
    >
        <VaCardTitle class="text-white text-5xl">Music Playback</VaCardTitle>
        <VaCardContent>
            <div class="flex pt-2 pb-5">
                <div class="grid grid-cols-1 gap-4">
                    <div class="text-white">
                        {{currentSong}}
                    </div>
                    <div class="text-gray-400">
                        Requested by: {{requester}}
                    </div>
                </div>
            </div>

            <div class="">
                <VaButtonGroup round>
                    <VaButton><VaIcon name="shuffle"></VaIcon></VaButton>
                    <VaButton><VaIcon name="skip_previous"></VaIcon></VaButton>
                    <VaButton @click="resumeSong"><VaIcon :name="(playbackStatus == 'Stopped') ? 'pause' : 'play_arrow'"></VaIcon></VaButton>
                    <VaButton><VaIcon name="skip_next"></VaIcon></VaButton>
                    <VaButton><VaIcon name="repeat"></VaIcon></VaButton>
                </VaButtonGroup>
            </div>
            
        </VaCardContent>
    </VaCard>
</template>