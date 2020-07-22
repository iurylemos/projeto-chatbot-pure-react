import React, { Component } from 'react';
import { auth } from '../../services/firebase/firebase'
import { Modal, Button, Image, Form, Message } from 'semantic-ui-react';

class ResetSenha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailHasBeenSent: false,
      error: null
    }
  }

  onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      this.setState({ email: value })
    }
  };

  sendResetEmail = event => {

    const { email } = this.state

    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ emailHasBeenSent: true })
        setTimeout(() => { this.setState({ emailHasBeenSent: false }) }, 3000);
      })
      .catch(() => {
        this.setState({ error: "Usuário ou senha incorretos" })
      });
  };

  render = () => {

    const { email, error, emailHasBeenSent } = this.state

    return (
      <Modal trigger={<Button color='youtube'>Resetar Senha</Button>} closeIcon>
        <Modal.Header>Reset a Senha</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
          <Modal.Description>
            {emailHasBeenSent && (
              <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
                An email has been sent to you!
              </div>
            )}
            {error !== null && (
              <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
                {error}
              </div>
            )}
            <Form warning>
              <Form.Field>
                <label>Email</label>
                <input type='email' name="userEmail" value={email} onChange={this.onChangeHandler} placeholder="Digite seu e-mail" />
                <Message
                  warning
                  header='Reset de Senha'
                  list={[
                    'Verifique se o e-mail digitado está correto.',
                  ]}
                />
                <Button type='button' onClick={this.sendResetEmail} color='instagram'>Enviar</Button>
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default ResetSenha