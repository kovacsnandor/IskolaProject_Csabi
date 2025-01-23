import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: Number(localStorage.getItem('id')) || null,
    user: localStorage.getItem('user') || null,
    token: localStorage.getItem('currentToken') || null,
  }),
  getters: {},
  actions: {
    setId(id) {
      localStorage.setItem('id', id);
      this.id = id;
    },
    setUser(user) {
      localStorage.setItem('user', user);
      this.user = user;
    },
    setToken(token) {
      localStorage.setItem('currentToken', token);
      this.token = token;
    },
    clearStoredData() {
      localStorage.removeItem('id');
      localStorage.removeItem('user');
      localStorage.removeItem('currentToken');
      this.id = null;
      this.token = null;
      this.user = null;
    }
  }
});
