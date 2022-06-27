import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './DeletePost.css';
import removePost from "../../../../images/deletePost.svg";
import MenuItem from "@mui/material/MenuItem";

/*Componenta ce implementeaza subcomponente Material UI. In cadrul aplicatiei, ea constituie modalul
 ce apare pe ecran in momentul in care un user doreste sa stearga una din postarile sale din cadrul platformei*/

export default function DeletePost(props) {
    const [open, setOpen] = React.useState(false);

    //Handler de deschidere a modalului
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler de inchidere a modalului
    const handleClose = () => {
        setOpen(false);
    };

    //Utilizeaza metoda de http DELETE asupra unei entitati de tip post din cadrul bazei de date a aplicatiei
    const deletePost = () => {

        //In vederea realizarii request-ului, vom utiliza REST API-ul scris in Java, cu ajutorul tehnologiei Spring Boot.
        //Configurare request
        const header = {
            method: 'DELETE'
        };

        /*Stergerea se va utiliza folosind fetch API, alaturi de endpoint-ul `feed/post/delete/{identifier}`,
        unde identifier este identificatorul unic al postarii ce va urma a fi eliminata.*/
        fetch(`http://localhost:8080/feed/post/delete/${props.postId}`, header)
            .then(() => {
                //Caz de succes, se re-randeaza postarile in timp real, pentru a observa schimbarile la nivel de feed.
                props.fetchPosts();
            })
            .catch(err => console.log(err));
        //Imediat dupa stergere, modalul, cat si panoul de optiuni din care butonul de delete a fost declansat se vor inchide.
        handleClose();
        props.closeOptionsMenu();
    }

    //Render componenta:
    return (
        <div>
            <MenuItem className='MenuItem' onClick={handleClickOpen}><img className='thirdIcon'
                                                                          width="25"
                                                                          height="25"
                                                                          src={removePost}
                                                                          alt='Edit Post'
                                                                          title='Edit Post'/>Delete</MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`@${props.userName}: Are you sure that you want to delete this post?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        It will get permanently deleted and you won't be able to recover it!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='KeepPost'
                            onClick={handleClose}
                            autoFocus>No, I will keep this post
                    </button>
                    <button onClick={deletePost}
                            className='RemovePost'>
                        Remove anyway
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
