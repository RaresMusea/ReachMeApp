import React, { Component } from 'react';
import { Grid } from '@mui/material';
import './Feed.css';
import Stories from './Stories/Stories';
import Posts from './Posts/Posts';
import Infos from '../infos/infos';
import Suggestions from '../suggestions/suggestions';

/*Componenta Feed, element structural al proiectului de Frontend ce surprinde zona centrala din cadrul aplicatiei cu interfata grafica
Aceasta cuprinde urmatoarele subcomponente:
--Stories
--Posts, care la randul sau cuprinde componenta Post
--Infos
--Suggestions
--Grid-uri MaterialUI, utilizate pentru separarea si delimitarea de continut*/
class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts:[]
    };
  }

  //Render componenta:
  render() {
    return (
      <div>
        <Grid container>
          <Grid item xs={2}/>
          <Grid item xs={6}>
            <div>
              <Stories />
              <Posts getAccount={this.props.getAccount}
                     posts={this.props.posts}
                     fetchPosts={this.props.fetchPosts}
                    user={this.props.user}/>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Infos getAccount={this.props.getAccount}
            user={this.props.user}/>
            <Suggestions/>
          </Grid>
          <Grid item xs={1}/>
        </Grid>
      </div >
    );
  }
}

export default Feed;