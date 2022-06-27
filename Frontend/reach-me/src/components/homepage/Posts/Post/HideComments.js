import React, {Component} from 'react';
import './HideComments.css';

/*Componenta responsabila de inchiderea sectiunii de comentarii (ascunderea sa).
S-a implementat aceasta subcomponenta intr-o comonenta indiviiduala pentru a putea permite state management eficient,
utilizand React hooks.*/
class HideComments extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //Render componenta:
    render() {
        return (
            <p className='ViewAll'>View all comments</p>
        );
    }
}

export default HideComments;