import React, {Component} from 'react';
import './Login.css';
import viewPassword from '../../images/view.svg';
import {authentication} from '../FirebaseIntegration';
import AlertBox from './AlertBox';
import ReactDOM from 'react-dom/client';
import {Alert} from '@mui/material';

//Componenta SignIn, utilizata pentru logarea propriu-zisa a utilizatorilor in cadrul aplicatiei

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputType: 'password',
            emailAddress: ``,
            reachMeLogInPassword: ``,
            signOut: false,
        };
    }

    //Preia adresa de mail de la utilizator la logarea in aplicatie
    retrieveEmailAddress = (e) => {
        this.setState({emailAddress: e.currentTarget.value});
    }

    //Obtine parola de la utilizator la logarea in aplicatie
    retreiveLogInPassword = (e) => {
        this.setState({reachMeLogInPassword: e.currentTarget.value});
    }

    //Afiseaza parola utilizatorului, folosind state management hooks
    showPasswordToTheUser = () => {
        this.setState({inputType: 'text'});
    }

    //Ascunde parola utilizatorului, prin state management hooks
    hidePasswordFromUser = () => {
        this.setState({inputType: 'password'});
    }

    //Genereaza pop-upuri de tip alert ce pot aparea in momentul in care logarea utilizeaza, in una din situatiile:
    //--parola incorecta
    //--email incorect
    //--input mismatch

    handleSignInErrors = (errorMsg, waitTime) => {
        let alertBox = <AlertBox isOpen={true} message={errorMsg}/> //Componenta React.js specifica Material UI
        const root = ReactDOM.createRoot(document.getElementById('errors'));
        root.render(alertBox);
        setTimeout(() => {
            this.decreaseTheOpacity(document.getElementById('errors'));
            document.getElementById('errors').remove();
        }, waitTime);
    }

    //Animatie de fade out, scade opacitatea unui DOM element
    decreaseTheOpacity = (element) => {
        let op2Array = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
        let y = 0;
        (function next() {
            element.style.opacity = op2Array[y];
            if (y++ < op2Array.length) {
                setTimeout(next, 50);
            }
        })();
    }
    //Reseteaza formularul de Log In, ce contine cele 2 input-uri (email+parola)
    resetLogInInputFields = () => {
        document.querySelectorAll('.SignInInput').forEach(input => input.value = ``);
    }

    //Trateaza fiecare eroare de autentificare ce poate aparea, in functie de un cod de eroare primit ca si raspuns de la server-ul Firebase ca urmare a unei logari defectuoase si afiseaza un pop-up de tip Alert (componenta AlertBox) in functie de tipul erorii.
    generateAlertsDependingOnStates = (errorCode) => {
        switch (errorCode) {

            //Email invalid
            case (`auth/invalid-email`): {
                this.handleSignInErrors(`The email address you have entered is not associated with an existing ReachMe account!`, 4000);
                setTimeout(() => this.resetLogInInputFields(), 80);
                break;
            }

            //Parola gresita
            case (`auth/wrong-password`): {
                this.handleSignInErrors(`The email address ${this.state.emailAddress} is registered on ReachMe, but the password associated with it is incorrect!`, 6000);
                setTimeout(() => this.resetLogInInputFields(), 80);
                break;
            }

            //Utilizator neinregistrat
            case (`auth/user-not-found`): {
                this.handleSignInErrors(`The credentials you have entered doesn't match any existing ReachMe account! Before you Log In into the app, make sure you're registered. `, 8000);
                setTimeout(() => this.resetLogInInputFields(), 80);
                break;
            }
            //Orice edge case:
            default: {
                this.handleSignInErrors(`An unexpected error occurred. Please try again.`, 4000);
                break;
            }
        }
    }

    //Handler la logarea cu succes
    logInSuccess = () => {
        //Alerta autentificare corecta
        const alert = <Alert variant="filled" severity="success" className='alertSignIn'>
            You've been logged in successfully!</Alert>

        const container = document.createElement('div');
        let signIn = document.querySelector('.SignIn');
        container.id = 'success';
        signIn.appendChild(container);
        console.log(document.getElementById('success'));
        const root = ReactDOM.createRoot(document.querySelector('#success'));
        root.render(alert);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    }

    //Functie asincrona de realizeaza logarea propriu-zisa a utilizatorului in aplicatie folosind serviciile de autentificare Firebase.
    logInUser = () => {
        authentication.signInWithEmailAndPassword(this.state.emailAddress, this.state.reachMeLogInPassword)
            .then((userCredential) => {

                // Caz de succses (logare realizata fara erori):
                const account = userCredential.user;
                localStorage.setItem('currentUserIdentifier', account.uid);
                //In situatia in care in aplicatie exista cel putin un utilizator inregistrat, se va afisa feed-ul, conform functionalitatii implementate in componenta-radacina (App.js).
                localStorage.setItem('accounts', account);
                setTimeout(()=>{
                const alert = <Alert variant="filled" severity="success" className='alert' >
                    You've been logged in successfully.</Alert>

                let container = document.createElement('div');
                let signIn = document.querySelector('.SignIn');
                container.id = 'success';
                signIn.append(container);
                console.log(signIn);
                const root = ReactDOM.createRoot(document.getElementById('success'));
                root.render(alert);
                this.resetLogInInputFields();
                window.location.reload();},500);
            })
            //Tratarea posibilelor de erori de logare, crearea componentei DOM ce va `tine` alert-ul, dar si apelul metodelor care genereaza aceasta componenta si ii transmit mesajul de afisat in frontend catre utilizator.
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);

                //Tratarea posibilelor erori de logare la aplicatie prin elemente grafice de tip alert, care vor informa
                //utilizatorul cu privire la posibilele erori de autentificare/logare ce pot aparea pe parcurs
                const div = document.createElement('div');
                const signIn = (document.querySelector('.SignIn'));
                signIn.appendChild(div);
                div.id = 'errors';
                this.generateAlertsDependingOnStates(errorCode);
               // const errorMessage = error.message;
            });
    }

    //Genereaza vizual componenta de SignIn a interfetei
    render() {
        return (
            <div className='SignIn'>
                <input
                    type="text"
                    className='SignInInput'
                    placeholder="Username or Email"
                    onChange={this.retrieveEmailAddress}
                    onKeyPress={event => event.key === 'Enter' ? this.logInUser() : null}/>

                <div className='PasswordField'>
                    <input
                        type={this.state.inputType}
                        className='SignInInput'
                        placeholder='Password'
                        onChange={this.retreiveLogInPassword}
                        onKeyPress={event => event.key === 'Enter' ? this.logInUser() : null}
                    />

                    <img
                        src={viewPassword}
                        alt="ShowPassword"
                        title="Show password"
                        className='ShowPassLogIn'
                        onMouseDown={() => {
                            this.showPasswordToTheUser()
                        }}
                        onMouseUp={() => {
                            this.hidePasswordFromUser()
                        }}>
                    </img>
                </div>
                <button className='SignInButton' onClick={() => {
                    this.logInUser()
                }}
                >Log In
                </button>
            </div>

        );
    }
}

export default SignIn;
