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
        },
        async sendDeafenRequest(userId){
            await fetch('http://localhost:3000/deafen', {
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
        sendUndeafenRequest(userId){
            fetch('http://localhost:3000/undeafen', {
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
        sendUnmuteRequest(userId){
            fetch('http://localhost:3000/unmute', {
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
            <VaListItem v-for="user in users" :key="user.id">
                <VaListItemAvatar>
                    <VaAvatar class="pr-2">
                        <img :src="user.avatar" alt="user avatar" />
                    </VaAvatar>
                </VaListItemAvatar>
                <VaListItemText>
                    <VaListItemTitle>{{user.username}}</VaListItemTitle>
                </VaListItemText>
                <VaButton @click="kickUser(user)"><VaIcon name="remove"></VaIcon></VaButton>
                <VaButton><VaIcon name="block"></VaIcon></VaButton>
                <VaButton @click="sendMuteRequest(user)"><VaIcon name="mic_off"></VaIcon></VaButton>
                <VaButton @click="deafenUser(user)"><VaIcon name="headset_off"></VaIcon></VaButton>
            </VaListItem>
        </VaList>
    </VaCardContent>

    </VaCard>
</template>