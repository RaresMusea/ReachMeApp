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
utilizatorii care au subapreciat o postare.*/
function SimpleDialog(props) {
    const {onClose, open} = props;


    //Handler inchidere dialog
    const handleClose = () => {
        onClose();
    };

    //Render dialog
    return (
        <Dialog onClose={handleClose}
                open={open}
                className='LikesDialog'
                maxWidth='md'
                fullWidth={true}>

            <h2 className='DialogTitleDislikes'>People who disliked {props.postOwner} 's post </h2>
            <List className='List' sx={{pt: 0}}>
                {
                    props.dislikesList.map((user, index) => (
                            <>
                                <ListItem className='UsersWhoLiked'>
                                    <div className='clickable'>
                                        <ListItemAvatar>
                                            <Avatar src={props.dislikesProfilePics[index]}/>
                                        </ListItemAvatar>
                                    </div>
                                    <ListItemText primary={user}/>
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

//Props Simple Dialog
SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

//Functia Dislikes, utilizeaza componenta anterior definita in vederea intregirii componentei mari, cea de lista de dislike-uri din cadrul unei postari.
export default function Dislikes(props) {
    const [open, setOpen] = React.useState(false);

    //Handler deschidere lista
    const handleClickOpen = () => {
        setOpen(true);
    };

    //Handler inchidere lista
    const handleClose = () => {
        setOpen(false);
    };

    //Render lista dislikes:
    return (
        <div>
            <p className='NumberOfLikes'
               onClick={handleClickOpen}>{props.dislikes}</p>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                postOwner={props.postOwner}
                likesList={props.liked}
                dislikesList={props.disliked}
                dislikesProfilePics={props.dislikesProfilePics}
            />
        </div>
    );
}
