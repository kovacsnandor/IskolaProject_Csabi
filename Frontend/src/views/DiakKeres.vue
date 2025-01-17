<template>
  <div>
    <h1>Diák kereső</h1>
    <div class="d-flex" role="search">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        v-model="searchInput"
      />
      <button
        class="btn btn-outline-success"
        type="submit"
        @click="onClickSearch()"
      >
        Search
      </button>
    </div>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>osztalyId</th>
          <th>nev</th>
          <th>neme</th>
          <th>született</th>
          <th>helység</th>
          <th>ösztöndíj</th>
          <th>átlag</th>
          <th>osztálynév</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.osztalyId }}</td>
          <td>{{ row.nev }}</td>
          <td>{{ row.neme }}</td>
          <td>{{ row.szuletett }}</td>
          <td>{{ row.helyseg }}</td>
          <td>{{ row.osztondij }}</td>
          <td>{{ row.atlag }}</td>
          <td>{{ row.osztalynev }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { BASE_URL } from "../helpers/baseUrls";
import axios from "axios";
export default {
  data() {
    return {
      urlApi: BASE_URL,
      rows: [],
      searchInput: null,
      searchWord: null,
    };
  },
  mounted() {
    this.getDiaks();
  },
  watch: {},
  methods: {
    async getDiaks() {
      const url = `${this.urlApi}/queryDiakKeres/${this.searchWord}`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.rows = response.data.data;
      console.log(this.rows);
    },
    onClickSearch() {
      this.searchWord = this.searchInput;
      this.getDiaks();
    },
  },
};
</script>

<style>
</style>