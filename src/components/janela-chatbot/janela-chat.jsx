import React, { Component } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import './janela-chat.scss';
import ChatBotService from '../../services/api/chatbot.services';

class JanelaChat extends Component {

  chatBotService = new ChatBotService()

  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages: [],
      loading: false
    }
  }

  componentDidMount = () => {

  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    const { messageList } = this.refs;
    messageList.scrollTop = messageList.scrollHeight;
    messageList.scrollIntoView({ behavior: "smooth" });
  }

  sendMessage = () => {
    console.log('this.sendMessage')
    this.setState({ loading: true })

    const { input, messages } = this.state

    this.chatBotService.conversarToChatBot(1, input).then((resp) => {

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

  render = () => {

    const { input, messages, loading } = this.state

    return (
      <div>
        <Header as='h3' attached='top'>
          <span className="dot"></span>&nbsp;Chatbot está Online
        </Header>
        <Segment attached>
          <div style={{ height: '370px', overflowY: 'scroll' }} ref="messageList">
            <div onClick={() => this.sendMessage()} className="talk-bubble tri-right left-top" style={{ width: "90%", backgroundColor: "#00aabb" }}>
              <div className="talktext">
                <p>Olá! Em que posso ajudar?</p>
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
            onChange={(event) => this.setState({ input: event.target.value })}
          />
        </div>
      </div>
    )
  }
}

export default JanelaChat