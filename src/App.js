import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Login from './view/login';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { UserContext } from './config/user-provider';
import Home from './view/home';
import Header from './components/header'
import Cadastro from './view/cadastro';
import Diagram from './view/diagram';

class App extends Component {

  static contextType = UserContext

  render = () => {

    const user = this.context

    return (
      <BrowserRouter>
        <Switch>
          {
            !user ?
              <>
                <Route path="/" exact={true} component={Login} />
                <Route path="*" render={() => <Redirect to='/' />} />
              </>
              :
              <>
                <Header />
                <Route path="/" exact={true} component={Home} />
                <Route path="/diagrama" exact={true} component={Diagram} />
                <Route path="/cadastro" exact={true} component={Cadastro} />
                <Route path="*" render={() => <Redirect to='/' />} />
              </>
          }
        </Switch>
      </ BrowserRouter>
    );
  }
}

export default App;
