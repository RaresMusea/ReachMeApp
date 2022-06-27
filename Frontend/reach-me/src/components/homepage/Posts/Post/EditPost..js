import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './EditPost.css';
import editPost from "../../../../images/editPost.svg";
import MenuItem from "@mui/material/MenuItem";
import {styled} from "@mui/material";

/*Componenta EditPost, permite editarea unei postari din cadrul retelei de socializare (doar de catre owner-ul sau).
In cadrul aplicatiei, Edit Post este modalul ce apare la editarea unei postari, ce permite utilizatorului (autorului postarii in cauza) sa modifice anumiti parametrii ai postarii, precum descrierea acesteia ori chiar locatia.*/
export default function EditPost(props) {
    const [open, setOpen] = React.useState(false);

    //Handler deschidere modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler inchidere modal
    const handleClose = () => {
        setOpen(false);
        props.closeOptionsMenu();
    };

    //Stilizarea input-urilor de tip text folosind paleta de culori specifica aplicatiei.
    //Pentru stilizarea implicita, direct din Javascript a proiectului, s-a utilizat StyledComponents.
    const Input = styled(TextField)({
        '& label.Mui-focused': {
            fontFamily: 'PT Sans, sans-serif',
            color: '#108c8e',
        },
        '& label': {
            fontFamily: 'PT Sans, sans-serif',
            marginTop: '10px',
        },
        '& .MuiInputBase-input': {
            fontFamily: 'PT Sans, sans-serif',
            outline: 'none',
            marginTop: '3px'
        },
        '& .MuiInputBase-input:hover': {
            borderColor: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#108c8e',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#094561',
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'green',
            },
        },
    });

    /*Functie asincrona, ce foloseste metoda http de PATCH din cadrul REST API-ului scris in Java si Spring Boot
    Endpoint modificare postare:`/feed/post/edit/{identifier}`, unde identifier este un identificator unic al postarii*/
    const modifyPost = () => {
        //Obtinere identifier
        const postIdentifier = props.identifier;

        //Configurare request si obtinere payload din casetele de editare de tip text
        const requestConfig = {
            method: 'PATCH',
            body: JSON.stringify({
                description: document.querySelector("#description").value,
                location: document.querySelector("#location").value,
                timestamp: new Date()
            }),
            headers: {
                'Content-Type': 'application/json;'
            }
        }
        //Utilizare fetch API pentru realizarea propriu-zisa a request-ului
        fetch(`http://localhost:8080/feed/post/edit/${postIdentifier}`, requestConfig)
            .then(response => response.json())
            .then(() => props.fetchPosts())
            .catch(err => console.log(err));
        handleClose();
    }

    //Render componenta
    return (
        <div>

            <MenuItem className='MenuItem'
                      onClick={handleClickOpen}>
                <img className='secondIcon'
                     width="20"
                     height="20" src={editPost}
                     alt='Edit Post'
                     title='Edit Post'/>Edit</MenuItem>

            <Dialog open={open}
                    onClose={handleClose}>
                <DialogTitle className='EditDialogTtitle'>Edit post</DialogTitle>
                <DialogContent>
                    <DialogContentText className='Context'>
                        Please fill in the form in order to update the current post.
                    </DialogContentText>
                    <Input
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Post description"
                        type="text"
                        fullWidth
                        defaultValue={props.postDescription}
                        variant="standard"
                    />

                    <Input
                        autoFocus
                        margin="dense"
                        id="location"
                        label="Post location"
                        type="text"
                        fullWidth
                        defaultValue={props.postLocation}
                        variant="standard"
                    />

                </DialogContent>
                <DialogActions>
                    <button className='CancelEdit'
                            onClick={handleClose}>Cancel
                    </button>
                    <button className='SubmitEdit'
                            onClick={modifyPost}>Edit post
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
