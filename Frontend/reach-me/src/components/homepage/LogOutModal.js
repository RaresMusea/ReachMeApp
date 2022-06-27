import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import './LogOutModal.css';
import logoPic from '../../images/logoPic.svg';
import {getAuth, signOut} from "firebase/auth";

//Definire styling componenta direct din Javascript
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    boxShadow: 10,
    p: 4
};

//Componenta LogOutModal, implementeaza design-ul, cat si functionalitatea dialogului ce apare pe ecran in momentul in care utilizatorul curent logat doreste sa se delogheze din aplicatie.
//Componenta implementeaza anumite elemente importate din Material UI.
export default function LogOutModal() {
    const [open, setOpen] = React.useState(false);

    //Handler deschidere dialog
    const handleOpen = () => setOpen(true);

    //Handler inchidere dialog
    const handleClose = () => setOpen(false);


    //Functie asincrona ce realizeaza Log Out-ul user-ului (implementarea utilizeaza Firebase API)
    const logOut = () => {
        //Obtinerea credentialelor utilizatorului curent logat
        const auth = getAuth();

        //Functia asincrona ce asigura log out-ul din aplicatie
        signOut(auth).then(() => {
            //In caz de succes, datele din LocalStorage vor fi sterse, iar pagina isi va da refresh, ceea ce va permite intoarcerea la pagina de log in/ sign up
            localStorage.clear();
            window.location.reload();
        }).catch((error) => {
            //Caz de eroare, afisarea in consola a posibilelor erori ce pot aparea la Log out.
            console.log(error);
        });
    }

    return (
        <div>
            <div className='LogOutSection'
                 onClick={handleOpen}>Log Out
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style} className='Box'>
                        <div className='LogoContainer'>
                            <img src={logoPic}
                                 alt='Logo'
                                 className="ReachMeLogo"/>
                            <h1 className="Logo">
                                ReachMe
                            </h1>
                        </div>
                        <Typography id="transition-modal-title"
                                    variant="h6"
                                    component="h2">
                            Log Out
                        </Typography>
                        <Typography id="transition-modal-description"
                                    sx={{mt: 2}}>
                            Are you sure that you want to log out?
                        </Typography>
                        <div className='FlexContainer'>
                            <button className='LogOutButton'
                                    onClick={() => {
                                        logOut()
                                    }}>Yes
                            </button>
                            <button className='StayOnPageButton'
                                    onClick={handleClose}>No
                            </button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}