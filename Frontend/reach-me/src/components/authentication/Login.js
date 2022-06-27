import React, {Component} from 'react';
import Grid from '@mui/material/Grid';
import connection from '../../images/logoPic.jpg';
import './Login.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import logoPic from '../../images/logoPic.svg';
import googleLogo from '../../images/google.svg'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: true,
        };

    }

    //Schimba state-ul aplicatiei de la utilizator logat la utilizator delogat, fapt ce va schimba behaviour-ul aplicatiei, astfel:
    //Pentru utilizatorii deja logati, aplicatia se va deschide direct in feed.
    //Pentru utilizatorii ce nu au fost logati, aplicatia se deschide in meniul de autentificare/logare
    switchAuthState = () => {
        if (this.state.userLoggedIn)
            this.setState({userLoggedIn: false});
        else
            this.setState({userLoggedIn: true});
    }

    //Render function
    render() {
        return (
            <Grid container className='Wrapper'>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <div className="Main">
                        <div>
                            <img
                                src={connection}
                                width="600px"
                                height="400px"
                                style={{"marginRight": "20px", "marginTop": "20px"}}
                                alt="RefImage"/>
                        </div>
                        <div>
                            <div>
                                <div className="AuthContainer">
                                    <div className='LogoContainer'>
                                        <img src={logoPic}
                                             alt='Logo'
                                             className="ReachMeLogo"/>
                                        <h1 className="Logo">
                                            ReachMe
                                        </h1>
                                    </div>
                                    <h3 className="AditionalText">The social media app that fulfills your needs.</h3>
                                    <div>
                                        <div className='SignIn'>
                                            {this.state.userLoggedIn ? <SignIn/> : <SignUp/>}
                                            {(this.state.userLoggedIn) ?
                                                <div>
                                                    <div className='SeparatorContainer'>
                                                        <div className="LineSeparator"/>
                                                        <div className="Or">OR</div>
                                                        <div className="LineSeparator"/>
                                                    </div>
                                                    <h4 className='ForgottenPassword'>Forgot password?</h4>
                                                </div>
                                                :
                                                <div>
                                                    <div className='SeparatorContainer'>
                                                        <div className="LineSeparator"/>
                                                        <div className="Or">OR</div>
                                                        <div className="LineSeparator"/>
                                                    </div>
                                                    <div className='Flex'>
                                                        <img className='GoogleLogo' src={googleLogo} alt="GoogleLogo"/>
                                                        <h4 className='ForgottenPassword'>Sign Up using Google
                                                            Account</h4>
                                                    </div>
                                                </div>

                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='SignUp'>

                                    {this.state.userLoggedIn ?
                                        <p className='Up'>Don't have an account? <span
                                            style={{
                                                "fontWeight": "bolder",
                                                "color": "#094561",
                                                "cursor": "pointer"
                                            }}
                                            onClick={() => this.switchAuthState()}>
                      Sign Up!</span></p>
                                        : <p className='In'>Have an account already?
                                            <span
                                                style={{
                                                    "fontWeight": "bolder",
                                                    "color": "#094561",
                                                    "cursor": "pointer"
                                                }}
                                                onClick={() => this.switchAuthState()}>
                        &nbsp;Sign In!</span></p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={2}/>
            </Grid>
        );
    }
}

export default Login;