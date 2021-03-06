import React, { Component } from 'react';
import { auth } from '../../services/firebase/firebase';
import { Menu, Container, Dropdown, Image, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../config/user-provider';
import { Link } from 'react-router-dom';

class Header extends Component {
  static contextType = UserContext

  constructor(props) {
    super(props);

    this.state = {
      email: ''
    }
  }

  componentDidMount() {
    const user = this.context

    const { email } = user;

    this.setState({ email: email })
  }

  signOutUser = () => {
    auth.signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  render = () => {

    const { email } = this.state

    return (
      <div>
        <Menu fixed='top' inverted style={{ backgroundColor: '#49769c' }} stackable>
          <Container>
            <Menu.Item header>
              <Image size='mini' src='https://image.flaticon.com/icons/png/512/1698/1698535.png' style={{ marginRight: '1.5em' }} />
                Projeto ChatBot
              </Menu.Item>
            <Menu.Item name='home' as={Link} to='/'><Icon name='home' />Home</Menu.Item>

            <Dropdown item simple text='Configurações'>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/cadastro' ><Icon name='signup' />Cadastrar Cliente</Dropdown.Item>
                <Dropdown.Item as={Link} to='/diagrama'><Icon name='list ol' />Diagrama</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                  <i className='dropdown icon' />
                  <span className='text'>Submenu</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' value={email} placeholder='Search...' />
              </Menu.Item>
              <Menu.Item
                name='logout'
                as='a'
                onClick={() => this.signOutUser()}
              />
            </Menu.Menu>
          </Container>
        </Menu>
      </div>

    )
  }
}

export default Header