<script>
import { ref } from 'vue';

const queue = ref([])
</script>

<template>
  <div class="bg-gray-600">
    <div>
        <h2>Queue</h2>
        <ul>
            <li v-for="song in queue" :key="song.id">
            {{ song.title }}
            </li>
        </ul>
    </div>
  </div>
</template>