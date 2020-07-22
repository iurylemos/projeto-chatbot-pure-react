import React, { Component, createContext } from "react";
import { auth } from '../services/firebase/firebase';
import { generateUserDocument } from './user-document';

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
  state = {
    user: null
  };

  componentDidMount = async () => {
    await auth.onAuthStateChanged(userAuth => {
      generateUserDocument(userAuth);
      this.setState({ user: userAuth });
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;