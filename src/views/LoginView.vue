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
          <LoginForm @submit="submit" />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-right">
          <!-- <ForgottenPasswordLink /> -->
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// import ForgottenPasswordLink from '~/components/molecules/auth/ForgottenPasswordLink'
import LoginForm from '@/components/organisms/auth/LoginForm.vue'

export default {
  name: 'PageLogin',

  components: {
    // ForgottenPasswordLink,
    LoginForm
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  }

  // auth: 'guest'
  // layout: 'one_column_centered_without_navbar',
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
