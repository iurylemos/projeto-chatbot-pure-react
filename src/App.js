import React, { useContext } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Login from './view/login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { UserContext } from './config/user-provider';
import Home from './view/home';
import Header from './components/header'
import Cadastro from './view/cadastro';

// const user = null

function App() {

  const user = useContext(UserContext)

  return (
    <BrowserRouter>
      <Switch>
        {console.log(user)}
        {
          !user ?
            <>
              <Route path="/" exact={true} component={Login} />
              <Route path="/cadastro" exact={true} component={Cadastro} />
            </>
            :
            <>
              <Header />
              <Route path="/" component={Home} />
            </>
        }
      </Switch>
    </ BrowserRouter>
  );
}

export default App;
