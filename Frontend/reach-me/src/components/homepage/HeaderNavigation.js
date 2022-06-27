import React, {Component} from 'react';
import Grid from '@mui/material/Grid';
import backToHome from '../../images/backhome.svg';
import messages from '../../images/messages.svg';
import discovery from '../../images/discovery.svg';
import feed from '../../images/feed.svg';
import {Avatar} from '@mui/material';
import './HeaderNavigation.css';
import LogOutModal from './LogOutModal';
import {storage} from "../FirebaseIntegration";
import AlertBox from "../authentication/AlertBox";
import ReactDOM from "react-dom/client";
import {getDownloadURL} from "firebase/storage";

//Componenta HeaderNavigation implementeaza la nivel de design si functionalitate navbar-ul aplicatiei.
//Aceasta integreaza cateva subcomponente, cum ar fi Log Out Modal, ce permite delogarea din cadrul aplicatiei.
class HeaderNavigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePicture: "",
            locallyUploadedPicture: null,
            payloadPicture: null,
        };
    }

    //Animatie de fade out, prin scaderea progresiva a opacitatii unui element
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

    //Functie asincrina ce actualizeaza fotografia de profil a utilizatorului curent autentificat in cadrul unei aplicatii.
    //Functia va stoca mai intai in Cloud fotografia incarcata (Firebase Storage), dupa care va obtine un link URL asupra resursei.
    //Acest link va fi adaugat si in baza de date, mai exact in cadrul tabelei account, drept referinta a fotografiei de profil.
    //La final, interfata grafica se va actualiza in timp real, permitand astfel vizualizarea modificarilor efectuate.
    onLocalImageUpload = (event) => {
        //Fisierul optinut din input type file
        const [file] = event.target.files;
        this.setState({locallyUploadedPicture: URL.createObjectURL(file)});

        const image = event.target.files;
        let loadableContent = null;
        this.setState({payloadPicture: image}, () => {
            console.log(this.state.payloadPicture);
            loadableContent = this.state.payloadPicture[0];
            if (loadableContent === undefined || loadableContent === null)
                return;

            const uploadTask = storage.ref("ProfilePictures").child(loadableContent.name).put(loadableContent);

            // Register-ul in cloud al fisierului foloseste design patter-ul Observable si necesita cumva coexistenta a 3 observabile:
            // 1. 'state_changed' observer, declansat la fiecare schimbare de stare
            // 2. observer de eroare, declansat in cazul unei anomalii sau esec de transmisie
            // 3. observer de finalizare/completare, declansat in cazul unui upload complet al resursei in Firebase Cloud Storage.

            const div = document.createElement('div');
            const controller = (document.querySelector('.NavigationController'));
            console.log(controller);
            //Configurarea celor 3 observere, functie asincrona.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    //Se vor observa schimbarile de state, cum ar fi progres, pauza sau revenire (la upload)
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    //Se va obtine progresul task-ului efectuat, ce presupune numarul de biti uploadati si totalul numarului de biti ce pot fi uploadati (in cadrul fisierului ales)
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    controller.appendChild(div);
                    div.id = 'progress';
                    //Pentru a marca procentual progresul, implementam o componenta Alert ce se actualizeaza la fiecare state changing din punct de vedere al progresului.
                    //Folosind aceasta tehnica, utilizatorul va fi notificat cu privire la progresul upload-ului in cadrul platformei.
                    let alertBox = <AlertBox isOpen={true}
                                             message={"Profile picture upload on ReachMe is " + Math.floor(progress) + " %" + " complete."}/>
                    const root = ReactDOM.createRoot(document.getElementById('progress'));
                    root.render(alertBox);
                    setTimeout(() => {
                    }, 120);
                },
                //Observer-ul de eroare doar logheaza in consola eroarea aparuta
                (error) => {
                    console.log(error);
                },
                () => {
                    // Observer de finalizare, specifica faptul ca incarcarea datelor (a fisierului) catre Firebase Cloud storage a fost un succes.
                    // Se obtine path-ul catre resursa din cloud, de forma: https://firebasestorage.googleapis.com/.., ce va fi adaugat in baza de date prin intermediul unui HTTP PATCH si a REST API-ului Java.
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);

                        //Realizam un HTTP request cu metoda Patch asupra entitatii Account definite in cadrul aplicatiei Spring Boot, pentru a permite actualizarea bazei de date cu noua fotografie de profil a utilizatorului

                        //Configurare parametrii request
                        let patchRequestConfig = {
                            method: 'PATCH',
                            body: downloadURL,
                            headers: {
                                'Content-type': `text/html;`,
                                "Accept": "application/json;"
                            }
                        }

                        //Request propriu-zis, functie asincrona.
                        fetch(`http://localhost:8080/account/${localStorage.getItem('currentUserIdentifier')}/ChangeProfilePicture`, patchRequestConfig)
                            .then(response => response.json())
                            .then((data) => {
                                console.log(data.profilePhotoHref);
                                //Odata cu retinerea referintei in baza de date, o vom stoca si intr-o variabila de state a componentei pentru a o putea actualiza ulterior in interfata grafica a acesteia.
                                this.setState({profilePicture: data.profilePhotoHref}, () => console.log(this.state.profilePicture))
                                this.props.updateProfilePictures();
                                this.props.fectchPosts();
                                this.props.getAccount();
                                setTimeout(() => window.location.reload(), 1300);
                            })
                            .catch(err => console.log(err))
                    });
                });
        });

    }

    //Render componenta:
    render() {
        return (
            <div>
                <div className="NavigationController">
                    <Grid container>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={2}>
                            <div className='FirstGrid'
                                 onClick={() => {
                                     setTimeout(() => window.location.reload(), 500)
                                 }}>
                                <div id="logoAnimation"
                                     style={{
                                         "width": "40px",
                                         "height": "40px",
                                         "marginRight": "5px"
                                     }}/>
                                <h1 className='ReachMeLogo'>ReachMe</h1>
                            </div>
                        </Grid>
                        <Grid item xs={5} className="SearchArea">
                            <input type="text"
                                   className="SearchBar"
                                   placeholder="Who do you wanna reach?"/>
                        </Grid>
                        <Grid item xs={4} className="IconsDrawer">
                            <img src={backToHome}
                                 alt="Home"
                                 title="Home"
                                 className="Icon"/>

                            <img src={messages}
                                 alt="Messages"
                                 title="Messages"
                                 className="Icon"/>

                            <img src={discovery}
                                 alt="Discover"
                                 title="Discover"
                                 className="Icon"/>

                            <img src={feed}
                                 alt="Feed"
                                 title="Feed"
                                 className="Icon"/>

                            <label htmlFor='changeProfilePic'
                                   title='Change Profile picture'>

                                <input type='file'
                                       id='changeProfilePic'
                                       onChange={this.onLocalImageUpload}/>
                                <Avatar src={this.props.account.profilePhotoHref}
                                        className="ProfilePic"/>
                            </label>
                            <LogOutModal className='LogOut'/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default HeaderNavigation;