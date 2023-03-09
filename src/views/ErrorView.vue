<template>
  <v-row class="l-error" justify="center">
    <v-col cols="12">
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6" offset="3">
          <div class="text-center">
            <img src="@/assets/svg/error-404.svg" />
          </div>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="12" class="text-h1"> Erreur </v-col>
        <v-col cols="12" class="text-subtitle-1"> Vous vous êtes perdu ? </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-center">
      <t-btn
        x-large
        color="teampulse"
        :to="{
          name: 'index'
        }"
      >
      </t-btn>
    </v-col>
  </v-row>
</template>


<style scoped>
h1 {
  font-size: 20px;
}
</style>
