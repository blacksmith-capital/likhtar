<template>
  <!-- eslint-disable -->
  <div id="app-wrapper">
    <h3>{{ symbols }}</h3>
    <InputSymbol :input="symbols" @input-update="symbolsUpdate"/>
    <InputGranularity :granularity="granularity" @granularity-update="granularityUpdate"/>
    <Chart :userInput="userInput" />
  </div>
</template>

<script>
import Chart from './Chart'
import InputGranularity from './InputGranularity'
import InputSymbol from './InputSymbol'

export default {
  name: 'app',
  components: {
    Chart,
    InputGranularity,
    InputSymbol
  },

  computed: {
    userInput: function() {
      return {
        symbols: this.symbols,
        granularity: this.granularity,
        adapter: this.$parent.adapter,
        indicators: this.$parent.indicators,
        series: this.$parent.series
      }
    }
  },

  data: function () {
    return {
      symbols: this.$parent.symbols || "BITMEX:XBTUSD",
      granularity: this.$parent.granularity || "5m",
    }
  },
  methods: {
    symbolsUpdate: function(newVal) {
      this.symbols = newVal;
    },
    granularityUpdate: function(newVal) {
      this.granularity = newVal;
    }
  }
};
</script>
