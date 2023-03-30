<template>
  <div>
    <CreateRoomDialog
      v-model="createChatRoomOpen"
      v-model:is-creating-chat-room="isCreatingChatRoom"
      @input="createChatRoomOpen = $event"
      @created="fetchRooms()"
    />
    <vue-advanced-chat
      height="100vh"
      :current-user-id="currentUserId"
      :rooms="getRooms"
      :rooms-loaded="roomsLoaded"
      :load-first-room="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      :show-reaction-emojis="false"
      :accepted-files="['*']"
      :show-footer="true"
      @add-room="handleAddRoomClick"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
      @delete-message="deleteMessage($event.detail)"
      @edit-message="editMessage($event.detail)"
      @open-file="openFile($event.detail[0])"


    />
  </div>
</template>

<script>
import CreateRoomDialog from '../components/organisms/messaging/CreateRoomDialog.vue'

import {register} from 'vue-advanced-chat'
import io from 'socket.io-client'
import Cookie from 'js-cookie'
import {useAuthStore} from '../stores/auth'
import config from '../config/index'
import {addMessage, getMessages, deleteMessage, updateMessage } from '../utils/message'
import api from '../utils/api'
import {useRoomStore} from '../stores/room'

register()
export default {
  components: {
    CreateRoomDialog
  },
  data() {
    return {
      createChatRoomOpen: false,
      isCreatingChatRoom: false,
      roomsLoaded: false,
      loadFirstRoom: false,
      rooms: [],
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
    getRooms() {
      if(this.rooms == null || this.rooms === ''  || this.rooms.length === 0) {
        return [];
      }
      const avatar = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
      return this.rooms.map((room) => ({
        roomId: room._id,
        roomName: room.name,
        avatar: avatar,
        users: room.users
      }));
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
    editMessage(event) {
      console.log(event)
      let newMessages = {
        content: event[0].newContent,
      }
      this.messages = this.messages.map((msg) => {
        if(msg._id === event[0].messageId) {
          msg.content = event[0].newContent
        }
        return msg
      })
      updateMessage(event[0].messageId, event[0].roomId, newMessages)
    },

    async fetchMessages(event) {
      await this.addMessages(event)
    },
    async deleteMessage (event) {
      for(let j =0; j< event.length; j++) {
        let messageId = event[j].message._id
        await deleteMessage(messageId, event[j].roomId)
        this.messages = this.messages.filter((msg) => msg._id !== messageId)
      }
    },
    openFile(event) {
      if(event.file != null && event.file.file != null && event.file.file.url != null) {
        window.open(event.file.file.url, '_blank');
      }
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
          for(let i = 0; i < message.files.length; i++) {
            message.files[i].url = config.apiUrl + message.files[i].url;
          }

          let newMessage = {
            _id: message._id,
            content: message.content,
            user: message.user,
            createdAt: message.createdAt,
            senderId: message.user,
            date: new Date(message.createdAt).toDateString(),
            timestamp: new Date(message.createdAt).toString().substring(16, 21),
            files: message.files
          }
          this.messages = [...this.messages, newMessage]
        }
      })
      try {
        roomStore.currentRoomId = event.room.roomId
        this.messagesLoaded = false;

        const messages = await getMessages({
          roomId: roomStore.currentRoomId
        })

        for(let i = 0; i < messages.length; i++) {
          for(let j = 0; j < messages[i].files.length; j++) {
            messages[i].files[j].url = config.apiUrl + messages[i].files[j].url;
          }
        }

        // Ajouter les propriétés manquantes
        this.messages = messages.map((msg) => ({
          ...msg,
          _id: msg._id || Math.random().toString(36).substr(2, 9), // ajouter un ID aléatoire si l'ID manque
          senderId: msg.user || 'Unknown', // ajouter un expéditeur inconnu si l'ID manque
          date: new Date(msg.createdAt).toDateString(),
          timestamp: new Date(msg.createdAt).toString().substring(16, 21)
        }))
        this.messagesLoaded = true;
      } catch (error) {
        console.log(error)
      }
    },

    async sendMessage(message) {
      const roomStore = useRoomStore()
      const authStore = useAuthStore()

      let docFileId = [];
      if(message.files != null && message.files.length > 0) {
        for(let i = 0; i < message.files.length; i++) {
          const file = message.files[i]
          const formData = new FormData()
          const myFile = new File([file.blob], file.name, { type: file.type });
          formData.append('file', myFile);
          formData.append("audio", file.audio != null ? file.audio : false);
          formData.append("duration", file.duration != null ? file.duration : 0);
            const response = await api.post('/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          docFileId.push(response.data.file._id);
        }
      }
      try {
        // Ajouter les propriétés manquantes au message
        message._id = message.id || Math.random().toString(36).substr(2, 9)
        message.senderId = message.user || authStore.user._id

        await addMessage({
          content: message.content,
          user: authStore.user._id,
          roomId: roomStore.currentRoomId,
          files: docFileId
        })
      } catch (error) {
        console.log(error)
      }

    },

    async fetchRooms() {
      this.roomsLoaded = false;
      const roomStore = useRoomStore()
      this.rooms = await roomStore.fetchRooms();
      this.roomsLoaded = true;
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
     */
    isCreatingChatRoom(val) {
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
