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
      @room-info="console.log('bite de chevre')"
    />
  </div>
</template>

<script>
import CreateRoomDialog from '../components/organisms/messaging/CreateRoomDialog.vue'

import { register } from 'vue-advanced-chat'
import io from 'socket.io-client'
import Cookie from 'js-cookie'
import config from '../config/index'
import { useMessageStore } from '@/stores/message.js'
import { useAuthStore } from '../stores/auth'
import { useRoomStore } from '../stores/room'
import config from '../config/index'
import { addMessage, getMessages } from '../utils/message'

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
    this.socket.emit('join', '6422bed20078771bcf1d0270', (error) => {
      if (error) {
        alert(error)
      }
    })
    this.socket.on('message', (message) => {
      console.log('messagecsocket', message)
      console.log('messages', this.messages)
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
  },

  methods: {
    fetchMessages(event) {
      setTimeout(async () => {
        this.messages = await this.addMessages(event)
        this.messagesLoaded = true
      })
    },

    async addMessages(event) {
      const messageStore = useMessageStore()
      const roomStore = useRoomStore()

      roomStore.currentRoomId = event.room.roomId
      try {
        const messages = await messageStore.getMessages({
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

      // Envoyer le message au serveur via socket.io

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
