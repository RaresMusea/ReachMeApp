import {Avatar} from '@mui/material';
import React, {Component} from 'react';
import like from '../../..//../images/heart.svg';
import unlike from '../../../../images/dislike.svg';
import share from '../../../../images/share.svg';
import comment from '../../../../images/comment.svg';
import Likes from './Likes';
import Dislikes from './Dislikes';
import './Post.css';
import ViewComments from './ViewComments';
import PostOptions from "./PostOptions";

//Componenta Post, permite afisarea card-urilor cu postari, cat si toata functionalitatea din cadrul acestor elemente ale aplicatiei.
class Post extends Component {
    constructor(props) {
        super(props);
        this.processDislikes.bind(this);
        this.updateLikesAndDislikes.bind(this);
        this.getLikesListForCurrentPost.bind(this);
        this.state = {
            datePipe: {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'},
            commentsArr: [],
            openCommentSection: false,
            postOwner: '',
            likesList: new Set(),
            dislikesList: new Set(),
            usersWhoLiked: [],
            usersWhoDisliked: [],
            postOwnerProfilePic: ``,
            likesProfilePics: [],
            dislikesProfilePics: [],
            loggedUser: ''
        };
    }

    /*Functie asincrona, realizeaza un GET http request, folosind API-ul construit in Java si Spring Boot, pentru a
     obtine identificatorii Firebase ai utilizatorulor ce au apreciat o postare specifica*/
    getLikesListForCurrentPost = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/getLikes`)
            .then(response => response.json())
            .then((data) => {
                this.setState({likesList: data});
            })
            .catch(err => console.log(err));
    }

    /*Functie asincrona, realizeaza un GET http request, folosind API-ul construit in Java si Spring Boot, pentru a
     obtine identificatorii Firebase ai utilizatorulor ce au subapreciat o postare specifica*/
    getDislikesListForCurrentPost = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/getDislikes`)
            .then(response => response.json())
            .then((data) => {
                this.setState({dislikesList: data});
            })
            .catch(err => console.log(err));
    }

    /*Functie asincrona, ce realizeaza un request de tipul http GET pentru a obtine din baza de date utilizatorul cu id-ul curent, logat in aplicatie.
    Pentru obtinerea acestui identificator, valoarea sa va fi extrasa din LocalStorage, ea fiind reactualizata in acest Storage la fiecare relogare/reautentificare*/
    getLoggedUser = () => {
        fetch(`http://localhost:8080/account/${localStorage.getItem('currentUserIdentifier')}`)
            .then(response => response.json())
            .then(data => this.setState({loggedUser: data.userName}))
            .catch(err => console.log(err));
    }
    //Functia componentDidMount este invocata in mod automat la montarea in aplicatie a componentei react si se asigura de faptul ca majoritatea informatiilor referitoare la comentarii, utilizatori, postari sunt aduse din baza de date imediat dupa initializarea componentei, prin metode de GET.
    componentDidMount = () => {
        this.fetchComments(); //Obtinere comentarii pentru postarea curenta
        this.getLikesListForCurrentPost(); //Obtinere lista de like-uri pentru postarea curenta
        this.getDislikesListForCurrentPost(); //Obtinere lista de dislike-uri pentru postarea curenta
        this.getUsersWhoLiked(); //Obtinerea sub forma de lista a username-urilor pentru cei ce au apreciat postarea
        this.getUsersWhoDisliked(); //Obtinerea sub forma de lista a username-urilor pentru cei ce au subapreciat postarea
        this.getProfilePictureForPostOwner(); //Obtinerea fotografiei de profil a utilizatorului logat in sesiunea curenta
        this.getProfilePicturesOfThoseWhoLiked(); //Obtinerea fotografiilor de profil a tuturor utilizatorilor ce au apreciat o postare
        this.getProfilePicturesOfThoseWhoDisliked(); //Obtinerea fotografiilor de profile pentru toti cei ce au subapreciat o postare
        this.getLoggedUser(); //Obtinerea user-ului inregistrat in sesiunea curenta.
    }

    //Functie ce actualizeaza in timp real (no page refresh needed) postarile din cadrul aplicatiei, imediat ce un like sau dislike a fost oferit/acordat
    updateLikesAndDislikes = () => {
        this.props.fetchPosts();
    }

    //Functie responsabila de state management-ul comentariilor (vor exista 2 situatii, cea in care lista este expandabila si cea in care lista comentariilor este deja ascunsa).
    //Trecerea de la o stare la alta se va realiza prin React Hooks.
    changeViewCommentsState = () => {

        if (this.state.openCommentSection === false) {
            this.setState({openCommentSection: true});
        } else {
            this.setState({openCommentSection: false});
        }
    }

    /*Functie asincrona utilizata pentru a actualiza in timp real fotografia de profil din cadrul avatarului postarii,
    odata cu schimbarea fotografiei de profil la nivel de cont de utilizator
    In vederea actualizarii propriu-zise, se va efectua un request http de tip PATCH, asupra entitatii post din baza de date,
    prin intermediul REST API-ului configurat folosind Java si Spring Boot.*/
    getProfilePictureForPostOwner = () => {
        const identifier = this.props.ownerIdentifier;
        console.log(identifier);
        fetch(`http://localhost:8080/account/${identifier}`)
            .then(response => response.json())
            .then(data => {
                this.setState({postOwnerProfilePic: data.profilePhotoHref});
            })
    }

    /*Printr-un HTTP Request de tip GET, functia asincrona curenta obtine adresele URL din Firebase Storage ale tuturor
    fotografiilor de profil aferente utilizatorilor ce au apreciat o anumita postare, pentru a putea randa corespunzator,
    ulterior componenta Likes, care va contine lista utilizatorilor ce au apreciat o postare specifica*/
    getProfilePicturesOfThoseWhoLiked = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/profilePictures/usersWhoLiked`)
            .then(response => response.json())
            .then(data => this.setState({likesProfilePics: data}))
            .catch(err => console.log(err));
    }

    /*Printr-un HTTP Request de tip GET, functia asincrona curenta obtine adresele URL din Firebase Storage ale tuturor
    fotografiilor de profil aferente utilizatorilor ce au subapreciat o anumita postare, pentru a putea randa corespunzator,
    ulterior componenta Likes, care va contine lista utilizatorilor ce au apreciat o postare specifica*/
    getProfilePicturesOfThoseWhoDisliked = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/profilePictures/usersWhoDisliked`)
            .then(response => response.json())
            .then(data => this.setState({dislikesProfilePics: data}, () => console.log(this.state.dislikesProfilePics)))
            .catch(err => console.log(err));
    }

    //Functie responsabila de actualizarea in timp real a componentei ce permite afisarea sau ascunderea sectiunii de comnetarii.
    changeTextDependingOnState = () => {
        const elem = document.querySelector('.paragraph');
        if (this.state.openCommentSection === false) {
            elem.innerHTML = 'View all comments';
        } else elem.innerHTML = 'Collpase';
    }

    /*Functie asincrona ce realizea un http request de tip PATCH pentru a creste numarul de like-uri pentru postarea in cauza,
     in cazul in care postarea nu a fost apreiciata, respectiv o revocare a like-ului in situatia in care postarea a fost deja
     apreciata.*/
    processLikes = () => {
        //Obtinem identificatorul Firebase al contului utilizatorului curent din LocalStorage-ul browser-ului.
        const accountIdentifier = localStorage.getItem(`currentUserIdentifier`);

        //Configurarea request-ului HTTP de tip PATCH
        const reqConfig = {
            method: 'PATCH',
            body: {},
            headers: {'Content-type': `application / json; charset = UTF - 8`}
        }

        //Utilizare Fetch API in vederea efectuarii request-ului
        fetch(`http://localhost:8080/feed/post/increase-likes/${this.props.id}/${accountIdentifier}`, reqConfig)
            .then(response => response.json())
            .then(() => {
                //Cazul de succes.
                this.updateLikesAndDislikes(); //Actualizare like-uri, dislike-uri in interfata grafica a aplicatiei
                this.getLikesListForCurrentPost();//Reactualizarea listei de like-uri pentru postarea curenta
                this.getUsersWhoLiked(); //Reactualizarea listei de username-uri care au acordat like-uri postarii curente
                this.getProfilePicturesOfThoseWhoDisliked();//Obtinerea unei liste de URL-uri catre fotografiile de profil din Firebase Storage ale utilizatorilor care au subapreciat postarea curenta
                this.getProfilePicturesOfThoseWhoLiked();//Obtinerea unei liste de URL-uri catre fotografiile de profil din Firebase Storage ale utilizatorilor care au apreciat postarea curenta
            })
            .catch((err) => console.log(err))
    }

    /*Functie asincrona ce realizea un http request de tip PATCH pentru a creste numarul de dislike-uri pentru postarea in cauza,
     in cazul in care postarea nu a fost apreiciata, respectiv o revocare a dislike-ului in situatia in care postarea a fost deja
     subapreciata.*/
    processDislikes = () => {

        //Obtinerea identificatorului Firebase a user-ului curent, din LocalStorage-ul browser-ului.
        const accountIdentifier = localStorage.getItem(`currentUserIdentifier`);

        //Configurare PATCH request.
        const reqConfig = {
            method: 'PATCH',
            body: {},
            headers: {'Content-type': `application / json; charset = UTF - 8`}
        }

        //Utilizare Fetch API in vederea efectuarii request-ului.
        //Se actualizeaza baza de date si ulterior si elementele din cadrul interfetei grafice a aplicatiei web.
        fetch(`http://localhost:8080/feed/post/increase-dislikes/${this.props.id}/${accountIdentifier}`, reqConfig)
            .then(response => response.json())
            .then(() => {
                //Request-ul primeste status 200(OK)- se realizeaza cu succes.
                this.updateLikesAndDislikes();//actualizeaza like-urile si dislike-urile in cadrul interfetei grafice in timp real
                this.getLikesListForCurrentPost();//Obtine identificatoarele de cont ale utilizatorilor ce au apreciat postarea curenta
                this.getUsersWhoLiked();//Obtine username-urile persoanelor ce au apreciat postarea curenta
                this.getUsersWhoDisliked(); //Obtine username-urile persoanelor ce au subapreciat postarea curenta
                //Obtinerea fotografiilor de profil (URL-uri catre Firebase Storage ale utilizatorilor care au apreciat sau subapreciat postarea in cauza).
                this.getProfilePicturesOfThoseWhoDisliked();
                this.getProfilePicturesOfThoseWhoLiked();
            })
            .catch((err) => console.log(err))
    }
    //Functie asincrona ce obtine, prin intermediul unui http request de tip GET numele de utilizator al persoanelor ce au apreciat o postare identificata in baza un id unic.
    getUsersWhoLiked = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/usersWhoLiked`)
            .then(response => response.json())
            .then(data => this.setState({usersWhoLiked: data}))
            .catch(err => console.log(err));
    }

    //Functie asincrona ce obtine, prin intermediul unui http request de tip GET numele de utilizator al persoanelor ce au subapreciat o postare identificata in baza un id unic.
    getUsersWhoDisliked = () => {
        fetch(`http://localhost:8080/feed/post/${this.props.id}/usersWhoDisliked`)
            .then(response => response.json())
            .then(data => this.setState({usersWhoDisliked: data}))
            .catch(err => console.log(err));
    }

    //Functie asincrona ce asigura trimiterea unui comentariu la o postare, salvarea acestuia in baza de date si ulterior, afisarea acestuia in cadrul sectiunii de comentarii a unei postari.
    postComment = (event) => {
        this.props.getAccount();
        //Comentariul se va trimite doar la apasarea tastei Enter de pe tastatura.
        if (event.key === 'Enter') {
            //Preluare input de la utilizator
            const comment = event.currentTarget.value;
            if (comment !== null || comment !== undefined) {
                //Configurare payload
                let payloadBody = {
                    "accountIdentifier": localStorage.getItem('currentUserIdentifier'),
                    "commentIdentifier": Math.floor(Math.random() * 100000),
                    "content": comment,
                    "postIdentifier": this.props.id,
                    "timestamp": new Date(),
                    "commentAuthor": this.state.loggedUser
                }
                //Detalii despre request
                const requestOpt = {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloadBody),
                };
                //Trimitem datele de la frontend la backend, in baza de date
                fetch("http://localhost:8080/comments-section", requestOpt)
                    .then(response => response.json())
                    .then(() => {
                        //Actualizam lista de comentarii pentru a putea vedea in timp real (si fara refresh) modificarile comise
                        this.fetchComments();
                    })
                    .catch(error => {
                        console.log(error);
                    })
                //Ca semn al trimiterii cu succes catre baza de date a comentariului, valoarea din input field se goleste imediat dupa
                event.currentTarget.value = ``;
            }
        }
    }

    //Functie asincrona ce realizeaza un GET http request de la server, in vederea obtinerii comentariilor pentru o postare identificata prin intermediul id-ului sau.
    fetchComments = () => {
        fetch(`http://localhost:8080/comments-section/${this.props.id}`)
            .then(response => response.json())
            .then(data => this.setState({commentsArr: data}))
            .catch(err => console.log(err));
    }

    //Render componenta:
    render() {
        return (
            <div className="PostContainer" key={this.props.imagePost}>
                {/* Header */}

                <div className='PostHeader'>
                    <Avatar src={this.props.profilePicture} className="PostOwnerProfilePic"/>
                    <div className='AditionalText'>
                        <h3 className='PostOwner'>{this.props.user}</h3>
                        <p className='Location'>{this.props.location}</p>
                    </div>
                    <p className='Date'>{this.props.timestamp.split('T')[0]}</p>
                </div>

                {/* Postarea propriu-zisa */}
                <div className='ImagePost'>
                    <img src={this.props.imagePost} alt="Post" className='Image'/>
                </div>

                {/* Butoane (like, dislike, etc. */}
                <div>
                    <div className="ButtonsContainer">
                        <div className='FirstContainer'>
                            <img className='PostOption'
                                 src={like}
                                 alt="LikeButton"
                                 title=" Appreciate"
                                 onClick={() => {
                                     this.processLikes()
                                 }}/>

                            <img className='PostOption'
                                 src={unlike}
                                 alt="DislikeButton"
                                 title="Dislike"
                                 onClick={() => {
                                     this.processDislikes()
                                 }}/>

                            <img className='PostOption'
                                 src={share}
                                 alt="Share"
                                 title="Share"/>

                            <img className='PostOption'
                                 src={comment}
                                 alt="Comment"
                                 title="Comment"/>
                        </div>
                        <div className='SecondContainer'>
                            <PostOptions
                                className='MenuToggle'
                                postOwnerIdentifier={this.props.ownerIdentifier}
                                postOwner={this.props.user}
                                postId={this.props.id}
                                fetchPosts={this.props.fetchPosts}
                                getProfilePicture={this.getProfilePictureForPostOwner}
                                postDescription={this.props.description}
                                postLocation={this.props.location}/>
                        </div>
                    </div>
                    <div className='ColumnStats'>
                        <Likes likes={this.props.likes}
                               postIdentifier={this.props.id}
                               postOwner={this.props.user}
                               liked={this.state.usersWhoLiked}
                               disliked={this.state.usersWhoDisliked}
                               fetchPosts={this.props.fetchPosts}
                               likesProfilePics={this.state.likesProfilePics}
                        />
                        <Dislikes
                            dislikes={this.props.dislikes}
                            postIdentifier={this.props.id}
                            postOwner={this.props.user}
                            liked={this.state.usersWhoLiked}
                            disliked={this.state.usersWhoDisliked}
                            fetchPosts={this.props.fetchPosts}
                            dislikesProfilePics={this.state.dislikesProfilePics}
                        />
                    </div>
                    <div className='PostDescription'>
                        <span className='PostDescriptionOwner'>{this.props.user}: </span>
                        <span className='PostDescriptionContent'>{this.props.description}</span>
                    </div>
                </div>

                {/*Sectiune de comentarii*/}
                <p className='paragraph' onClick={(e) => {
                    this.changeViewCommentsState();
                    e.target.innerHTML = (this.state.openCommentSection === true) ?
                        'View all comments' :
                        'Collpase';
                }}
                >View all comments</p>
                {
                    this.state.openCommentSection ?
                        <ViewComments identifier={this.props.id}
                                      comments={this.state.commentsArr}/> : null
                }
                <input type="text"
                       className='AddComment'
                       placeholder='Add a public comment'
                       onKeyPress={this.postComment}/>
            </div>
        );
    }
}

export default Post;