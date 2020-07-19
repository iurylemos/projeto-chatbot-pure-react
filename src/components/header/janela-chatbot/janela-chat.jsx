import React, { Component } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import './janela-chat.scss';
import ChatBotService from '../../../services/api/chatbot.services';

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

  sendMessage = () => {
    console.log('this.sendMessage')
    this.setState({ loading: true })

    const { input, messages } = this.state

    this.chatBotService.conversarToChatBot(1, input).then((resp) => {
      messages.push({ ...resp.data[0] })
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
        <Segment attached style={{ height: '400px', overflowY: 'scroll' }}>
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