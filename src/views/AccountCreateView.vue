<template>
  <v-row class="containerLogin">
    <v-col></v-col>
    <v-col cols="6" class="containerForm">
      <v-row>
        <v-row class="contentTitleForm mt-8">
          <v-col class="text-h1 white--text text-left pb-10">Inscription </v-col>
        </v-row>
      </v-row>

      <v-row class="contentForm">
        <v-col>
          <AccountCreateForm @submit="handleSubmit" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import AccountCreateForm from '@/components/organisms/auth/AccountCreateForm.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: { AccountCreateForm },

  data() {
    return {
      isLoading: false
    }
  },
  computed: {},

  methods: {
    /**
     * Create an user account.
     * @param {Object} formValues the user form values.
     */
    async handleSubmit(formValues) {
      const authStore = useAuthStore()
      try {
        this.isLoading = true
        await authStore.register({
          email: formValues.email,
          password: formValues.password,
          first_name: formValues.first_name,
          last_name: formValues.last_name
        })

        this.$router.push({ name: 'login' })
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style>
.containerLogin {
  background-image: url('../static/img/background_login.png');
  background-size: cover;
  background-position: bottom;
}

.containerForm {
  padding: 80px;
  background-color: rgba(41, 41, 41, 0.3);
  backdrop-filter: blur(30px);
  height: 100vh;
}
.logo {
  margin: 0 auto;
}

.contentTitleForm {
  margin-left: 0;
  color: white;
}
</style>
