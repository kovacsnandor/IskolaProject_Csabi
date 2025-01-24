<template>
  <div
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
    v-if="errorMessages"
  >
    {{ errorMessages }}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="onClose"
    ></button>
  </div>
</template>

<script>
export default {
  props: ["errorMessages"],
  methods: {
    onClose() {
      this.$emit("close");
    },
  },
};
</script>

<style>
</style>