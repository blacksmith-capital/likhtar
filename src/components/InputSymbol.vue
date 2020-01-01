<template>
  <!-- eslint-disable -->
  <div>
    <input v-model="inputVal" placeholder="e.g. BITMEX:XBTUSD">
  </div>
</template>

<script>
export default {
  name: 'input-symbol',
  props: {
    input: String
  },
  computed: {
    inputVal: {
      get() {
        return this.input;
      },
      set(val) {
        this.$emit("input-update", val);
      }
    }
  }
};
</script>
