import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import './Upload.css';
import upload from '../../images/upload.svg';
import uploadImage from '../../images/create-new.svg';
import PostPreview from './PostPreview';
import {getDownloadURL} from "firebase/storage";
import {storage} from '../FirebaseIntegration';
import ReactDOM from 'react-dom/client';
import AlertBox from '../authentication/AlertBox';
import locationIcon from '../../images/location.svg';

//Tranzitia ce apare la deschiderea sectiunii de upload
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//Componenta de Upload, asigura design-ul, cat si functionalitatea intregii ferestre ce apare la apasarea butonului de upload a unei postari
export default function Upload(props) {

    //Initializare state-uri:
    const [open, setOpen] = React.useState(false);
    const [alreadyOpened, setAlreadyOpened] = React.useState(false);
    const [post, setPost] = React.useState(null);
    const [description, setDescription] = React.useState(``);
    const [location, setLocation] = React.useState(``);
    const [options, setOptions] = React.useState(false);
    const [profilePicture, setProfilePicture] = React.useState(``);
    const [uploadableContent, setUploadableContent] = React.useState(null);

    //Functie asincrona-handler la incarcarea unei fotografii prin file input dialog
    const onPostUpload = (event) => {
        //Prin state management, ne asiguram ca fereastra de upload a fost deja deschisa, ceea ce ne va ajuta sa controlam state-ul ei (sa o resetam) la o noua deschidere in cazul aceleiasi sesiuni
        setAlreadyOpened(true);
        const [file] = event.target.files;
        setPost(URL.createObjectURL(file));
        setUploadableContent(event.target.files);
        console.log(uploadableContent);

        //Obtinem fotografia de profil si numele utilizatorului care incarca postarea, printr-un HTTP request de tip GET, ce retrieve-uieste aceste informatii din baza de date MySQL a aplicatiei
        fetch(`http://localhost:8080/account/${localStorage.getItem('currentUserIdentifier')}`)
            .then(response => response.json())
            .then(data => {
                setProfilePicture(data.profilePhotoHref);
            })
            .catch(err => console.log(err));
        console.log(profilePicture)

    }

    //2 way binding: Observable de state management ce actualizeaza in timp real descrierea din preview in momentul in care utilizatorul completeaza formularul din sectiunea Post Options
    const handlePostDescription = (event) => {
        setDescription(event.target.value);
    }

    //Prin utilizarea unor servicii de geolocatie (API locationIQ), se obtine locatia curenta a utilizatorului
    const getLocation = (event) => {
        setLocation(event.target.value);
    }

    //Handler deschidere fereastra upload
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler inchidere fereastra upload, reseteaza state-ul componentei la stadiul initial
    const handleClose = () => {
        setOpen(false);
        setAlreadyOpened(false);
        setPost(null);
        setLocation('');
        setDescription('');
    };

    //Ascunde optiunile din cadrul postarii ce urmeaza a fi postata
    const hideOptionsPanel = () => {
        setOptions(!options);
    }

    //Obtine locatia curenta a utilizatorului care incarca o postare (async)
    const getCoords = () => {

        //Optiuni request
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        //Promise returnat cu succes (request realizat), se vor stoca latitudinea si longitudinea utilizatorului in niste variabile si se va identifica orasul in functie de aceste 2 coordonate geografice.
        const success = (position) => {
            const coordinates = position.coords;
            const latitude = coordinates.latitude.toString();
            const longitude = coordinates.longitude.toString();
            const positionArr = [latitude, longitude];
            console.log(`Latitude:${latitude}\nLongitude:${longitude}`)
            retrieveCity(positionArr);
        }

        //Promise neefectuat, eroare la request, tratarea erorilor prin logarea lor in consola
        const error = (err) => {
            console.warn(`Error${err.code}: ${err.message}`);
        }

        //Apelul functiei asincrone ce permite obtinerea pozitiei curente
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    //Functie asincrona ce realizeaza un fetch catre API-ul locationiq in vederea obtinerii orasului in care este localizat utilizatorul curent
    const retrieveCity = (coordinates) => {
        const latitude = coordinates[0];
        const longitude = coordinates[1];


        fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.84e290595ccd20871c15594310c0ed3c&lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
                //In caz de succes, se updateaza input field-ul cu locatia identificata de serviciul de geolocatie
                console.log(data);
                document.querySelector('.LocationInput').value = `${data.address.county}, ${data.address.country}`;
                setLocation(document.querySelector('.LocationInput').value);
            })
            //In caz de eroare, se afiseaza posibilele astfel de mesaje in consola.
            .catch(err => console.log(err));
    }

    //Incarca fotografia aleasa de utilizator in cloud, prin Firebase Storage. Ulterior, se trimite la server un request, cu metoda POST, care sa permita cumva memorarea fotografiei (a postarii propriu-zise) in baza de date si sa permita totodata incarcarea acesteia in platforma aplicatiei
    const uploadFile = () => {
        const image = uploadableContent[0];
        console.log(image);
        setAlreadyOpened(true);

        //Daca nu exista nicio imagine incarcata, functia esueaza
        if (image === undefined || image === null)
            return;

        //Specificam path-ul din Firebase storage unde va fi plasata imaginea ce va urma a fi incarcata
        const uploadTask = storage.ref("images").child(image.name).put(image);


        //Asiguram functionalitatea a 3 observere, in functie de starea upload-ului:
        // 1. Observer-ul 'state_changed', declansat de fiecare data cand se depisteaza o schimbare de stare la nivel de upload
        // 2. Observer de eroare, declansat in cazul esuarii upload-ului
        // 3. Observer de succes/finalizare, declansat in momentul update-ului cu succes a resursei in Firebase Storage.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observa schimbarile de stare ale upload-ului, cum ar fi progresul, pauza, ori chiar reveneirea
                // Obtine progresul procentual al efectuarii task-ului (numarul de octeti incarcati complet din totalul numarului de octeti ai resursei incarcabile).
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                const div = document.createElement('div');
                let appBar = (document.querySelector('.AppBar'));
                appBar.appendChild(div);
                div.id = 'progress';
                //Afisarea in timp real a progresului intr-o componenta de tip SnackBar (Material UI)
                let alertBox = <AlertBox isOpen={true}
                                         message={"ReachMe upload is " + Math.floor(progress) + " %" + " done."}/>
                const root = ReactDOM.createRoot(document.getElementById('progress'));
                root.render(alertBox);
                //Dupa finalizarea upload-ului, ne asiguram ca meniul de upload revine la stadiul initial, resetand post preview-ul cat si sectiunea de Post Options
                setTimeout(() => {
                    setAlreadyOpened(false);
                    setOptions(!options);
                }, 2000);
            },
            //Observer de eroare, obtinut ca esec in cazul incarcarii in Cloud a resursei alese de utilizator
            (error) => {
                console.log(error);
            },
            () => {
                // Gestionarea operatiilor ce se vor efectua in momentul in care upload-ul in cloud a fost realizat cu succes
                // In cazul de fata, se obtine un link de download al resursei incarcate, de forma https://firebasestorage.googleapis.com/..., ce va fi adaugat in baza de date locala, drept referinta a postarii incarcate, alaturi de alti parametrii ai postarii, prin intermediul unui request de tip POST la server.
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);

                    //POST request
                    //Configurare payload
                    let payloadBody = {
                        "accountIdentifier": localStorage.getItem('currentUserIdentifier'),
                        "likes": 0,
                        "dislikes": 0,
                        "location": location,
                        "postDescription": description,
                        "postIdentifier": Math.floor(Math.random() * 10000),
                        "timestamp": Date.now(),
                        "uploadedMediaHref": downloadURL,
                        "postOwnersProfilePicture": profilePicture,
                        "postOwner": props.user.userName
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

                    //Trimitem datele de la frontend la backend, in baza de date, prin intermediul REST API-ului configurat in Java si Spring Boot
                    fetch("http://localhost:8080/feed/post", requestOpt)
                        .then(response => response.json())
                        .then(() => {
                            //Ca urmare a realizarii cu succes a request-ului (STATUS 200 OK), se va realiza o reactualizare instantanee a postarilor din feed 
                            props.fetchPosts();
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    //In urma unei postari realizate cu succes, inchiderea meniului de Upload este gestionata in mod automat de catre aplicatie.
                    handleClose();
                    //Se reseteaza state-ul initial al componentei, pentru a permite o noua incarcare, a unei noi resurse pe platforma, din cadrul aceleiasi sesiuni, fara a exista cumva interferente intre 2 postari uploadate concomitent.
                    setPost(null);
                    setLocation('');
                    setDescription('');
                });
            });
    }

    //Render componenta
    return (
        <div>
            <img src={uploadImage}
                 alt="Upload Post"
                 title="Upload on ReachMe"
                 className='uploadImage'
                 onClick={handleClickOpen}/>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}
                        className='AppBar'>
                    <Toolbar>
                        <Typography sx={{ml: 2, flex: 1}}
                                    variant="h6"
                                    component="div"
                                    className='Title'>
                            Create a new post on ReachMe
                        </Typography>
                        <Button color="inherit"
                                onClick={uploadFile}>
                            Upload
                        </Button>
                        <Button color="inherit"
                                onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        <ListItemText className='FirstListItemText'
                                      primary="Upload a picture or a video from your device"/>
                    </ListItem>
                    <Divider/>
                    <div className='uploadContainer'>
                        <label for="uploadFile">
                            <img src={upload}
                                 className='uploadIcon'
                                 alt='Upload File'
                                 title='Choose File'/>
                        </label>
                    </div>
                    <input type="file"
                           id="uploadFile"
                           name='uploadFile'
                           onChange={onPostUpload}/>
                    {alreadyOpened ?
                        <div className='preview'>
                            {
                                (post != null) ?
                                    <PostPreview id={"post.id"}
                                                 user={props.user.userName}
                                                 profilePic={props.user.profilePhotoHref}
                                                 imagePost={post}
                                                 location={location}
                                                 likes={+" Likes"}
                                                 dislikes={+" Dislikes"}
                                                 description={description}
                                                 className='PostPreview'/>
                                    : null
                            }
                        </div> : null}
                    <Divider/>
                    {
                        (post !== null) ?
                            < ListItem button>
                                <ListItemText
                                    primary="Post Options"
                                    style={{
                                        'textAlign': 'center',
                                        'fontWeight': 'bolder',
                                        'fontSize': '3em',
                                        'cursor': 'pointer'
                                    }}
                                    onClick={hideOptionsPanel}/>
                                <Divider/>
                            </ListItem> : null}
                    {((post !== null) && (options === true)) ?

                        <form className="editPost">
              <textarea
                  className='description'
                  placeholder="Post Description"
                  onChange={handlePostDescription}
                  rows="10"
                  cols={4}/>
                            <div className='RetrieveUsersLocation'>
                                <input type="text"
                                       placeholder='Location'
                                       onChange={getLocation}
                                       className='LocationInput'/>
                                <img src={locationIcon} alt="Get location"
                                     title="Use current location"
                                     className='LocationIcon'
                                     onClick={getCoords}/>
                            </div>
                        </form>
                        : null
                    }
                </List>
            </Dialog>
        </div>
    );
}