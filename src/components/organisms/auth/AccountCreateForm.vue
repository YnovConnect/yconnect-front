<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="fields.first_name"
          variant="solo"
          label="Prénom"
          source="player.first_name"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="fields.last_name"
          variant="solo"
          label="Nom"
          source="player.last_name"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="fields.email" variant="solo" label="Email" source="player.email" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="fields.password"
          variant="solo"
          :error="!passwordIdentical"
          :error-messages="(!passwordIdentical && 'Les mots de passe sont différents') || undefined"
          source="player.password"
          label="Mot de passe"
          type="password"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="fields.password_confirmation"
          variant="solo"
          :error="!passwordIdentical"
          :error-messages="(!passwordIdentical && 'Les mots de passe sont différents') || undefined"
          source="player.password_confirmation"
          label="Confirmation du mot de passe"
          type="password"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          block
          :loading="loading"
          x-large
          @click="handleSubmit"
          style="background-color: rgb(35, 178, 164); color: white"
        >
          Inscription
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      fields: {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        password_confirmation: null
      },
      locales: []
    }
  },

  computed: {
    /**
     * Whether if passowrds are identical or not.
     * @returns {Boolean}
     */
    passwordIdentical() {
      if (
        this.fields.password &&
        this.fields.password_confirmation &&
        this.fields.password !== this.fields.password_confirmation
      ) {
        return false
      } else {
        return true
      }
    },

    /**
     * Url for the privacy policy.
     * @returns {String}
     */
    privacyPolicyUrl() {
      return this.$config.websiteUrl.privacyPolicy
    }

    // /**
    //  * Form rules.
    //  * @returns {Object}
    //  */
    // rules() {
    //   const { boolean, email, maxLength, required, value } = this.$validators()

    //   return {
    //     first_name: [required(), maxLength(50)],
    //     last_name: [required(), maxLength(50)],
    //     email: [required(), email(), maxLength(128)],
    //     password: [required()],
    //     password_confirmation: [required()],
    //     is_accepting_conditions: [boolean(), value(true, 'validation.accept_conditions')],
    //     is_allowing_newsletter: [boolean()]
    //   }
    // }
  },

  methods: {
    handleSubmit() {
      if (!this.loading) {
        this.$emit('submit', this.fields)
      }
    }
  }
}
</script>
