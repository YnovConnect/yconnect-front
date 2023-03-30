<template>
  <v-row class="d-flex justify-center align-center mt-8">
    <v-col cols="12" md="6" class="containerForm">
      <div class="frise"></div>
      <v-row>
        <v-row class="d-flex flex-column align-items-center">
          <h1 class="text-h3 white--text text-left pb-10">Inscription</h1>
        </v-row>
      </v-row>

      <v-row class="contentForm">
        <v-col>
          <AccountCreateForm @submit="handleSubmit" />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-right">
          <!-- Redirect on login page -->
          <v-btn variant="text" color="black" @click="$router.push({ name: 'login' })">
            Déjà un compte ? Connectez-vous
          </v-btn>
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
      alert('here')
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
.containerForm {
  padding: 80px;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.frise {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  background: content-box;
  width: 100%;
  overflow: hidden;
  opacity: 0.2;
  z-index: -1;
  background-image: url('../assets/svg/fresque.svg');
  background-size: 2500px 375px;
}

.logo {
  margin: 0 auto;
}

.contentTitleForm {
  margin-left: 0;
  color: white;
}
</style>
