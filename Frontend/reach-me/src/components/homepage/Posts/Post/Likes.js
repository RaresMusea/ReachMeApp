import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import './Likes.css';
import Divider from "@mui/material/Divider";

/*Genereaza o fereastra simpla de dialog, folosind componente MaterialUI, in care vor fi afisate, im cadrul ficarei postari,
utilizatorii care au apreciat o postare.*/
function SimpleDialog(props) {
    const {onClose, selectedValue, open} = props;

    //Handler inchidere dialog
    const handleClose = () => {
        onClose(selectedValue);
    };

    //Render componenta:
    return (
        <Dialog onClose={handleClose}
                open={open}
                className='LikesDialog'
                maxWidth='md'
                fullWidth={true}>

            <h2 className='DialogTitle'>People who liked {props.postOwner} 's post </h2>
            <List className='List' sx={{pt: 0}}>
                {
                    props.likesList.map((user, index) => (
                            <>
                                <ListItem className='UsersWhoLiked' key={index}>
                                    <div className='clickable'>
                                        <ListItemAvatar key={index * 10}>
                                            <Avatar src={props.likesProfilePics[index]}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={user} key={index * 20}/>
                                    </div>
                                </ListItem>
                                <Divider style={{'width': '100%'}}/>
                            </>
                        )
                    )
                }
            </List>
        </Dialog>
    );
}

//Definire props dialog:
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

//Functia Likes, utilizeaza componenta anterior definita in vederea intregirii componentei mari, cea de lista de like-uri din cadrul unei postari.
export default function Likes(props) {
    const [open, setOpen] = React.useState(false);

    //Handler deschidere componenta
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler inchidere componenta
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <p className='NumberOfLikes'
               onClick={handleClickOpen}>{props.likes}</p>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                postOwner={props.postOwner}
                likesList={props.liked}
                dislikesList={props.disliked}
                likesProfilePics={props.likesProfilePics}
            />
        </div>
    );
}
