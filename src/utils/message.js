import api from './api'
async function addMessage(datas) {
  try {
    await api.post('/rooms/' + datas.roomId + '/messages', {
      content: datas.content,
      user: datas.user,
      files: datas.files
    })
  } catch (error) {
    console.error(error)
  }
}

/*
 * Get all messages of a room
 */
async function getMessages(roomId) {
  try {
    const response = await api.get('/rooms/' + roomId.roomId + '/messages')
    return response.data
  } catch (error) {
    console.error(error)
  }
}
/*
 * Delete a message
 */
async function deleteMessage(messageId, roomId) {
  try {
    await api.delete('/rooms/' + roomId + '/messages/' + messageId)
  } catch (error) {
    console.error(error)
  }
}

/*
 * Update a message
 */
async function updateMessage(messageId, roomId, message) {
  try {
    await api.put('/rooms/' + roomId + '/messages/' + messageId, {
      content: message.content
    })
  } catch (error) {
    console.error(error)
  }
}

export { addMessage, getMessages, deleteMessage, updateMessage }
