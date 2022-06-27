import {Avatar} from '@mui/material';
import React, {Component} from 'react';
import profilePicture from '../../../images/pp1.png';
import './Stories.css';
import addToStory from '../..//../images/create.svg'

//Componenta Stories (Work in Progress), modeleaza la nivel de UI sectiunea dedicata incarcarii si vizualizarii story-urilor din cadrul aplicatiei
class Stories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesArray: [],
        };
    }

    //Montarea componentei implica inserarea tuturor entitatilor de tip poveste relevante pentru un anume user intr-o lista sau array
    componentDidMount() {
        this.fetchStories();
    }

    //Construieste o lista de dummy stories, pentru a putea popula cumva elementul UI din cadrul aplicatiei
    fetchStories = () => {
        const data = [
            {
                'user': '_raresmusea_2001_',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'elon.musk',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': '@billgates',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'lana_del_rey',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'its@leo_di_caprio',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'john_legend',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'mary_jane',
                'profilePic': '../../../images/pp1.png'
            },
            {
                'user': 'web_dev_masters',
                'profilePic': '../../../images/pp1.png'
            }
        ]

        this.setState({storiesArray: data});
    }

    //Render componenta
    render() {
        return (
            <div>
                <div className='StoriesContainer'>
                    <div className='StoryElement'>
                        <img src={addToStory}
                             title="Create new story"
                             alt="Story creator"
                             className='CreateStoryButton'/>
                    </div>
                    {
                        this.state.storiesArray.map((profile) => (
                            <div className="StoryElement" key={profile.user}>
                                <Avatar src={profilePicture}
                                        className='StoryProfilePicture'/>
                                <p className="StoryUsername">{profile.user}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Stories;