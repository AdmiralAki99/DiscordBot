<script>
  import './assets/splash.css'
  import QueueDisplay from './components/QueueDisplay.vue';
  import CurrentMetadata from './components/CurrentMetadata.vue';
  export default {
    components: {
      QueueDisplay,
      CurrentMetadata
    }
  }
</script>

<template>
  <div style="background-color: #222222;">
    <div class="pt-10 pl-10" style="background: transparent">
      <h1 class="text-white text-5xl">Admin Dashboard</h1>
      <div class="grid grid-cols-3 gap-4 h-svh">
        <div class="bg-gray-600">Number Of Users Active</div>
        <div>Element 2</div>
        <div><CurrentMetadata/></div>
        <div class="row-start-2 row-end-4"><QueueDisplay/></div>
        <div class="row-span-3">User Request Info</div>
      </div>
    </div>
  </div>
</template>

