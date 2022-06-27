import {Avatar} from '@mui/material';
import React, {Component} from 'react';
import './infos.css';
import DescriptionEditor from "./DescriptionEditor";

//Componenta Infos, permite afisarea pe ecran a informatiilor din coltul din dreapta, referitoare la utilizatorul logat in sesiunea curenta a aplicatiei
class Infos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            profilePic: '',
        };
    }

    render() {
        return (
            <div className='Info'>
                <Avatar className="CurrentProfile" src={this.props.user.profilePhotoHref}/>
                <div className='InfoContents'>
                    <div className="CurrentUser">{this.props.user.userName}</div>
                    <div className='flex-row'>
                        <div className="CurrentUser" style={{"color": "#108e8e"}}>{this.props.user.userRealName}</div>
                        <span className='Description'>{this.props.user.description}</span>
                        <DescriptionEditor user={this.props.user}/>

                    </div>
                </div>
            </div>
        );
    }
}

export default Infos;