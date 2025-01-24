<template>
  <div
    class="alert alert-danger alert-dismissible"
    role="alert"
    v-show="errorMessages"
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
  }
};
</script>

<style>
</style>