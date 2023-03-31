<template>
  <div style="margin: 0; padding: 0;">
    <div class="frise"></div>
    <v-row class="d-flex justify-center align-center mt-8 ">
      <v-col cols="12" md="6" class="containerForm">
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
  </div>
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
.containerForm {
  padding: 40px 50px 10px 50px;
  position: relative;
  z-index: 2;
  background-color: white !important;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
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
  margin: 0;
  z-index: 1;
  padding: 0;
  background-image: url('../assets/svg/fresque.svg');
  background-size: 2500px 375px;
}

</style>
