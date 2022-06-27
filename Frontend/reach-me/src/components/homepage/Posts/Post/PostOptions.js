import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import profile from '../../../../images/profile.svg';
import './PostOptions.css'
import DeletePost from "./DeletePost";
import EditPost from "./EditPost.";

/*Componenta PostOptions, figureaza elementul contextual ce apare in momentul in care se apasa pe butonul cu textul More Options.
O mare parte din subcomponentele acestei componente au fost importate din MaterialUI.*/
export default function PostOptions(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    //Handler deschidere meniu contextual
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //Handler inchidere meniu contextual
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Render componenta:
    return (
        <div>
            <div className='ButtonToggle'
                 id="basic-button"
                 aria-controls={open ? 'basic-menu' : undefined}
                 aria-haspopup="true"
                 aria-expanded={open ? 'true' : undefined}
                 onClick={handleClick}
            >
                More options...
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                className='Menu'
            >

                <MenuItem className='MenuItem'
                          onClick={handleClose}>
                    <img width="30"
                         height="30"
                         src={profile}
                         alt="Profile"
                         title="Profile"/>
                    Profile</MenuItem>
                {
                    localStorage.getItem('currentUserIdentifier') === props.postOwnerIdentifier ?
                        <EditPost
                            postDescription={props.postDescription}
                            postLocation={props.postLocation}
                            closeOptionsMenu={handleClose}
                            fetchPosts={props.fetchPosts}
                            identifier={props.postId}/>
                        : null
                }
                {
                    localStorage.getItem('currentUserIdentifier') === props.postOwnerIdentifier ?
                        <DeletePost
                            userName={props.postOwner}
                            postId={props.postId}
                            fetchPosts={props.fetchPosts}
                            getOwnerProfilePic={props.getProfilePicture}
                            closeOptionsMenu={handleClose}
                        />
                        : null
                }
            </Menu>
        </div>
    );
}
