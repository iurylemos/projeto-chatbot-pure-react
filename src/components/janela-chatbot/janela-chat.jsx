import React, { Component } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import './janela-chat.scss';
import ChatBotService from '../../services/api/chatbot.services';
import { UserContext } from '../../config/user-provider';

class JanelaChat extends Component {

  static contextType = UserContext
  chatBotService = new ChatBotService()

  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages: [],
      loading: false,
      message_init: '',
      user: {
        email: '',
        uid: '',
      }
    }
  }

  componentDidMount = () => {
    this.addListeners()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  addListeners = () => {

    const user = this.context
    const { email, uid } = user;
    this.setState({ user: { email: email, uid: uid } })
    let now = new Date();
    let hrs = now.getHours();
    let msg = "";

    if (hrs >= 0) msg = "Boa noite"; // REALLY early
    if (hrs > 6) msg = "Bom dia";      // After 6am
    if (hrs > 12) msg = "Boa tarde";    // After 12pm
    if (hrs > 18) msg = "Boa noite";      // After 5pm
    if (hrs > 22) msg = "Boa noite";        // After 10pm
    this.setState({ message_init: `Olá! ${msg}. Em que posso ajudar?` })
  }

  scrollToBottom = () => {
    const { messageList } = this.refs;
    messageList.scrollTop = messageList.scrollHeight;
    messageList.scrollIntoView({ behavior: "smooth" });
  }

  sendMessage = () => {
    console.log('this.sendMessage')
    this.setState({ loading: true })

    const { uid } = this.state.user
    const { input, messages } = this.state

    this.chatBotService.conversarToChatBot(uid, input).then((resp) => {

      if (messages.length) {
        if ({ ...resp.data[0] }.code_relation === messages[messages.length - 1].code_current) {
          console.log('ENTROU AQUI', messages[messages.length - 1])
          messages.push({ ...resp.data[0] })
        } else if ({ ...resp.data[0] }.code_relation > 0) {
          const resposta = {
            "input": { ...resp.data[0] }.input,
            "output": "Desculpa, mas não sei te responder",
            "code_current": ""
          }
          messages.push(resposta)
        } else {
          messages.push({ ...resp.data[0] })
        }
      } else {
        if ({ ...resp.data[0] }.code_relation > 0) {
          const resposta = {
            "input": { ...resp.data[0] }.input,
            "output": "Desculpa, mas não sei te responder",
            "code_current": ""
          }
          messages.push(resposta)
        } else {
          messages.push({ ...resp.data[0] })
        }
      }

      this.setState({ messages: messages, input: '', loading: false })
      console.log('MESSAGES', messages)
    })
  }

  _handleKeyDown = (e) => {
    const { input } = this.state
    if (e.key === 'Enter') {
      if (input !== '') {
        this.sendMessage()
      }
    }
  }

  render = () => {

    const { input, messages, loading, message_init } = this.state

    return (
      <div>
        <Header as='h3' attached='top'>
          <span className="dot"></span>&nbsp;Chatbot está Online
        </Header>
        <Segment attached>
          <div style={{ height: '370px', overflowY: 'scroll' }} ref="messageList">
            <div onClick={() => this.sendMessage()} className="talk-bubble tri-right left-top" style={{ width: "90%", backgroundColor: "#00aabb" }}>
              <div className="talktext">
                <p>{message_init}</p>
              </div>
            </div>

            {
              messages.length > 0 && messages.map((mensagem, i) => (
                <div key={Math.random() + i.toString()}>
                  <div className="talk-bubble tri-right right-top" style={{ width: '90%', backgroundColor: '#8000ff' }}>
                    <div className="talktext">
                      <p>{mensagem.input}</p>
                    </div>
                  </div>
                  <div className="talk-bubble tri-right left-top" style={{ width: "90%", backgroundColor: "#00aabb" }}>
                    <div className="talktext">
                      <p>{mensagem.output}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </Segment>
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <Input
            loading={loading}
            placeholder="Digite a sua mensagem"
            action={{
              color: 'teal',
              labelPosition: 'right',
              icon: 'copy',
              content: 'Enviar',
              loading: loading,
              onClick: () => this.sendMessage()
            }}
            value={input}
            onKeyDown={this._handleKeyDown}
            onChange={(event) => this.setState({ input: event.target.value })}
          />
        </div>
      </div>
    )
  }
}

export default JanelaChat