<script>
  import './assets/splash.css'
  import QueueDisplay from './components/QueueDisplay.vue';
  import CurrentMetadata from './components/CurrentMetadata.vue';
  import ActiveUserDisplay from './components/ActiveUserDisplay.vue';
  import UserRequestLogs from './components/UserRequestLogs.vue';
  import LogsComponent from './components/LogsComponent.vue'
  export default {
    components: {
      QueueDisplay,
      CurrentMetadata,
      ActiveUserDisplay,
      UserRequestLogs,
      LogsComponent
    }
  }
</script>

<template>
  <div>
    <div class="pt-10 pl-10 pr-10" style="background: transparent">
      <h1 class="text-white text-5xl pb-5">Admin Dashboard</h1>
      <div class="grid grid-cols-3 gap-4 h-svh">
        <div><ActiveUserDisplay/></div>
        <div><LogsComponent/></div>
        <div><CurrentMetadata/></div>
        <div class="row-start-2 row-end-4"><QueueDisplay/></div>
        <div class="row-span-3 w-full"><UserRequestLogs/></div>
      </div>
    </div>
  </div>
</template>

