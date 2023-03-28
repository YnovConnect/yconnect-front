<template>
  <v-form class="o-login">
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="fields.email" label="Email" variant="solo" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="fields.password"
          label="Mot de passe"
          variant="solo"
          type="password"
        />
      </v-col>
      <v-col cols="12">
        <v-btn block color="white" @click="handleSubmit" x-large> Valider </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      fields: {
        email: '',
        password: ''
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
    handleSubmit() {
      if (!this.loading) {
        this.$emit('submit', this.fields)
      }
    }
  }
}
</script>
