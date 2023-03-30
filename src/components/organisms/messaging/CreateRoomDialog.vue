<template>
  <v-dialog
    v-model="open"
    class="o-createRoomDialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-form>
      <!-- XXX: padding is to fix v-card-actions scrollbar with dialog -->
      <v-card class="o-createRoomDialog__card pa-1" style="height: 100vh" color="background">
        <v-card-title class="flex-column align-stretch">
          <v-row justify="center">
            <v-col class="pb-0">
              <div class="d-flex justify-end">
                <v-btn icon @click="open = false"> X </v-btn>
              </div>
            </v-col>

            <v-col cols="12" class="pt-0 text-center text-h2"> Créer un groupe de message </v-col>
          </v-row>
        </v-card-title>

        <v-card-text class="o-createRoomDialog__body">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="fields.name" label="Nom du groupe" variant="solo" />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="fields.members"
                clearable
                chips
                label="Select"
                :items="listMembers"
                item-title="lastname"
                item-value="_id"
                multiple
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row justify="center">
            <v-col cols="10" md="8">
              <v-btn
                block
                style="background-color: rgb(35, 178, 164); color: white"
                :loading="isLoading"
                x-large
                @click="createChatRoom"
              >
                Créer
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useRoomStore } from '@/stores/room'

export default {
  emits: ['created', 'update:isCreatingChatRoom'],

  mounted() {
    return Promise.all([this.fetchPlayers()])
  },

  props: {
    isCreatingChatRoom: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      fields: {
        name: null,
        members: []
      },
      listMembers: [],
      filters: {},
      form: { name: null },
      isLoading: false,
      selectedMembers: [],
      step: null
    }
  },

  computed: {
    open: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    rules() {
      const { required, maxLength } = this.$validators()
      return {
        name: [required(), maxLength(40)]
      }
    },

    /**
     * Get the authenticated user.
     * @returns {Object}
     */
    userId() {
      const authStore = useAuthStore()
      return authStore.user._id
    }
  },

  watch: {},

  methods: {
    async fetchPlayers() {
      const userStore = useUserStore()
      try {
        this.isLoading = true
        const data = await userStore.listAllUser()

        this.listMembers = data
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Create a chat room.
     */
    async createChatRoom() {
      const roomStore = useRoomStore()
      try {
        this.isLoading = true
        await roomStore.createRoom(this.fields.name, this.userId, this.fields.members)
        this.open = false
        this.$emit('created')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.o-createRoomDialog {
  &__body {
    overflow-y: auto;
  }
  &__card {
    height: 100vh;
  }
}
</style>
