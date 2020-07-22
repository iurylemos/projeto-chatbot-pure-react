import React, { Component } from 'react';
import './login.scss';
import { Segment, Grid, Form, Divider, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebase/firebase';
import ResetSenha from '../reset-senha';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    }
  }

  signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).then((resposta) => {
      console.log("LOGIN REALIZADO COM SUCESSO")
    }).catch(error => {
      this.setState({ error: "Usuário ou senha incorretos" })
    });
  };

  onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      this.setState({ email: value })
    }
    else if (name === 'userPassword') {
      this.setState({ password: value })
    }
  };

  render = () => {

    const { email, password, error } = this.state

    return (
      <div style={{ width: "100%", display: "grid", height: "100vh", placeContent: 'center', backgroundColor: '#49769c' }}>
        <Segment placeholder stacked style={{ minWidth: '600px' }}>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
              <Form>
                <Form.Input
                  name="userEmail"
                  value={email}
                  icon='mail'
                  iconPosition='left'
                  label='Email'
                  placeholder='Email'
                  onChange={(event) => this.onChangeHandler(event)}
                  style={{ color: '#49769c' }}
                />
                <Form.Input
                  name="userPassword"
                  value={password}
                  icon='lock'
                  iconPosition='left'
                  label='Senha'
                  type='password'
                  placeholder='Digite sua senha'
                  onChange={(event) => this.onChangeHandler(event)}
                  style={{ color: '#49769c' }}
                />

                <Button content='Login' color='instagram' onClick={(event) => { this.signInWithEmailAndPasswordHandler(event, email, password) }} />
              </Form>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
              <Link to='/cadastro'>
                <Button content='Cadastrar' icon='signup' size='big' />
              </Link>

            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
          <Divider />
          <ResetSenha />
          {error !== null && <Message negative>
            <Message.Header>Algo de errado acontenceu</Message.Header>
            <p>{error}</p>
          </Message>}
        </Segment>
      </div>
    );
  }
}

export default Login;
