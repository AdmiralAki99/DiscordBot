<script>
import { Bar } from 'vue-chartjs';
import BarChartComponent from './BarChartComponent.vue';
const TABS = [
  { icon: "bar_chart", title: "Chart", content: BarChartComponent },
  { icon: "person", title: "Profile", content: "Profile content" },
];

export default {
  data: () => ({
    tabs: TABS,
    value: TABS[0].title,
  }),

  computed: {
    currentTab() {
      return this.tabs.find(({ title }) => title === this.value);
    },
  },
  components: {
    BarChartComponent,
  },
};
</script>

<template>
  <VaTabs
    v-model="value"
    vertical
    grow
  >
    <template #tabs>
      <VaTab
        v-for="tab in tabs"
        :key="tab.title"
        :name="tab.title"
      >
        <VaIcon
          :name="tab.icon"
          size="small"
          class="mr-3"
        />
        {{ tab.title }}
      </VaTab>
    </template>

    <VaCard
      square
      outlined
    >
      <VaCardTitle>
        <VaIcon
          :name="currentTab.icon"
          size="small"
          class="mr-2"
          color="background-element"
        />
        {{ currentTab.title }}
      </VaCardTitle>
      <VaCardContent>
        <div v-if="currentTab.title === 'Chart'">
          <BarChartComponent />
        </div>
        <div v-else>
          <p>{{ currentTab.content }}</p>
        </div>
      </VaCardContent>
    </VaCard>
  </VaTabs>
</template>


