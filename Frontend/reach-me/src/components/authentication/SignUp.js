import React, {Component} from 'react';
import {authentication} from '../FirebaseIntegration';
import {Alert} from '@mui/material';
import ReactDOM from 'react-dom/client';
import './SignUp.css';
import AlertBox from './AlertBox';
import viewPassword from '../../images/view.svg'

//Componenta de Sign Up, asigura functionalitatea si design-ul componentei de inregistrare a unui nou cont de utilizator in cadrul aplicatiei
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: ``,
            fullName: ``,
            reachMeUsername: ``,
            reachMePass: ``,
            alertOpen: false,
            inputType: 'password'

        };
    }

    //Preia adresa de mail de la utilizator la autentificare
    retrieveEmailAddress = (e) => {
        this.setState({emailAddress: e.currentTarget.value});
    }

    //Preia numele intreg al utilizatorului la autentificare
    retrieveFullName = (e) => {
        this.setState({fullName: e.currentTarget.value});
    }

    //Obtine numele de utilizator la autentificare
    retrieveUserName = (e) => {
        this.setState({reachMeUsername: e.currentTarget.value});
    }

    //Parola la autentificare
    retreivePass = (e) => {
        this.setState({reachMePass: e.currentTarget.value});
    }

    //Reseteaza formularul de autentificare
    resetAuthenticationForm = () => {
        document.querySelectorAll('.SignInInput').forEach(formElement => {
            formElement.value = ``;
        })
    }

    //Animatie de fade-in, creste gradual opacitatea unui element din DOM
    increaseTheOpacity(element) {
        let opArray = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
        let x = 0;
        (function next() {
            element.style.opacity = opArray[x];
            if (x++ < opArray.length) {
                setTimeout(next, 80);
            }
        })();
    }


    //Animatie de fade out, scade progresiv opacitatea unui element din DOM
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

    //Handler ce asigura functionalitatea in cazul posibilelor erori de autentificare.
    //Utilizatorul va fi notificat prin alerte de tip SnackBar asupra unei autentificari defectuoase.
    handleSignUpErrors = (errorMsg, waitTime) => {
        this.setState({alertOpen: true});
        let alertBox = <AlertBox isOpen={this.state.alertOpen} message={errorMsg}/>
        const root = ReactDOM.createRoot(document.getElementById('errors'));
        root.render(alertBox);
        setTimeout(() => {
            this.decreaseTheOpacity(document.getElementById('errors'));
            document.getElementById('errors').remove();
        }, waitTime);
    }

    //Genereaza alertele in functie de posibile erori ce pot aparea de-a lungul autentificarii prin Firebase in aplicatie. Dintre aceste erori, se mentioneaza:
    //--email in uz
    //--email invalid (eroare generare ca mismatch in urma unei expresii regulate)
    //--parola slaba
    generateAlertsDependingOnStates = (errorCode) => {

        switch (errorCode) {
            //Email in uz:
            case (`auth/email-already-in-use`): {
                this.handleSignUpErrors(`Sign up failed! The email address you have entered is already used by another ReachMe account! Try another email address!`, 8000);
                break;
            }
            //Email invalid
            case (`auth/invalid-email`): {
                this.handleSignUpErrors(`Sign up failed! The email address you have eneterd is invalid!`, 6000);
                break;
            }
            //Parola slaba
            case (`auth/weak-password`): {
                this.handleSignUpErrors(`Sign up failed! The password you have chosen is way too weak! We highly recommed you to use a passowrd that contains at least one capital letter (A-Z), one lowercase character (a-z), one symbol (@$#^&) and one numeric character (0-9).`, 10000);
                break;
            }
            //Verificarea edge case-urilor
            default: {
                this.handleSignUpErrors(`Sign up failed due to an unexpected errror. Please try again later.`, 5000);
                break;
            }
        }

        this.resetAuthenticationForm();
    }

    //Afiseaza parola introdusa in capmpul de password utilizatorului, prin utilizarea de state management hooks
    showPasswordToTheUser = () => {
        this.setState({inputType: 'text'});
    }

    //Ascunde parola de utilizator, prin utilizarea de state management hooks
    hidePasswordFromUser = () => {
        this.setState({inputType: 'password'});
    }

    //Utilizam Firebase pentru a asigura functionalitatea de autentificare in cadrul aplicatiei Web
    //Functie asincrona, asteapta un raspuns de la serverele Firebase
    authenticateUser = () => {
        authentication.createUserWithEmailAndPassword(this.state.emailAddress, this.state.reachMePass)
            .then((userCredential) => {
                // Signed up, retinem credentialele user-ului
                const user = userCredential.user;

                /*Autentificarea unui nou utilizator in aplicatie presupune si o noua intrare in tabela account a bazei de date MySQL.
                Din aceste considerente, vom recurge la utilizarea REST API-ului creat folosind Java si Spring Boot pentru a face
                un http request de tip POST, utilizand endpoint-ul  `/account`
                Configurare payload, folosind o parte din parametrii deja transmisi catre server-ul Firebase de autentificare*/

                let payloadBody = {
                    "userFirebaseIdentifier": user.uid,
                    "userName": this.state.reachMeUsername,
                    "profilePhotoHref": "",
                    "userRealName": this.state.fullName,
                    "emailAddress": user.email
                }

                //Configurare parametri POST request
                const requestOpt = {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloadBody),
                };

                //Trimitem datele de la frontend la backend, in baza de date, folosind fetch API.
                fetch("http://localhost:8080/account", requestOpt)
                    .then(response => response.json())
                    .then(() => {
                    })
                    .catch(error => {
                        console.log(error);
                    })

                //Afisare alert de autentificare realizata cu succes.
                this.setState({signedId: true});
                const alert = <Alert variant="filled" severity="success" className='alert'>
                    Account created successfully, {this.state.fullName}! Enjoy the ReachMe app and
                    stay surrounded only by wonderful people!<br/>You will be automatically redirected to the Log In
                    page where you can enter your credentials and access your profile.</Alert>

                const container = document.createElement('div');
                let signup = document.querySelector('.Signup');
                container.id = 'success';
                signup.appendChild(container);
                console.log(signup);
                const root = ReactDOM.createRoot(document.getElementById('success'));
                root.render(alert);
                setTimeout(() => {
                    container.remove()
                }, 8000);
                this.resetAuthenticationForm();
                setTimeout(() => window.location.reload(), 4000);
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                const div = document.createElement('div');
                let signup = (document.querySelector('.Signup'));
                signup.appendChild(div);
                div.id = 'errors';
                this.generateAlertsDependingOnStates(errorCode);
            });

    }

    //Render componenta
    render() {
        return (
            <div className='Signup'>
                <input type="email"
                       className='SignInInput'
                       placeholder="Mobile Number or Email address"
                       onChange={this.retrieveEmailAddress}/>

                <input type="text"
                       className='SignInInput'
                       placeholder="First name & Last name"
                       onChange={this.retrieveFullName}/>

                <input type="text"
                       className='SignInInput'
                       placeholder="ReachMe Username"
                       onChange={this.retrieveUserName}/>

                <div className='PasswordField'>
                    <input
                        type={this.state.inputType}
                        className='SignInInput'
                        placeholder='Password'
                        onChange={this.retreivePass}/>

                    <img
                        src={viewPassword}
                        alt="ShowPassword"
                        title="Show password"
                        className='ShowPass'
                        onMouseDown={() => {
                            this.showPasswordToTheUser()
                        }}
                        onMouseUp={() => {
                            this.hidePasswordFromUser()
                        }}>
                    </img>

                </div>
                <button className='SignInButton'
                        onClick={() => {
                            this.authenticateUser()
                        }}>Sign Up!
                </button>
            </div>
        );
    }
}

export default SignUp;