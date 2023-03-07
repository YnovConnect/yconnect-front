<template>
  <v-form v-slot="{ onClickStop }" class="o-login" @submit="handleSubmit">
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="form.fields.email" label="Email" variant="solo" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="form.fields.password"
          label="Mot de passe"
          variant="solo"
          type="password"
        />
      </v-col>
      <v-col cols="12">
        <v-btn block color="#23b2a4" type="submit" x-large @click.stop="onClickStop">
          Valider
        </v-btn>
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
