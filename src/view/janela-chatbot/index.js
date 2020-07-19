import React from 'react';
import ReactDOM from 'react-dom';


export default class JanelaChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      externalWindow: Window | null,
      containerElement: HTMLElement | null
    };
  }

  // When we create this component, open a new window
  componentDidMount() {
    const features = 'width=350, height=500, left=300, top=100';
    const externalWindow = window.open('', '', features);

    let containerElement = null;
    if (externalWindow) {
      containerElement = externalWindow.document.createElement('div');
      externalWindow.document.body.appendChild(containerElement);

      // Copy the app's styles into the new window
      const stylesheets = Array.from(document.styleSheets);
      stylesheets.forEach(stylesheet => {
        const css = stylesheet;

        if (stylesheet.href) {
          const newStyleElement = document.createElement('link');
          newStyleElement.rel = 'stylesheet';
          newStyleElement.href = stylesheet.href;
          externalWindow.document.head.appendChild(newStyleElement);
        } else if (css && css.cssRules && css.cssRules.length > 0) {
          const newStyleElement = document.createElement('style');
          Array.from(css.cssRules).forEach(rule => {
            newStyleElement.appendChild(document.createTextNode(rule.cssText));
          });
          externalWindow.document.head.appendChild(newStyleElement);
        }
      });

      externalWindow.document.title = this.props.title;

      // Make sure the window closes when the component unloads
      externalWindow.addEventListener('beforeunload', () => {
        this.props.closeWindow();
      });
    }

    this.setState({
      externalWindow: externalWindow,
      containerElement: containerElement
    });
  }

  // Make sure the window closes when the component unmounts
  componentWillUnmount() {
    if (this.state.externalWindow) {
      this.state.externalWindow.close();
    }
  }

  render() {
    if (!this.state.containerElement) {
      return null;
    }

    // Render this component's children into the root element of the popout window
    return ReactDOM.createPortal(this.props.children, this.state.containerElement);
  }
}