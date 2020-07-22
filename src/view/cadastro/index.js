import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Message, Icon } from 'semantic-ui-react';
import { generateUserDocument } from '../../config/user-document';
import { auth } from '../../services/firebase/firebase'

class Cadastro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      displayName: '',
      error: null
    }
  }

  createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    const { displayName } = this.state
    event.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, { displayName });
    }
    catch (error) {
      this.setState({ error: "Error Signing up with email and password" })
    }

    this.setState({ email: '', password: '', displayName: '' })
  };

  onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      this.setState({ email: value })
    } else if (name === 'userPassword') {
      this.setState({ password: value })
    } else if (name === "displayName") {
      this.setState({ displayName: value })
    }
  };

  render = () => {

    const { email, password, displayName, error } = this.state

    return (
      <Container text style={{ padding: '70px' }}>
        <Message
          color='teal'
          attached
          header='Página de Cadastro'
          content='Insira os dados para o seu primeiro acesso!'
        />
        <Form className='attached fluid segment'>
          <Form.Field>
            <label>Email</label>
            <input name="userEmail" type='email' value={email} placeholder='Email' onChange={(event) => this.onChangeHandler(event)} />
          </Form.Field>
          <Form.Field>
            <label>Senha</label>
            <input type="password" name="userPassword" value={password} placeholder='Senha' onChange={(event) => this.onChangeHandler(event)} />
          </Form.Field>
          <Form.Field>
            <label>Display Name:</label>
            <input name="displayName" value={displayName} placeholder='Name' onChange={(event) => this.onChangeHandler(event)} />
          </Form.Field>
          <Button type='button' color='instagram' onClick={(event) => { this.createUserWithEmailAndPasswordHandler(event, email, password) }}>Submit</Button>
        </Form>
        {error !== null && <Message negative>
          <Message.Header>Algo de errado acontenceu</Message.Header>
          <p>{error}</p>
        </Message>}

        <Message attached='bottom' warning>
          <Icon name='help' />
            Já tem cadastro? faça o&nbsp;<Link to="/" className="text-blue-500 hover:text-blue-600">
            Login aqui
        </Link>&nbsp;.
        </Message>
      </Container>
    )
  }
}

export default Cadastro