import React, { Component } from 'react'
import { Container, Header, Image, List, Portal, Segment, Button, Form, Message } from 'semantic-ui-react';
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
      openNodeChild: false,
      openDialog: false,
      input: '',
      output: '',
      formChild: {
        inputChild: '',
        outputChild: ''
      },
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
    const { listaDocumentos, listaSubDocumentos } = this.state

    this.chatBotService.findDocuments(1, 1).then((res) => {
      console.log('findDocumentos', res.data)

      this.chatBotService.findChatBot(1, 1).then((res) => {
        console.log(res.data)
        res.data.forEach(element => {
          if (element.code_relation > 0) {
            listaSubDocumentos.push(element)
            this.setState({ listaSubDocumentos: listaSubDocumentos })
          } else {
            listaDocumentos.push(element)
            this.setState({ listaDocumentos: listaDocumentos })
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
    const { input, output, itemSelected } = this.state

    if (input === '' && output === '') {
      return;
    }
    this.chatBotService.updateData(null, itemSelected.code_current, 1, 1, input, output).then((resp) => {
      this.handleClose()
      this.addListeners()
    })
  }

  cadastrarPergunta = () => {
    const { input, output, itemSelected, openNodeChild } = this.state
    const { inputChild, outputChild } = this.state.formChild

    if (input === '' && output === '') {
      return;
    }

    if (openNodeChild) {
      this.chatBotService.insertData(itemSelected.code_current, 1, 1, inputChild, outputChild).then((resp) => {
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
    const { itemSelected, input, output } = this.state

    if (itemSelected.code_current !== 0) {
      this.chatBotService.deleteData(itemSelected.code_current, 1, 1, input, output).then((resp) => {
        this.handleClose()
        this.addListeners()
      })
    }
  }

  onChangeField = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState(prevState => {
      prevState.formChild[name] = value;
      return {
        formChild: prevState.formChild
      };
    });
  };

  handleClose = () => this.setState({ openDialog: false, input: '', output: '', itemSelected: null, openNodeChild: false, listaDocumentos: [], listaSubDocumentos: [], form: { inputChild: '', outputChild: '' } })
  handleOpen = (resposta) => this.setState({ itemSelected: resposta, openDialog: true, input: resposta.input, output: resposta.output })


  portalNode = () => {

    const { openDialog, itemSelected, input, output, openNodeChild } = this.state
    const { inputChild, outputChild } = this.state.formChild

    let items = [
      `Provável pergunta: ${input}`,
      `Resposta: ${output}`,
    ]

    return (
      <Portal onClose={this.handleClose} open={openDialog}>
        <Segment
          style={{
            left: '40%',
            position: 'fixed',
            top: '20%',
            zIndex: 1000,
            minWidth: '350px'
          }}
        >
          <Header>
            {itemSelected ? "Atualizar Pergunta" : "Cadastrar Pergunta"}
          </Header>
          {itemSelected ? <Button content={openNodeChild ? 'Cancelar Cadastro' : 'Cadastrar Nó Filho'}
            negative={openNodeChild}
            positive={!openNodeChild} onClick={() => this.setState({ openNodeChild: !openNodeChild })} /> : <p> Cadastrando nova pergunta </p>}
          {openNodeChild ?
            <React.Fragment>
              <Header>Cadastro de Nó Filho</Header>
              <Message>
                <Message.Header>Pergunta e Resposta - Nó Pai</Message.Header>
                <Message.List items={items} />
              </Message>
              <Form>
                <Form.Field>
                  <label>Pergunta</label>
                  <input type='text' placeholder='Pergunta' value={inputChild} name='inputChild' onChange={this.onChangeField} />
                </Form.Field>
                <Form.Field>
                  <label>Resposta</label>
                  <input type='text' placeholder='Resposta' value={outputChild} name='outputChild' onChange={this.onChangeField} />
                </Form.Field>
                <div>
                  <Button type='button' floated='right' positive onClick={() => this.cadastrarPergunta()}>Cadastrar</Button>
                  <Button type='button' floated='left' negative onClick={() => this.setState({ openNodeChild: false, form: { inputChild: '', outputChild: '' } })}>Cancelar</Button>
                </div>
              </Form>
            </React.Fragment>
            :
            <Form>
              <Form.Field>
                <label>Pergunta</label>
                <input type='text' placeholder='Pergunta' value={input} onChange={event => this.setState({ input: event.target.value })} />
              </Form.Field>
              <Form.Field>
                <label>Resposta</label>
                <input type='text' placeholder='Resposta' value={output} onChange={event => this.setState({ output: event.target.value })} />
              </Form.Field>
              <Button.Group type='button' floated='right'>
                {
                  itemSelected ?
                    <>
                      <Button type='button' positive onClick={() => this.atualizarPergunta()}>Editar</Button>
                      <Button type='button' onClick={() => this.deletarPergunta()}>Deletar</Button>
                    </>
                    :
                    <Button type='button' positive onClick={() => this.cadastrarPergunta()}>Cadastrar</Button>
                }

                <Button type='button' negative onClick={this.handleClose}>Cancelar</Button>
              </Button.Group>
            </Form>
          }
        </Segment>
      </Portal>
    )
  }

  listChild = (code_current) => {

    const { listaSubDocumentos } = this.state
    const filter = listaSubDocumentos.filter((sub) => sub.code_relation === code_current)

    if (filter.length) {
      return (
        filter.map((resp, i) => (
          <List.List key={i.toString() + Math.random()}>
            <List.Item onClick={() => this.handleOpen(resp)}>
              <List.Icon name='folder' />
              <List.Content>
                <List.Header>{resp.input}</List.Header>
                <List.Description>{resp.output}</List.Description>
              </List.Content>
            </List.Item>
          </List.List>
        ))
      )
    } else {
      return (
        <React.Fragment></React.Fragment>
      )
    }
  }

  render = () => {

    const { listaDocumentos, listaSubDocumentos, openDialog } = this.state

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
            <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
            <List>
              {
                listaDocumentos.map((resposta, i) => (
                  <List.Item as='a' key={i.toString() + Math.random()}>
                    <List.Icon name='folder' onClick={() => this.handleOpen(resposta)} />
                    <List.Content>
                      <List.Header onClick={() => this.handleOpen(resposta)}>{resposta.input}</List.Header>
                      <List.Description onClick={() => this.handleOpen(resposta)}>{resposta.output}</List.Description>
                      {this.listChild(resposta.code_current)}
                    </List.Content>
                  </List.Item>
                ))
              }
            </List>
          </Container>
          {openDialog ? this.portalNode() : null}
        </div>
      )
    )
  }
}

export default Home