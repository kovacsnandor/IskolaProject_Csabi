<template>
  <div class="contanier">
    <div class="row my-5">
      <div class="col-md-6 mx-auto">
        <div class="card">
          <h5 class="card-header">Login</h5>
          <div class="card-body">
            <form @submit.prevent="userAuth">
              <div class="form-group mb-3">
                <input
                  type="text"
                  v-model="user.email"
                  placeholder="Email*"
                  class="form-control"
                  id="email"
                />
              </div>
              <div class="form-group mb-3">
                <input
                  type="password"
                  v-model="user.password"
                  placeholder="Password*"
                  class="form-control"
                  id="password"
                />
              </div>
              <div class="form-group mb-3">
                <div class="d-flex align-items-center">
                  <button type="submit" class="btn btn-primary me-4">
                    Login
                  </button>

                  <div
                    class="spinner-border m-0 p-0"
                    role="status"
                    v-if="errorMessage == '...'"
                  >
                    <span class="visually-hidden m-0">Loading...</span>
                  </div>
                  <span v-if="errorMessage != '...'">{{ errorMessage }}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../../stores/useAuthStore.js";
import axios from "axios";
import { BASE_URL } from "../../helpers/baseUrls";
export default {
  data() {
    return {
      user: {
        email: "test@example.com",
        password: 123,
      },
      store: useAuthStore(),
      errorMessage: null,
    };
  },
  methods: {
    async userAuth() {
        this.errorMessage = "...";
        const url = `${BASE_URL}/users/login`
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        try {          
          const response = await axios.post(url, this.user, headers);
          this.errorMessage = "Sikeres bejelentkezés!";
          setTimeout(() => {
            this.store.id = response.data.data.id;
            this.store.setId(response.data.data.id);
            this.store.setUser(response.data.data.name);
            this.store.setToken(response.data.data.token);
            this.$router.push('/');
          }, 1000);
        } catch (error) {
          this.errorMessage = "Sikertelen bejelentkezés!";
          this.store.clearStoredData();
        }
    },
  },
};
</script>

<style>
</style>