<template>
  <form
    @submit.prevent="onClickSubmit"
    class="row g-3 needs-validation was-validated"
  >
  <p v-if="debug">{{ diakForm }}</p>
    <div class="col-md-4 position-relative">
      <label for="nev" class="form-label">Név:</label>
      <input
        type="text"
        class="form-control"
        id="nev"
        required
        v-model="diakForm.nev"
      />
    </div>

    <div class="col-md-2 position-relative">
      <label for="atlag" class="form-label">Átlag:</label>
      <input
        type="text"
        class="form-control"
        id="atlag"
        required
        v-model="diakForm.atlag"
      />
    </div>

    <div class="col-md-3 position-relative">
      <label for="osztondij" class="form-label">Ösztöndíj:</label>
      <input
        type="text"
        class="form-control"
        id="osztondij"
        required
        :value="formattedOsztondij"
        @input="updateOsztondij($event.target.value)"
      />
    </div>

    <div class="col-md-2 position-relative">
      <label for="neme" class="form-label">Neme:</label>
      <select class="form-control" id="neme" required v-model="diakForm.neme">
        <option :value="true">Férfi</option>
        <option :value="false">Nő</option>
      </select>
    </div>

    <div class="col-md-4 position-relative">
      <label for="helyseg" class="form-label">Helység:</label>
      <input
        type="text"
        class="form-control"
        id="helyseg"
        required
        v-model="diakForm.helyseg"
      />
    </div>

    <div class="col-md-3 position-relative">
      <label for="szuletett" class="form-label">Született:</label>
      <input
        type="date"
        class="form-control"
        id="szuletett"
        required
        v-model="diakForm.szuletett"
      />
    </div>

    <div class="col-md-2 position-relative">
      <label for="osztalyId" class="form-label">Osztály:</label>
      <select
        class="form-control"
        id="osztalyId"
        required
        v-model="diakForm.osztalyId"
      >
        <option
          v-for="osztaly in osztalyok"
          :key="osztaly.id"
          :value="osztaly.id"
        >
          {{ osztaly.osztalyNev }}
        </option>
      </select>
    </div>
    <button type="submit" class="btn btn-success">Mentés</button>
  </form>
</template>

<script>
export default {
  props: ["diakForm", "osztalyok", "debug"],
  emits: ["saveDiak"],
  computed: {
    formattedOsztondij() {
      if (!this.diakForm.osztondij) return "";
      return this.diakForm.osztondij
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
  },
  methods: {
    onClickSubmit() {
      this.$emit("saveDiak", this.diakForm);
    },
    updateOsztondij(value) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
      this.diakForm.osztondij = isNaN(numericValue) ? 0 : numericValue;
    },
  },
};
</script>