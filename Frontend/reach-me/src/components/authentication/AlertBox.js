import { Snackbar } from '@mui/material';
import React, { Component } from 'react';
import { Fade } from '@mui/material';

//Componenta AlertBox, implementeaza elemente MaterialUI si este utilizata pentru a randa Snackbar-uri cu posibile erori ce pot aparea la logare/autentificare.
class AlertBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  //Render function
  render() {
    return (
      <div>
        <Snackbar open={this.props.isOpen ? true : false}
          autoHideDuration={500}
          onClose={() => this.setState({ alertOpen: 'false' })}
          TransitionComponent={Fade}
          message={this.props.message} />
      </div>
    );
  }
}

export default AlertBox;