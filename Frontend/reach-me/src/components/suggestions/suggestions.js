import {Avatar} from '@mui/material';
import React, {Component} from 'react';
import './suggestions.css';

//Componenta Suggestions, randeaza o lista aleatoare de utilizatori din cadrul aplicatiei.
//@TODO: algoritm de sugestii
class Suggestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            randomAccounts: [],
            accounts: []
        };
    }

    //Montarea componentei presupune si insusirea unei liste cu toti utilizatorii din cadrul aplicatiei
    componentDidMount() {
        this.getAllAccounts();
    }

    //Obtinerea tuturor utilizatorilor din cadrul aplicatiei, prin efectuarea unui request de tip GET catre server.
    getAllAccounts = () => {
        fetch('http://localhost:8080/account/all')
            .then(response => response.json())
            .then(data => this.setState({accounts: data}, () => {
                const size = this.state.accounts.length;
                const elems = Math.floor(Math.random() * size);
                const res = [];
                for (let i = 0; i < elems; i++) {
                    //Ne asiguram ca utilizatorul curent logat nu va fi inclus in aceasta lista aleatoare
                    if (this.state.accounts[i].userFirebaseIdentifier !== localStorage.getItem('currentUserIdentifier'))
                        res.push(this.state.accounts[i]);
                }
                this.setState({randomAccounts: res});

            }))
            .catch(err => console.log(err));
    }

    //Render componenta:
    render() {
        return (
            <div className='Suggestions'>
                <div className='SuggestionsHeader'>
                    <div className='controller'>
                        <div className='Text'>Reach people you may know</div>
                        <div className='Button'>Reach all</div>
                    </div>
                    <div className='SuggestionsContents'>
                        {
                            this.state.randomAccounts.map(index => (
                                <div className='Section' key={index.identifier}>
                                    <Avatar className="SelectedSuggestionProfilePic"
                                            src={index.profilePhotoHref}/>
                                    <span className="FlexContainer">
                                <div className='SuggestionUsername'>{index.userName}</div>
                                        <div className='ReachButton'>Reach!</div>
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Suggestions;