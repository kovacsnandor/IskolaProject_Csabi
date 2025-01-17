<template>
  <div>
    <h1 class="text-center my-4">Sportok</h1>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div
          class="spinner-border m-0 p-0 text-center"
          role="status"
          v-if="sports.length == 0"
        >
          <span class="visually-hidden m-0">Loading...</span>
        </div>

        <div class="col-12 col-lg-10 tabla-container" v-if="sports.length > 0">
          <table
            class="table table-bordered table-hover table-striped shadow-sm rounded"
          >
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Sport Név</th>
                <th class="text-center">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sport in paginatedSportok"
                :key="sport.id"
                @click="onClickTr(sport.id)"
                :class="{
                  updating: loading,
                  active: sport.id === selectedRowSportId,
                }"
              >
                <td data-label="ID">{{ sport.id }}</td>
                <td data-label="Név">
                  {{ sport.sportNev }}
                  <span
                    class="spinner-border m-0 p-0"
                    role="status"
                    v-if="sport.id === selectedRowSportId && loading"
                  >
                    <span class="visually-hidden m-0">Loading...</span>
                  </span>
                </td>
                <td class="text-nowrap text-center">
                  <OperationsCrud
                    @onClickDeleteButton="onClickDeleteButton"
                    @onClickUpdate="onClickUpdate"
                    @onClickCreate="onClickCreate"
                    :data="sport"
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

          <SportForm
            v-if="state == 'Create' || state == 'Update'"
            :sportForm="sport"
            @saveSport="saveSportHandler"
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
class Sport {
  constructor(id = null, sportNev = null) {
    this.id = id;
    this.sportNev = sportNev;
  }
}
import { BASE_URL } from "../helpers/baseUrls";
import { useAuthStore } from "@/stores/useAuthStore.js";
import SportForm from "@/components/SportForm.vue";
import OperationsCrud from "@/components/OperationsCrud.vue";
import axios from "axios";
import * as bootstrap from "bootstrap";
import uniqid from "uniqid";
export default {
  components: { SportForm, OperationsCrud },
  data() {
    return {
      urlApi: BASE_URL,
      stateAuth: useAuthStore(),
      sports: [],
      loading: false,
      modal: null,
      currentPage: 1,
      itemsPerPage: 5,
      sport: new Sport(uniqid()),
      selectedRowSportId: null,
      messageYesNo: null,
      state: "Read", //CRUD: Create, Read, Update, Delete
      title: null,
      yes: null,
      no: null,
      size: null,
    };
  },
  mounted() {
    this.getSports();
    this.modal = new bootstrap.Modal("#modal", {
      keyboard: false,
    });
  },
  computed: {
    paginatedSportok() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sports.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sports.length / this.itemsPerPage);
    },
  },
  methods: {
    async getSports() {
      const url = `${this.urlApi}/sports`;
      const headers = {
        Accept: "application/json",
      };
      const response = await axios.get(url, headers);
      this.sports = response.data.data;
      this.loading = false;
    },

    async deleteSportById() {
      const id = this.selectedRowSportId;
      const token = this.stateAuth.token;

      const url = `${this.urlApi}/sports/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // await axios.delete(url, { headers });
      // const response = await axios.get(`${this.urlApi}/sports`, { headers });

      const response = await axios.delete(url, { headers });
      this.sports = this.sports.filter((sport) => sport.id !== id);
    },

    async createSport() {
      const token = this.stateAuth.token;
      const url = `${this.urlApi}/sports`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        sportNev: this.sport.sportNev,
      };

      const response = await axios.post(url, data, { headers });
      this.sports.push(response.data.data);

      this.state = "Read";
    },

    async updateSport() {
      this.loading = true;
      const id = this.sport.id;
      const url = `${this.urlApi}/sports/${id}`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.stateAuth.token}`,
      };

      const data = {
        sportNev: this.sport.sportNev,
      };

      const response = await axios.patch(url, data, { headers });
      this.getSports();

      this.state = "Read";
    },

    yesEventHandler() {
      if (this.state == "Delete") {
        this.deleteSportById();
        this.goToPage(1);
      }
    },

    onClickDeleteButton(sport) {
      this.state = "Delete";
      this.title = "Törlés";
      this.messageYesNo = `Valóban törölni akarod a(z) ${sport.sportNev} nevű sportot?`;
      this.yes = "Igen";
      this.no = "Nem";
      this.size = null;
    },

    onClickUpdate(sport) {
      this.state = "Update";
      this.title = "Sport módosítása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.sport = { ...sport };
    },

    onClickCreate() {
      this.title = "Új sport létrehozása";
      this.yes = null;
      this.no = "Mégsem";
      this.size = "lg";
      this.state = "Create";
      this.sport = new Sport(uniqid());
    },

    onClickTr(id) {
      if (this.selectedRowDiakId === id) {
        this.selectedRowDiakId = null;
      } else {
        this.selectedRowDiakId = id;
      }
    },

    saveSportHandler() {
      if (this.state === "Update") {
        this.updateSport();
      } else if (this.state === "Create") {
        this.createSport();
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