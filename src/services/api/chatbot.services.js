import axios from 'axios';
import { URL_API } from '../../api.global';

class ChatBotService {

  findChatBot = (code_user, activate) => {

    let objJSON = {
      "code_user": code_user,
      "activate": activate
    }

    return axios.post(`${URL_API}/chatbot/find`, objJSON)
  }

  auth = (email, password) => {
    return axios.post(`${URL_API}/login`, { email, password }, { withCredentials: true })

  }

  findDocuments = (code_user, activate) => {

    let objJSON = {
      "code_user": code_user,
      "activate": activate
    }

    return axios.post(`${URL_API}/documents/find`, objJSON);
  }

  insertData = (code_relation, code_user, activate, input, output) => {

    let objJSON = {}

    if (code_relation) {
      objJSON = {
        "code_relation": code_relation,
        "code_user": code_user,
        "activate": activate,
        "input": input,
        "output": output
      }
    } else {
      objJSON = {
        "code_user": code_user,
        "activate": activate,
        "input": input,
        "output": output
      }
    }

    return axios.post(`${URL_API}/chatbot/insert`, objJSON);
  }

  updateData = (code_relation, code_current, code_user, activate, input, output) => {

    let objJSON = {}

    if (code_relation) {
      objJSON = {
        "code_relation": code_relation,
        "code_current": code_current,
        "code_user": code_user,
        "activate": activate,
        "input": input,
        "output": output
      }
    } else {
      objJSON = {
        "code_current": code_current,
        "code_user": code_user,
        "activate": activate,
        "input": input,
        "output": output
      }
    }

    return axios.post(`${URL_API}/chatbot/update`, objJSON);
  }

  deleteData = (code_current, code_user, activate, input, output) => {
    let objJSON = {}
    objJSON = {
      "code_current": code_current,
      "code_user": code_user,
      "activate": activate,
      "input": input,
      "output": output
    }

    return axios.post(`${URL_API}/chatbot/delete`, objJSON);
  }

  conversarToChatBot = (codeUser, question) => {
    return axios.get(`${URL_API}/chatbot/question?code_user=${codeUser}&input=${question}`);
  }

}

export default ChatBotService