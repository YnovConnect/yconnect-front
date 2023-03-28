import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: null,
    lastname: null,
    firstname: null,
    email: null,
    birthday: null,
    isDeleted: null,
  }),
  actions: {
    setId(id) {
      this.id = id;
    },
    setLastname(lastname) {
      this.lastname = lastname;
    },
    setFirstname(firstname) {
      this.firstname = firstname;
    },
    setEmail(email) {
      this.email = email;
    },
    setBirthday(birthday) {
      this.birthday = birthday;
    },
    setIsDeleted(isDeleted) {
      this.isDeleted = isDeleted;
    },
  },
  mutations: {
    reset() {
      Object.assign(this.$state, this.$resetState());
    },
  },
});