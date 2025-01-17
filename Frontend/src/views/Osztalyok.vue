<template>
  <div>
    <h1 class="text-center my-4">Osztályok</h1>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div
          class="spinner-border m-0 p-0 text-center"
          role="status"
          v-if="osztalyok.length == 0"
        >
          <span class="visually-hidden m-0">Loading...</span>
        </div>

        <div class="col-12 col-lg-10  tabla-container" v-if="osztalyok.length > 0">
          <table
            class="table table-bordered table-hover table-striped shadow-sm rounded"
          >
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>osztályNév</th>
                <th class="text-center">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="osztaly in paginatedOsztalyok"
                :key="osztaly.id"
                @click="onClickTr(osztaly.id)"
                :class="{
                  updating: loading,
                  active: osztaly.id === selectedRowOsztalyId,
                }"
              >
                <td data-label="ID">{{ osztaly.id }}</td>
                <td data-label="Név">
                  {{ osztaly.osztalyNev }}
                  <span
                    class="spinner-border m-0 p-0"
                    role="status"
                    v-if="osztaly.id === selectedRowOsztalyId && loading"
                  >
                    <span class="visually-hidden m-0">Loading...</span>
                  </span>
                </td>
                <td class="text-nowrap text-center">
                  <OperationsCrud
                    @onClickDeleteButton="onClickDeleteButton"
                    @onClickUpdate="onClickUpdate"
                    @onClickCreate="onClickCreate"
                    :data="osztaly"
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

          <OsztalyForm
            v-if="state == 'Create' || state == 'Update'"
            :osztalyForm="osztaly"
            @saveOsztaly="saveOsztalyHandler"
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
class Osztaly {
  constructor(id = null, osztalyNev = null) {
    this.id = id;
    this.osztalyNev = osztalyNev;
  }
}
import { BASE_URL } from "../helpers/baseUrls";
import { useAuthStore } from "@/stores/useAuthStore.js";
import OsztalyForm from "@/components/OsztalyForm.vue";
import OperationsCrud from "@/components/OperationsCrud.vue";
import axios from "axios";
import * as bootstrap from "bootstrap";
import uniqid from "uniqid";
export default {
  components: { OsztalyForm, OperationsCrud },
  data() {
    return {
      urlApi: BASE_URL,
      stateAuth: useAuthStore(),
      osztalyok: [],
      loading: false,
      modal: null,
      currentPage: 1,
      itemsPerPage: 5,
      osztaly: new Osztaly(uniqid()),
      selectedRowOsztalyId: null,
      messageYesNo: null,
      state: "Read", //CRUD: Create, Read, Update, Delete
      title: null,
      yes: null,
      no: null,
      size: null,
    };
  },
  mounted() {
    this.getOsztalyok();
    this.modal = new bootstrap.Modal("#modal", {
      keyboard: false,
    });
  },
  computed: {
    paginatedOsztalyok() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.osztalyok.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.osztalyok.length / this.itemsPerPage);
    },
  },
  methods: {
    async getOsztalyok() {
      const url = `${this.urlApi}/osztalies`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.osztalyok = response.data.data;
      this.loading = false;
    },

    async deleteOsztalyById() {
      const id = this.selectedRowOsztalyId;
      const token = this.stateAuth.token;

      const url = `${this.urlApi}/osztalies/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // await axios.delete(url, { headers });
      // const response = await axios.get(`${this.urlApi}/sports`, { headers });

      const response = await axios.delete(url, { headers });
      this.osztalyok = this.osztalyok.filter((osztaly) => osztaly.id !== id);
    },

    async createOsztaly() {
      const token = this.stateAuth.token;
      const url = `${this.urlApi}/osztalies`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        osztalyNev: this.osztaly.osztalyNev,
      };

      const response = await axios.post(url, data, { headers });
      this.osztalyok.push(response.data.data);

      this.state = "Read";
    },

    async updateOsztaly() {
      this.loading = true;
      const id = this.osztaly.id;
      const url = `${this.urlApi}/osztalies/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.stateAuth.token}`,
      };

      const data = {
        osztalyNev: this.osztaly.osztalyNev,
      };

      const response = await axios.patch(url, data, { headers });
      this.getOsztalyok();

      this.state = "Read";
    },

    yesEventHandler() {
      if (this.state == "Delete") {
        this.deleteOsztalyById();
        this.goToPage(1);
      }
    },

    onClickDeleteButton(osztaly) {
      this.state = "Delete";
      this.title = "Törlés";
      this.messageYesNo = `Valóban törölni akarod a(z) ${osztaly.osztalyNev} nevű osztályt?`;
      this.yes = "Igen";
      this.no = "Nem";
      this.size = null;
    },

    onClickUpdate(osztaly) {
      this.state = "Update";
      this.title = "Osztály módosítása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.osztaly = { ...osztaly };
    },

    onClickCreate() {
      this.title = "Új osztály létrehozása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.state = "Create";
      this.osztaly = new Osztaly(uniqid());
    },

    onClickTr(id) {
      if (this.selectedRowDiakId === id) {
        this.selectedRowDiakId = null;
      } else {
        this.selectedRowDiakId = id;
      }
    },

    saveOsztalyHandler() {
      if (this.state === "Update") {
        this.updateOsztaly();
      } else if (this.state === "Create") {
        this.createOsztaly();
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

</style>