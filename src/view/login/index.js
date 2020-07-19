import React, { Component } from 'react';
import './login.scss';
import { Segment, Grid, Form, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebase/firebase';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).then((resposta) => {
      console.log("LOGIN REALIZADO COM SUCESSO")
    }).catch(error => {
      // setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
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

    const { email, password } = this.state

    return (
      <div style={{ width: "100%", display: "grid", height: "100vh", placeContent: 'center' }}>
        <Segment placeholder stacked style={{ minWidth: '600px' }}>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
              <Form>
                <Form.Input
                  name="userEmail"
                  value={email}
                  icon='user'
                  iconPosition='left'
                  label='Username'
                  placeholder='Username'
                  onChange={(event) => this.onChangeHandler(event)}
                />
                <Form.Input
                  name="userPassword"
                  value={password}
                  icon='lock'
                  iconPosition='left'
                  label='Password'
                  type='password'
                  placeholder='Digite sua senha'
                  onChange={(event) => this.onChangeHandler(event)}
                />

                <Button content='Login' primary onClick={(event) => { this.signInWithEmailAndPasswordHandler(event, email, password) }} />
              </Form>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
              <Button content='Sign up' icon='signup' size='big' />
            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
          <Link to="/janela">Ir para a página sobre \o/</Link>
        </Segment>
      </div>
    );
  }
}

export default Login;
