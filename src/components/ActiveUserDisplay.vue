<script>
import { getCurrentInstance, ref } from 'vue';

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
        pollData (func_to_call, interval) {
            this.polling = setInterval(() => {
                func_to_call()
            }, interval)
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
                <VaButton><VaIcon name="remove"></VaIcon></VaButton>
            </VaListItem>
        </VaList>
    </VaCardContent>

    </VaCard>
</template>