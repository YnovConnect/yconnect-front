<template>
  <v-row class="containerLogin">
    <v-col></v-col>
    <v-col cols="6" class="containerForm">
      <v-row>
        <v-row class="contentTitleForm mt-8">
          <v-col class="text-h1 white--text text-left pb-0"> Se connecter </v-col>
          <v-col cols="12" class="text-left pt-0 pb-10">
            Entrez vos identifiants pour vous connecter à votre compte.
          </v-col>
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
          <v-btn text color="white" @click="$router.push({ name: 'inscription' })">
            Pas encore de compte ? Inscrivez-vous
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// import ForgottenPasswordLink from '~/components/molecules/auth/ForgottenPasswordLink'
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
