<template>
  <div>
    <CreateRoomDialog
      v-model="createChatRoomOpen"
      :is-creating-chat-room.sync="isCreatingChatRoom"
      @input="createChatRoomOpen = $event"
    />
    <vue-advanced-chat
      height="100vh"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :load-first-room="loadFirstRoom"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      :show-reaction-emojis="false"
      @add-room="handleAddRoomClick"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
    />
  </div>
</template>

<script>
import CreateRoomDialog from '../components/organisms/messaging/CreateRoomDialog.vue'

import { register } from 'vue-advanced-chat'
import io from 'socket.io-client'
import Cookie from 'js-cookie'
import config from '../config/index'
import { useAuthStore } from '../stores/auth'
import { addMessage, getMessages } from '../utils/message'
import { useRoomStore } from '../stores/room'

register()
export default {
  components: {
    CreateRoomDialog
  },
  data() {
    return {
      createChatRoomOpen: false,
      isCreatingChatRoom: false,

      loadFirstRoom: true,
      rooms: [
        {
          roomId: '6422bed20078771bcf1d0270',
          roomName: 'Room 1',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
          users: [
            { _id: '1234', username: 'John Doe' },
            { _id: '4321', username: 'John Snow' }
          ]
        }
      ],
      messages: [],
      messagesLoaded: false,
      socket: null
    }
  },

  computed: {
    currentUserId() {
      const authStore = useAuthStore()
      return authStore.user._id
    },

    selectedRoomId() {
      return '1'
    }
  },

  mounted() {
    const cookieValue = Cookie.get('yconnect_access_token')
    const token = JSON.parse(cookieValue)?.token

    Promise.all([this.fetchRooms()])

    this.socket = io(config.apiWebsocket, {
      auth: { token }
    })
    this.socket.on('connection', () => {
      console.log('Connected to server')
    })
  },

  methods: {
    fetchMessages(event) {
      setTimeout(async () => {
        this.messages = await this.addMessages(event)
        this.messagesLoaded = true
      })
    },

    async addMessages(event) {
      const cookieValue = Cookie.get('yconnect_access_token')
      const token = JSON.parse(cookieValue)?.token
      const roomStore = useRoomStore()

      this.socket.emit('leave', roomStore.currentRoomId, (error) => {
        if (error) {
          alert(error)
        }
      })

      // Update the room id in the store
      roomStore.currentRoomId = event.room.roomId

      this.socket = io(config.apiWebsocket, {
        auth: { token }
      })
      this.socket.emit('join', roomStore.currentRoomId, (error) => {
        if (error) {
          alert(error)
        }
      })
      this.socket.on('message', (message) => {
        if (message.senderId !== this.currentUserId) {
          message = message.message
          let newMessage = {
            _id: message._id,
            content: message.content,
            user: message.user,
            createdAt: message.createdAt,
            senderId: message.user,
            date: new Date(message.createdAt).toDateString(),
            timestamp: new Date(message.createdAt).toString().substring(16, 21)
          }
          this.messages = [...this.messages, newMessage]
        }
      })

      try {
        roomStore.currentRoomId = event.room.roomId
        const messages = await getMessages({
          roomId: roomStore.currentRoomId
        })
        // Ajouter les propriétés manquantes
        const messagesWithProps = messages.map((msg) => ({
          ...msg,
          _id: msg._id || Math.random().toString(36).substr(2, 9), // ajouter un ID aléatoire si l'ID manque
          senderId: msg.user || 'Unknown', // ajouter un expéditeur inconnu si l'ID manque
          date: new Date(msg.createdAt).toDateString(),
          timestamp: new Date(msg.createdAt).toString().substring(16, 21)
        }))

        return messagesWithProps
      } catch (error) {
        console.log(error)
      }
    },

    async sendMessage(message) {
      const roomStore = useRoomStore()
      const authStore = useAuthStore()

      try {
        // Ajouter les propriétés manquantes au message
        message._id = message.id || Math.random().toString(36).substr(2, 9)
        message.senderId = message.user || authStore.user._id

        await addMessage({
          content: message.content,
          user: authStore.user._id,
          roomId: roomStore.currentRoomId
        })
      } catch (error) {
        console.log(error)
      }

      // // Envoyer le message au serveur via socket.io
      // this.socket.emit('message', {
      //   roomId: roomStore.currentRoomId, // ID de la room à laquelle le message doit être envoyé
      //   message: {
      //     _id: message._id,
      //     content: message.content,
      //     senderId: this.currentUserId,
      //     timestamp: new Date().toString().substring(16, 21),
      //     date: new Date().toDateString()
      //   }
      // })

      // Ajouter le message à la liste des messages
    },

    async fetchRooms() {
      const roomStore = useRoomStore()

      const res = await roomStore.fetchRooms()
      this.rooms = res.map((room) => ({
        roomId: room._id,
        roomName: room.name,
        avatar: room.avatar,
        users: room.users
      }))
    },

    addNewMessage() {
      setTimeout(() => {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: 'NEW MESSAGE',
            senderId: '1234',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
      }, 2000)
    },

    /**
     ************************ Event handlers ************************
     */
    /**
     * Open new room dialog at click.
     */
    handleAddRoomClick() {
      this.createChatRoomOpen = true
    }
  },
  watch: {
    /**
     * If creating a chat room, allow loading first room.
     * @param {Boolean} val
     * @param {Boolean} prev
     */
    isCreatingChatRoom(val, prev) {
      this.loadFirstRoom = val
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: 'Quicksand', sans-serif;
}
</style>
