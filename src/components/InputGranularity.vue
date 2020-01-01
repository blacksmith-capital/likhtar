<template>
  <!-- eslint-disable -->
  <div>
    <select v-model="granularityVal">
      <option disabled value="">Please select one</option>
      <option>1m</option>
      <option>5m</option>
      <option>15m</option>
      <option>1h</option>
      <option>1d</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'input-granularity',
  props: {
    granularity: String
  },
  computed: {
    granularityVal: {
      get() {
        return this.granularity;
      },
      set(val) {
        this.$emit("granularity-update", val);
      }
    }
  }
};
</script>
