<template>
  <!-- eslint-disable -->
  <div style="height: 500px">
    <d3fc-group id="chart" style="display: flex; height: 100%; width: 100%; overflow: hidden">
      <div style="flex: 1; display: flex; flex-direction: column; padding-right: 2em">
        <div style="flex: 1; display: flex; flex-direction: row">
          <d3fc-svg id="y-axis-left" style='width: 3em'></d3fc-svg>
          <d3fc-svg id="plot-area" style="flex: 1; overflow:hidden"></d3fc-svg>
          <d3fc-svg id="y-axis-right" style='width: 3em'></d3fc-svg>
        </div>
        <d3fc-svg id="x-axis" style="height: 2em; margin-left: 3em"></d3fc-svg>
      </div>
    </d3fc-group>
  </div>
</template>

<script>
import { defaultChartDefinition } from '../chart/constants';
import { initChartConfig, FinChart } from '../chart/finChart';
import inputParser from '../inputParser'
const deepEqual = require('deep-equal');
const moment = require('moment');

export default {
  name: 'Chart',
  props: {
    userInput: { type: Object }
  },
  created() {
    this.to = moment(Date.now());
    this.from = moment(this.to).subtract(1, 'days');
    this.granularity = this.userInput.granularity;
    this.symbols = inputParser(this.userInput.symbols);
  },
  mounted() {
    this.render()
  },
  watch: {
    "userInput.granularity": function (newVal, oldVal) {
      if (newVal === oldVal) return;
      console.debug("Changing resolution to", newVal);
      this.granularity = newVal;
      this.render();
    },
    "userInput.symbols": function (newVal, oldVal) {
      if (deepEqual(newVal, oldVal)) return;
      console.debug("Changing symbols", newVal, oldVal);
      this.symbols = inputParser(newVal, this.userInput.adapter);
      this.render();
    }
  },
  methods: {
    render() {
      const chartConfig = initChartConfig({
        symbols: this.symbols,
        adapter: this.userInput.adapter,
        indicators: this.userInput.indicators,
        series: this.userInput.series
      });

      this.chart = new FinChart(chartConfig);
      this.chart
          .render(this.from, this.to, this.granularity)
    }
  }
};
</script>
