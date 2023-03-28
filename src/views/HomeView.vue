<template>
  <div>
    <vue-advanced-chat
      height="calc(100vh - 20px)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
    />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import io from 'socket.io-client'
import Cookie from 'js-cookie'

register()

export default {
  data() {
    return {
      currentUserId: '1234',
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

  mounted() {
    console.log('mounted')

    const token = Cookie.get('yconnect_access_token')
    this.socket = io('ws://localhost:3001', {
      auth: { token }
    })
    this.socket.on('connection', () => {
      console.log('Connected to server')
    })
    this.socket.emit('join', '1', (error) => {
      if (error) {
        alert(error)
      }
    })

    this.socket.on('message', (message) => {
      console.log('message', message)
      this.messages = [...this.messages, message]
    })
  },

  methods: {
    fetchMessages({ options = {} }) {
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true)
        } else {
          this.messages = [...this.addMessages(), ...this.messages]
          this.messagesLoaded = true
        }
      })
    },

    addMessages(reset) {
      const messages = []

      for (let i = 0; i < 30; i++) {
        messages.push({
          _id: reset ? i : this.messages.length + i,
          content: `${reset ? '' : 'paginated'} message ${i + 1}`,
          senderId: '4321',
          username: 'John Doe',
          date: '13 November',
          timestamp: '10:20'
        })
      }

      return messages
    },

    sendMessage(message) {
      console.log('sendMessage')
      // Envoyer le message au serveur via socket.io
      this.socket.emit('message', {
        roomId: '6422bed20078771bcf1d0270', // ID de la room à laquelle le message doit être envoyé
        message: {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString()
        }
      })

      // Ajouter le message à la liste des messages
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString()
        }
      ]
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: 'Quicksand', sans-serif;
}
</style>
