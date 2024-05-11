<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';

let users = ref([])
let voiceStatus = ref([])

export default{
    methods:{
        async getActiveUsers(){
            await fetch('http://localhost:3000/users').then((response) => {
                return response.json();
            }).then((data) => {
                users.value = data;
            }
            )
        },
        async sendDeafenRequest(userId){
            await axios.post('http://localhost:3000/deafen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendUndeafenRequest(userId){
            await axios.post('http://localhost:3000/undeafen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendMuteRequest(userId){
            await axios.post('http://localhost:3000/mute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendUnmuteRequest(userId){
            await axios.post('http://localhost:3000/unmute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            }).then((response) => {
                return console.log(response);
            })
        },

        async getVoiceStatus(){
            await fetch('http://localhost:3000/voiceStatus').then((response) => {
                return response.json();
            }).then((data) => {
                voiceStatus.value = data;
            })
        }
        ,

        checkUserMuteStatus(user){
            let userVoiceStatus = voiceStatus.value.find((voiceStatus) => voiceStatus.userId === user.id)
            if(userVoiceStatus.isMuted === true){
                return true
            }
            else{
                return false
            }
        }
        ,
        pollData (func_to_call, interval) {
            this.polling = setInterval(() => {
                func_to_call()
            }, interval)
        },
        async deafenUser(user){
            this.sendDeafenRequest(user.id)
        },
        async kickUser(user){
            await fetch('http://localhost:3000/kick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id
                })
            }).then((response) => {
                return console.log(response);
            })
        }
    },

    data(){
        return{
            users
        }
    },

    created ()
    {
        this.pollData(this.getActiveUsers, 1000);
        // this.pollData(this.getVoiceStatus, 1000);
    },

    beforeDestroy()
    {
        clearInterval(this.polling)
    }
}

</script>

<template>
    <VaCard
    color="backgroundSecondary"
    >
    <VaCardTitle>Active Users</VaCardTitle>
    <VaCardContent class="flex space-x-10 h-full">
        <VaList>
            <VaListItem v-for="user in users" :key="user.id" class="pb-2 w-full">
                <div class="grid grid-cols-2 items-center justify-center gap-36">
                    <div>
                        <VaListItemAvatar class="pr-2">
                            <VaAvatar class="pr-2">
                                <img :src="user.avatar" alt="user avatar" />
                            </VaAvatar>
                        </VaListItemAvatar>
                        <VaListItemText>
                            <VaListItemTitle>{{user.username}}</VaListItemTitle>
                        </VaListItemText>
                    </div>
                    <div>
                        <VaButton @click="kickUser(user)"><VaIcon name="remove"></VaIcon></VaButton>
                        <VaButton><VaIcon name="block"></VaIcon></VaButton>
                        <VaButton @click="sendMuteRequest(user)"><VaIcon name="mic_off"></VaIcon></VaButton>
                        <VaButton @click="deafenUser(user)"><VaIcon name="headset_off"></VaIcon></VaButton>
                    </div>                  
                </div>
                
            </VaListItem>
        </VaList>
    </VaCardContent>

    </VaCard>
</template>