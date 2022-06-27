import React, {Component} from 'react';
import Feed from './Feed';
import HeaderNavigation from './HeaderNavigation';
import './homepage.css';

//Componenta Homepage, reprezinta un wrapper Component, care din punct de vedere structural, permite implementarea in cadrul aplicatiei a majoritatii componentelor din cadrul aplicatiei, precum:
//--Componenta Feed
//--Componenta HeaderNavigation
//Aceste componente sunt alcatuite, la randul lor din alte subcomponente ce sunt definite in cadrul ierarhiei proiectului.
class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            user: {},
            currentUserPosts: [],
            accounts: []
        };
    }

    //Functie ce se autoapeleaza la montarea componentei.
    //Aceasta este responsabila de obtinerea datelor utilizatorului curent logat, cat si de obtinerea listei tuturor postarilor din cadrul aplicatiei
    //Variabilele in care acesti parametri sunt salvati vor fi transmise mai departe catre descdendeti (componentele copil), sub forma de props.
    componentDidMount = () => {
        this.getCurrentAccountByItsIdentifier();
        this.fetchPosts();
    }

    //Functie ce permite obtinerea postarilor unui utilizator specific.
    //Functia va face un filter pe o variabila de tip state, in care toate postarile au fost salvate in urma efectuarii unui http GET, folosind REST API-ul Java.
    getCurrentUserPosts = () => {
        const specificPosts = this.state.posts.filter(post => post.accountIdentifier === localStorage.getItem('currentUserIdentifier'));
        this.setState({currentUserPosts: specificPosts}, () => console.log(this.state.currentUserPosts));
    }

    //Functie asincrona ce permite actualizarea in timp real a fotografiei de profil pentru utilizatorul logat in sesiunea curenta.
    //Rolul functiei este acela de a asigura un real time update al fotografiilor de profil pentru avatarele ce vor tine poza de profil a utilizatorului curent logat.
    updateProfilePictureForOwnersPosts = () => {

        //Configurare request
        const requestConfig = {
            method: 'PATCH',
            body: {},
            headers: {
                'Content-Type': 'application/json;'
            }
        };

        //Utilizare fetch API pentru realizarea unui HTTP request de tip PATCH in vederea realizarii modificarii in baza de date a schimbarilor efectuate in cadrul aplicatiei.
        for (let item of this.state.currentUserPosts) {
            fetch(`http://localhost:8080/feed/post/edit-profile-picture/${item.postIdentifier}`, requestConfig)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    }

    //Functie asincrona responsabila de returnarea tuturor postarilor din cadrul bazei de date a aplicatiei.
    //Functia va asigura update-ul in timp real al feed-ului de postari.
    fetchPosts = () => {

        //Efectuarea unui request HTTP de tip GET in vederea obtinerii tuturor postarilor
        fetch("http://localhost:8080/feed/post")
            .then(response => response.json())
            .then(data => {
                this.setState({posts: data}, () => this.getCurrentUserPosts());
            })
            .catch(error => {
                console.log("Error retrieving posts from the database.")
                console.log(error);
            });
    }

    //Functie asincrona ce realizeaza un request de tip GET la server in vederea obtinerii datelor utilizatorului curent logat in aplicatie, in functie de identificatorul unic al acestuia, ce este preluat din LocalStorage.
    getCurrentAccountByItsIdentifier = () => {
        //Realizarea propriu-zisa a request-ului
        fetch(`http://localhost:8080/account/${localStorage.getItem('currentUserIdentifier')}`)
            .then(response => response.json())
            .then((data) => {
                this.setState({user: data})
            })
            .catch((err) => console.log(err));
    }

    //Render componenta:
    render() {
        return (
            <div>
                <HeaderNavigation fectchPosts={this.fetchPosts}
                                  account={this.state.user}
                                  getAccount={this.getCurrentAccountByItsIdentifier}
                                  posts={this.state.posts}
                                  updateProfilePictures={this.updateProfilePictureForOwnersPosts}/>

                <Feed getAccount={this.getCurrentAccountByItsIdentifier}
                      user={this.state.user}
                      fetchPosts={this.fetchPosts}
                      posts={this.state.posts}/>
            </div>
        );
    }
}

export default Homepage;