<template>
  <div>
    <h1 class="text-center my-4">Diákok</h1>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div
          class="spinner-border m-0 p-0 text-center"
          role="status"
          v-if="diakok.length == 0"
        >
          <span class="visually-hidden m-0">Loading...</span>
        </div>

        <div class="col-12 col-lg-12 tabla-container" v-if="diakok.length > 0">
          <table
            class="table table-bordered table-hover table-striped shadow-sm rounded"
          >
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>osztályNév</th>
                <th>Név</th>
                <th>Nem</th>
                <th>Születési dátum</th>
                <th>Helység</th>
                <th>Ösztöndíj</th>
                <th>Átlag</th>
                <th>Sportok</th>
                <th class="text-center">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="diak in paginatedDiakok"
                :key="diak.id"
                @click="onClickTr(diak.id)"
                :class="{
                  active: diak.id === selectedRowDiakId,
                  updating: loading,
                }"
              >
                <td data-label="ID">
                  <span>{{ diak.id }}</span>
                </td>
                <td data-label="OsztályNév">
                  <span>{{ getOsztalyNevById(diak.osztalyId) }}</span>
                </td>
                <td data-label="Név">
                  <span>{{ diak.nev }}</span>
                </td>
                <td data-label="Nem">
                  <span>{{ diak.neme ?? false ? "Férfi" : "Nő" }}</span>
                </td>
                <td data-label="Születési dátum">
                  <span>{{ diak.szuletett }}</span>
                </td>
                <td data-label="Helység">
                  <span>{{ diak.helyseg }}</span>
                </td>
                <td data-label="Ösztöndíj">
                  <span>{{ formatOsztondij(diak.osztondij) }}</span>
                </td>
                <td data-label="Átlag">
                  <span>{{ diak.atlag }}</span>
                </td>
                <td
                  data-label="Sportok"
                  style="text-wrap: nowrap"
                  @mouseenter="showSports(diak.id)"
                  @mouseleave="hideSports"
                  class="sportokLista"
                >
                  <span class="sportokRows">{{
                    getSportokSzama(diak.id)
                  }}</span>
                  <div v-if="hoveredDiakId === diak.id" class="sport-tooltip">
                    <!-- <ul>
                      <li
                        v-for="(sport, index) in getSportsForStudent(diak.id)"
                        :key="index"
                      >
                        {{ sport }}
                      </li>
                    </ul> -->
                    <span
                      v-for="(sport, index) in getSportsForStudent(diak.id)"
                      :key="index"
                    >
                      {{ sport }}
                    </span>
                  </div>
                </td>

                <td class="text-nowrap text-center">
                  <OperationsCrud
                    @onClickDeleteButton="onClickDeleteButton"
                    @onClickUpdate="onClickUpdate"
                    @onClickCreate="onClickCreate"
                    :data="diak"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Modal
          :title="title"
          :yes="yes"
          :no="no"
          :size="size"
          @yesEvent="yesEventHandler"
        >
          <div v-if="state == 'Delete'">
            {{ messageYesNo }}
          </div>

          <DiakForm
            v-if="state == 'Create' || state == 'Update'"
            :diakForm="diak"
            :osztalyok="osztalyok"
            @saveDiak="saveDiakHandler"
          />
        </Modal>
      </div>

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
  </div>
</template>
    
<script>
class Diak {
  constructor(
    id = null,
    osztalyId = null,
    nev = null,
    neme = null,
    szuletett = null,
    helyseg = null,
    osztondij = null,
    atlag = null
  ) {
    this.id = id;
    this.osztalyId = osztalyId;
    this.nev = nev;
    this.neme = neme;
    this.szuletett = szuletett;
    this.helyseg = helyseg;
    this.osztondij = osztondij;
    this.atlag = atlag;
  }
}
import { BASE_URL } from "../helpers/baseUrls";
import { useAuthStore } from "@/stores/useAuthStore.js";
import DiakForm from "@/components/DiakForm.vue";
import OperationsCrud from "@/components/OperationsCrud.vue";
import axios from "axios";
import * as bootstrap from "bootstrap";
import uniqid from "uniqid";
export default {
  components: { DiakForm, OperationsCrud },
  data() {
    return {
      urlApi: BASE_URL,
      stateAuth: useAuthStore(),
      diakok: [],
      loading: false,
      modal: null,
      currentPage: 1,
      itemsPerPage: 10,
      diak: new Diak(uniqid()),
      selectedRowDiakId: null,
      messageYesNo: null,
      hoveredDiakId: null,
      state: "Read", //CRUD: Create, Read, Update, Delete
      title: null,
      yes: null,
      no: null,
      size: null,
      osztalyok: [],
      sportolasok: [],
    };
  },
  mounted() {
    this.getOsztalyok();
    this.getDiaks();
    this.getSportolasok();
    this.modal = new bootstrap.Modal("#modal", {
      keyboard: false,
    });
  },

  computed: {
    paginatedDiakok() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.diakok.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.diakok.length / this.itemsPerPage);
    },
  },

  methods: {
    async getOsztalyok() {
      const url = `${this.urlApi}/queryOsztalynevIdvel`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      this.osztalyok = response.data.data;
    },

    async getSportolasok() {
      const url = `${this.urlApi}/queryDiakokSportokkal`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      this.sportolasok = response.data.data;
    },

    async getDiaks() {
      const url = `${this.urlApi}/diaks`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.diakok = response.data.data;
      this.loading = false;
    },

    getOsztalyNevById(id) {
      const osztaly = this.osztalyok.find((osztaly) => osztaly.id === id);
      return osztaly ? osztaly.osztalyNev : "Ismeretlen osztály";
    },

    getSportokSzama(id) {
      const sportolas = this.sportolasok.find(
        (sportolas) => sportolas.id === id
      );
      return sportolas ? sportolas.sportokSzama : 0;
    },

    showSports(diakId) {
      this.hoveredDiakId = diakId;
    },
    hideSports() {
      this.hoveredDiakId = null;
    },

    getSportsForStudent(diakId) {
      const sports = this.sportolasok.find(
        (sportolas) => sportolas.id === diakId
      );
      return sports ? sports.sportok : [];
    },

    formatOsztondij(ossz) {
      return (
        Math.round(ossz)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ft"
      );
    },

    async deleteDiakById() {
      const id = this.selectedRowDiakId;
      const token = this.stateAuth.token;

      const url = `${this.urlApi}/diaks/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // await axios.delete(url, { headers });
      // const response = await axios.get(`${this.urlApi}/sports`, { headers });

      const response = await axios.delete(url, { headers });
      this.diakok = this.diakok.filter((diak) => diak.id !== id);
    },

    async createDiak() {
      const token = this.stateAuth.token;
      const url = `${this.urlApi}/diaks`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        osztalyId: this.diak.osztalyId,
        nev: this.diak.nev,
        neme: this.diak.neme,
        szuletett: this.diak.szuletett,
        helyseg: this.diak.helyseg,
        osztondij: this.diak.osztondij,
        atlag: this.diak.atlag,
      };

      const response = await axios.post(url, data, { headers });
      this.diakok.push(response.data.data);

      this.state = "Read";
    },

    async updateDiak() {
      this.loading = true;
      const id = this.diak.id;
      const url = `${this.urlApi}/diaks/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.stateAuth.token}`,
      };

      const data = {
        osztalyId: this.diak.osztalyId,
        nev: this.diak.nev,
        neme: this.diak.neme,
        szuletett: this.diak.szuletett,
        helyseg: this.diak.helyseg,
        osztondij: this.diak.osztondij,
        atlag: this.diak.atlag,
      };

      const response = await axios.patch(url, data, { headers });
      this.getDiaks();

      this.state = "Read";
    },

    yesEventHandler() {
      if (this.state == "Delete") {
        this.deleteDiakById();
        this.goToPage(1);
      }
    },

    onClickDeleteButton(diak) {
      this.state = "Delete";
      this.title = "Törlés";
      this.messageYesNo = `Valóban törölni akarod a(z) ${diak.nev} nevű diákot?`;
      this.yes = "Igen";
      this.no = "Nem";
      this.size = null;
    },

    onClickUpdate(diak) {
      this.state = "Update";
      this.title = "Diák módosítása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.diak = { ...diak };
    },

    onClickCreate() {
      this.title = "Új diák létrehozása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.state = "Create";
      this.diak = new Diak(uniqid());
    },

    onClickTr(id) {
      if (this.selectedRowDiakId === id) {
        this.selectedRowDiakId = null;
      } else {
        this.selectedRowDiakId = id;
      }
    },

    saveDiakHandler() {
      if (this.state === "Update") {
        this.updateDiak();
      } else if (this.state === "Create") {
        this.createDiak();
        setTimeout(() => {
          this.goToPage(this.totalPages);
        }, 1000);
      }

      this.modal.hide();
    },

    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>
    
<style scoped>
.sportokLista {
  position: relative;
}

.sport-tooltip {
  position: absolute;
  left: 100px;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  text-align: left;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  max-width: 150px;
  width: 140px;
  z-index: 1000;
}

.sport-tooltip span {
  text-wrap: wrap;
}
</style>