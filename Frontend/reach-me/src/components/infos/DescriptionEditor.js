import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../homepage/Posts/Post/EditPost.css';
import {styled, TextareaAutosize} from "@mui/material";
import write from "../../images/write.svg";

//Componenta DescriptionEditor, permite actualizarea descrierii unui cont de utilizator si constituie acel dialog ce va aparea pe ecran in momentul in care un utilizator va apasa pe butonul de schimbare a descrierii.
export default function DescriptionEditor(props) {

    //Intiailizare state-uri.
    const [open, setOpen] = React.useState(false);

    //Handler de deschidere a dialog-ului
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler de inchidere a dialog-ului
    const handleClose = () => {
        setOpen(false);
        //props.closeOptionsMenu();
    };

    //Utilizare styledComponents pentru stilizarea directa din Javascript a elementelor de tip form din cadrul dialog-ului
    styled(TextField)({
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

    //Render componenta
    return (
        <div>
            <img src={write}
                 className='editIcon'
                 width="20"
                 height="20"
                 alt="Edit description"
                 title="Add or edit account description"
                 onClick={handleClickOpen}
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                    className='EditDialogTtitle'>{props.user.description !== '' ? "Add a description" : "Edit your current description"}</DialogTitle>
                <DialogContent>
                    <DialogContentText className='Context'>
                        Please fill in the form in order to update your account description
                    </DialogContentText>
                    <TextareaAutosize
                        maxRows={4}
                        aria-label="maximum height"
                        placeholder="Description"
                        defaultValue={props.user.description}
                        className='Textarea'
                        style={{
                            width: 200,
                            fontFamily: 'PT Sans, sans-serif',
                            margin: '2em',
                            padding: '.5em',
                            fontWeight: 'bolder',
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <button className='CancelEdit' onClick={handleClose}>Cancel</button>
                    <button className='SubmitEdit'>Save</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
