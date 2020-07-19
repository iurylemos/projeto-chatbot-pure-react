import React, { Component } from 'react'
import { Container, Header, Image, List, Portal, Segment, Button, Form } from 'semantic-ui-react';
import ChatBotService from '../../services/api/chatbot.services';
import JanelaChatbot from '../janela-chatbot';
import './home.scss';
import JanelaChat from '../../components/header/janela-chatbot/janela-chat';

class Home extends Component {

  chatBotService = new ChatBotService()

  constructor(props) {
    super(props);

    this.state = {
      showPopout: false,
      itemSelected: null,
      openDialog: false,
      code_current: 0,
      code_relation: 0,
      input: '',
      output: '',
      listaRespostas: [],
      listaDocumentos: [],
      listaSubDocumentos: []
    }
  }

  componentDidMount = () => {
    this.addListeners()
    window.addEventListener('beforeunload', () => {
      this.setPopoutOpen(false);
    });
  }

  addListeners = () => {
    const { listaRespostas, listaDocumentos, listaSubDocumentos } = this.state

    let array = []

    this.chatBotService.findDocuments(1, 1).then((res) => {
      console.log('findDocumentos', res.data)
      listaDocumentos.push(res.data)
      this.setState({ listaDocumentos: listaDocumentos })

      this.chatBotService.findChatBot(1, 1).then((res) => {
        console.log(res.data)
        array = res.data

        array.forEach(element => {
          if (element.code_relation > 0) {
            listaSubDocumentos.push(element)
            this.setState({ listaSubDocumentos: listaSubDocumentos })
          } else {
            listaRespostas.push(element)
            this.setState({ listaRespostas: listaRespostas })
          }
        });
      })
    })
  }

  getPopout() {
    if (!this.state.showPopout) {
      return null;
    }

    return (
      <JanelaChatbot title='Testando ChatBot' closeWindow={() => this.setPopoutOpen(false)}>
        <JanelaChat />
      </JanelaChatbot>
    );
  }

  setPopoutOpen(open) {
    this.setState({
      showPopout: open
    });
  }

  atualizarPergunta = () => {
    const { input, output, code_relation, code_current } = this.state

    if (input === '' && output === '') {
      return;
    }

    if (code_relation !== 0) {
      this.chatBotService.updateData(code_relation, code_current, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    } else {
      this.chatBotService.updateData(null, code_current, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    }
  }

  cadastrarPergunta = () => {
    const { input, output, code_relation } = this.state

    if (input === '' && output === '') {
      return;
    }

    if (code_relation !== 0) {
      this.chatBotService.insertData(code_relation, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    } else {
      this.chatBotService.insertData(null, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    }

  }

  deletarPergunta = () => {
    const { code_current, input, output } = this.state

    if (code_current !== 0) {
      this.chatBotService.deleteData(code_current, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    }
  }

  handleClose = () => this.setState({ openDialog: false, input: '', output: '', itemSelected: null, code_current: 0 })

  handleOpen = () => {

    const { openDialog, itemSelected, input, output } = this.state

    return (
      <Portal onClose={this.handleClose} open={openDialog}>
        <Segment
          style={{
            left: '40%',
            position: 'fixed',
            top: '50%',
            zIndex: 1000,
            minWidth: '350px'
          }}
        >
          <Header>
            {itemSelected ? "Atualizar Pergunta" : "Cadastrar Pergunta"}
          </Header>
          {
            itemSelected ?
              <Button animated='fade' floated='right'>
                <Button.Content visible>Cadastrar Nó Filho</Button.Content>
                <Button.Content hidden>Criar Nó Filho</Button.Content>
              </Button>
              : <p> Cadastrando nova pergunta </p>
          }
          <Form>
            <Form.Field>
              <label>Pergunta</label>
              <input type='text' placeholder='Pergunta' value={input} onChange={event => this.setState({ input: event.target.value })} />
            </Form.Field>
            <Form.Field>
              <label>Resposta</label>
              <input type='text' placeholder='Resposta' value={output} onChange={event => this.setState({ output: event.target.value })} />
            </Form.Field>
            <Button.Group floated='right'>
              {
                itemSelected ?
                  <>
                    <Button positive onClick={() => this.atualizarPergunta()}>Editar</Button>
                    <Button>Deletar</Button>
                  </>
                  :
                  <Button positive onClick={() => this.cadastrarPergunta()}>Cadastrar</Button>
              }

              <Button negative onClick={this.handleClose}>Cancelar</Button>
            </Button.Group>
          </Form>
        </Segment>
      </Portal>
    )
  }

  render = () => {

    const { listaRespostas, openDialog } = this.state

    return (
      (
        <div>
          {this.getPopout()}
          <Container text style={{ marginTop: '7em' }}>
            <Header as='h1'>
              Projeto criado para usar o ChatBot
              <Button animated='fade' floated='right' onClick={() => this.setState({ openDialog: true })}>
                <Button.Content visible>Cadastrar nova Pergunta</Button.Content>
                <Button.Content hidden>Criar Pergunta</Button.Content>
              </Button>
            </Header>
            <p>Use o ChatBot sem gastar dinheiro!</p>
            <p>
              Invista nesse projeto, e vamos crescer.
              <Button color='green' animated='fade' floated='right' onClick={() => this.setPopoutOpen(!this.state.showPopout)}>
                <Button.Content visible>Abrir ChatBot</Button.Content>
                <Button.Content hidden>Abrir Bot</Button.Content>
              </Button>
            </p>
            {console.log('listaRespostas', listaRespostas)}
            <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
            <List>
              {
                listaRespostas.map((resposta, i) => (
                  <List.Item as='a' onClick={() => this.setState({ itemSelected: resposta, openDialog: true, input: resposta.input, output: resposta.output, code_current: resposta.code_current })} key={i.toString() + Math.random()}>
                    <List.Icon name='folder' />
                    <List.Content>
                      <List.Header>{resposta.input}</List.Header>
                      <List.Description>{resposta.output}</List.Description>
                      {/* <List.List>
                        <List.Item as='a' onClick={() => this.setState({ itemSelected: resposta, openDialog: true, input: resposta.input, output: resposta.output, code_current: resposta.code_current })}>
                          <List.Icon name='folder' />
                          <List.Content>
                            <List.Header>{resposta.input}</List.Header>
                            <List.Description>{resposta.output}</List.Description>
                          </List.Content>
                        </List.Item>
                      </List.List> */}
                    </List.Content>
                  </List.Item>
                ))
              }
            </List>
          </Container>
          {openDialog ? this.handleOpen() : null}
        </div>
      )
    )
  }
}

export default Home