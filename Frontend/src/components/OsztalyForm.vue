<template>
  <form @submit.prevent="onClickSubmit" class="row g-4 needs-validation was-validated">
    <div class="col-md-8 position-relative">
      <label for="osztalyNev" class="form-label">osztalyNév:</label>
      <input
        type="text"
        class="form-control"
        id="osztalyNev"
        required
        v-model="osztalyForm.osztalyNev"
      />
    </div>
    <button type="submit" class="btn btn-success">Mentés</button>
  </form>
</template>

<script>
export default {
  props: ["osztalyForm"],
  emits: ["saveOsztaly"],
  methods: {
    onClickSubmit() {
      this.$emit("saveOsztaly", this.osztalyForm);
    },
  },
};
</script>

<style>
</style>
