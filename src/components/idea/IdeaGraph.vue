<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const props = defineProps(['ideas'])

const chartDom = ref(null)

onMounted(() => {
  const chart = echarts.init(chartDom.value)

  // 生成图谱数据
  const nodes = props.ideas.map(idea => ({
    id: idea.id,
    name: idea.title,
    symbolSize: 30 + Math.random() * 50
  }))

  const links = []
  for (let i = 0; i < nodes.length - 1; i++) {
    if (Math.random() > 0.7) {
      links.push({
        source: nodes[i].id,
        target: nodes[i + 1].id
      })
    }
  }

  chart.setOption({
    tooltip: {},
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      roam: true,
      label: {
        show: true,
        position: 'right',
        formatter: '{b}'
      },
      lineStyle: {
        width: 2
      }
    }]
  })
})
</script>

<template>
  <div ref="chartDom" style="width: 100%; height: 500px;"></div>
</template>