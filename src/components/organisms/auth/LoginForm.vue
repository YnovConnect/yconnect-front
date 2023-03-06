<template>
  <v-form v-slot="{ onClickStop }" class="o-login" @submit="handleSubmit">
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="form.fields.email" label="Email" color-label="white" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="form.fields.password"
          label="Mot de passe"
          type="password"
          color-label="white"
        />
      </v-col>
      <v-col cols="12" class="p-0">
        <v-checkbox
          v-model="form.fields.remember"
          label="input.login.remember"
          color-label="white"
          color="white"
        />
      </v-col>
      <v-col cols="12">
        <v-btn block color="ynov" type="submit" x-large @click.stop="onClickStop"> Valider </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fields: {
          email: '',
          password: ''
        }
      }
    }
  },

  computed: {
    /**
     * Get the list of rules to apply to the form inputs.
     * @returns {Object} a list of rules for each input.
     */
    // rules() {
    // const { required } = this.$validators()
    // return {
    //   email: [required()],
    //   password: [required()]
    // }
    // }
  },

  methods: {
    /**
     * Try to authenticate user.
     */
    async handleSubmit() {
      try {
        await this.$auth.login({ data: this.form.fields })
      } catch (error) {
        if ([401, 403, 500].includes(error.response?.status)) {
          // status 500 is an expected use case!
          this.$notify({
            message: this.$t('error.auth.invalid_credentials'),
            type: 'error'
          })
        } else {
          this.$notify({ error })
        }
      }
    }
  }
}
</script>
