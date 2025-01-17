<template>
  <form @submit.prevent="onClickSubmit" class="row g-4 needs-validation was-validated">
    <div class="col-md-8 position-relative">
      <label for="sportNev" class="form-label">sportNév:</label>
      <input
        type="text"
        class="form-control"
        id="sportNev"
        required
        v-model="sportForm.sportNev"
      />
    </div>
    <button type="submit" class="btn btn-success">Mentés</button>
  </form>
</template>

<script>
export default {
  props: ["sportForm"],
  emits: ["saveSport"],
  methods: {
    onClickSubmit() {
      this.$emit("saveSport", this.sportForm);
    },
  },
};
</script>

<style>
</style>
