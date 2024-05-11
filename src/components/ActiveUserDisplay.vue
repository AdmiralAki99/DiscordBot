<script>
import { getCurrentInstance, ref } from 'vue';
import axios from 'axios';

let users = ref([])

export default{
    methods:{
        async getActiveUsers(){
            await fetch('http://localhost:3000/users').then((response) => {
                return response.json();
            }).then((data) => {
                users.value = data;
            }
            )
            console.log(users.value)
        },
        async getUserInfo(){
            await this.getActiveUsers()
        }
        ,
        async sendDeafenRequest(user){
            await axios.post('http://localhost:3000/deafen', {
               userId: user.id
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendUndeafenRequest(userId){
            await axios.post('http://localhost:3000/undeafen', {
               userId: userId.id
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendMuteRequest(user){
            await axios.post('http://localhost:3000/mute',{
                userId: user.id
            }).then((response) => {
                return console.log(response);
            })
        },
        async sendUnmuteRequest(user){
            await axios.post('http://localhost:3000/unmute', {
                userId: user.id
            }).then((response) => {
                return console.log(response);
            })
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
                <div class="grid grid-cols-2 items-center justify-center gap-44">
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
                    <div class="grid grid-cols-3">
                        <div v-if="!user.isMuted">
                            <VaButton @click="sendMuteRequest(user)"><VaIcon name="mic"></VaIcon></VaButton>
                        </div>
                        <div v-else>
                            <VaButton @click="sendUnmuteRequest(user)"><VaIcon name="mic_off"></VaIcon></VaButton>
                        </div>
                        <div v-if="!user.isDeafened">
                            <VaButton @click="sendDeafenRequest(user)"><VaIcon name="headset"></VaIcon></VaButton>
                        </div>
                        <div v-else>
                            <VaButton @click="sendUndeafenRequest(user)"><VaIcon name="headset_off"></VaIcon></VaButton>
                        </div>
                        <VaButton @click="kickUser(user)"><VaIcon name="block"></VaIcon></VaButton>
                    </div>                  
                </div>
                
            </VaListItem>
        </VaList>
    </VaCardContent>

    </VaCard>
</template>