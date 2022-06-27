import React, {Component} from 'react';
import Post from './Post/Post';
import './Posts.css';
import Upload from '../Upload';

/*Componenta Posts este un wrapper class pentru componenta Post. Daca Post definea design-ul si functionalitatea unei singure postari,
Posts functioneaza ca o lista ce inglobeaza un numar de n componente Post, unde n face referire la numarul entitatilor de tip postare
inregistrate in cadrul bazei de date a aplicatiei.
 */
class Posts extends Component {
    constructor(props) {
        super(props);
        this.updatePosts.bind(this);
        this.state = {
            posts: [],
            ownersProfilePictures: []
        };
    }

    //Odata ce componenta se ,,monteaza'', toate postarile vor fi stocate intr-o variabila de state a componentei.
    componentDidMount = () => {
        this.props.fetchPosts();
    }

    //Functie ce permite actualizarea variabilei de state ce retine toate postarile cu o alta astfel de variabila
    updatePosts = (newPostsList) => {
        this.setState({posts: newPostsList});
    }

    //Asigura incarcarea noilor postari adaugate in cadrul aplicatiei fara a fi necesar refresh-ul la nivel de pagina.
    //Metoda foarte importanta!
    handleRealTimeFeedUpdate = (newFeed) => {
        this.setState({posts: newFeed});
    }

    //Render componenta
    render() {
        return (
            <div>
                <div className='UploadButton'>
                    <Upload posts={this.props.posts}
                            updatePosts={this.updatePosts}
                            fetchPosts={this.props.fetchPosts}
                            user={this.props.user}/>
                </div>

                {
                    (this.props.posts !== null && this.props.posts !== undefined) ?
                        this.props.posts.map((post) => (
                            <Post key={post.postIdentifier}
                                  id={post.postIdentifier}
                                  user={post.postOwner}
                                  imagePost={post.uploadedMediaHref}
                                  location={post.location}
                                  likes={(post.likes === 1) ? (post.likes + " Like") : (post.likes + " Likes")}
                                  dislikes={(post.dislikes === 1) ? (post.dislikes + " Dislike") : (post.dislikes + " Dislikes")}
                                  description={post.postDescription}
                                  timestamp={post.timestamp}
                                  ownerIdentifier={post.accountIdentifier}
                                  fetchPosts={this.props.fetchPosts}
                                  profilePicture={post.postOwnersProfilePicture}
                                  getAccount={this.props.getAccount}/>
                        ))
                        : null
                }
            </div>
        );
    }
}

export default Posts;