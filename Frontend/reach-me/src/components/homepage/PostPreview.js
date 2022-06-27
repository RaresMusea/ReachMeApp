import React, {Component} from 'react';
import '../homepage/Posts/Post/Post.css';
import {Avatar} from '@mui/material';

//Componenta PostPreview, permite vizualizarea in timp real a unei postari sub forma unui preview, la upload
class PostPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //Render componenta:
    render() {
        return (
            <div className="PostContainer"
                 style={{'paddingBottom': '30px', 'marginBottom': '30px'}}>

                {/* Header */}
                <div className='PostHeader'>
                    <Avatar src={this.props.profilePic}
                            className="PostOwnerProfilePic"/>
                    <div className='AditionalText'>
                        <h3 className='PostOwner'>{this.props.user}</h3>
                        <p className='Location'>{this.props.location}</p>
                    </div>
                </div>

                {/* Continut postare */}
                <div className='ImagePost'
                     style={{'marginBottom': '20px'}}>
                    <img src={this.props.imagePost}
                         alt="Post" className='Image'/>
                </div>
                <div className='PostDescription'>
          <span className='PostDescriptionOwner'
                style={{'marginTop': '20px'}}>
            {this.props.user}:
          </span>
                    <span className='PostDescriptionContent'> {this.props.description}</span>
                </div>
            </div>
        );
    }
}

export default PostPreview;