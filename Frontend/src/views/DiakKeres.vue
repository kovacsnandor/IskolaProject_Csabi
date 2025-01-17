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
          <th>osztálynév</th>
          <th>nev</th>
          <th>neme</th>
          <th>született</th>
          <th>helység</th>
          <th>ösztöndíj</th>
          <th>átlag</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ getClassName(row.osztalyId) }}</td>
          <td>{{ row.nev }}</td>
          <td>{{ row.neme ? "Férfi" : "Nő" }}</td>
          <td>{{ row.szuletett }}</td>
          <td>{{ row.helyseg }}</td>
          <td>{{ row.osztondij }}</td>
          <td>{{ row.atlag }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-center my-3">
      <div class="pagination-container d-flex">
        <div
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-box', { 'active-page': currentPage === page }]"
        >
          {{ page }}
        </div>
      </div>
    </div>
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
      osztalyok: [],
      searchInput: "",
      searchWord: "",
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    };
  },
  computed: {
    paginatedRows() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.rows.slice(startIndex, endIndex);
    },

    totalPages() {
      return Math.ceil(this.rows.length / this.itemsPerPage);
    },
  },
  watch: {
    searchInput(newSearchInput) {
      this.searchWord = newSearchInput;
      this.currentPage = 1;
      this.getDiaks();
    },
  },
  mounted() {
    this.getDiaks();
    this.getOsztalyok();
  },
  methods: {
    async getDiaks() {
      let url = `${this.urlApi}/diaks`;
      if (this.searchWord) {
        url = `${this.urlApi}/queryDiakKeres/${this.searchWord}`;
      }
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.rows = response.data.data;
    },
    async getOsztalyok() {
      let url = `${this.urlApi}/osztalies`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.osztalyok = response.data.data;
    },
    onClickSearch() {
      this.searchWord = this.searchInput;
      this.currentPage = 1;
      this.getDiaks();
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.getDiaks();
    },

    getClassName(osztalyId) {
      const osztaly = this.osztalyok.find(
        (osztaly) => osztaly.id === osztalyId
      );
      return osztaly ? osztaly.osztalyNev : "Nincs";
    },

    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style>
</style>