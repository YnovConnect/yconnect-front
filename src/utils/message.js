import api from './api'
async function addMessage(datas) {
  try {
    const response = await api.post('/rooms/' + datas.roomId + '/messages', {
      content: datas.content,
      user: datas.user
    })
  } catch (error) {
    console.error(error)
  }
}

async function getMessages(roomId) {
  try {
    const response = await api.get('/rooms/' + roomId.roomId + '/messages')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export { addMessage, getMessages }
