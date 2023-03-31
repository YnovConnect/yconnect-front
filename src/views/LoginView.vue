<template>
  <div>
    <div class="frise"></div>
    <v-row class="d-flex justify-center align-center mt-8">
      <v-col cols="12" md="6" class="containerForm">

        <v-row>
          <v-row class="d-flex flex-column align-items-center">
            <h1 class="text-h3 white--text text-left pb-0">Se connecter</h1>
            <p class="text-left pt-0 pb-10">
              Entrez vos identifiants pour vous connecter à votre compte.
            </p>
          </v-row>
        </v-row>

        <v-row class="contentForm">
          <v-col>
            <LoginForm @submit="handleSubmit" />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-right">
            <!-- Redirect on login page -->
            <v-btn variant="text" color="black" @click="$router.push({ name: 'inscription' })">
              Pas encore de compte ? Inscrivez-vous
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LoginForm from '@/components/organisms/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: {
    LoginForm
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    async handleSubmit(formValues) {
      const authStore = useAuthStore()
      try {
        this.isLoading = true
        await authStore.login({
          email: formValues.email,
          password: formValues.password
        })

        this.$router.push({ name: 'home' })
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

</style>
