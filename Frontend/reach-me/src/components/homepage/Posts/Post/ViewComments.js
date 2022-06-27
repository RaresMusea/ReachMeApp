import React, {Component} from 'react';
import './ViewComments.css';

//Componenta ce figureaza lista comentariilor din cadrul unei postari (la nivel de UI)
class ViewComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredComments: []
        };
    }

    /*Functie ce filtreaza lista tuturor comentariilor, asigurandu-se ca intr-un nou array
    se vor insera doar comentariile ce apartin postarii curente*/
    filterComments() {
        return this.props.comments.filter(comment => comment.postIdentifier === this.props.identifier);
    }

    //Functie rulata in mod automat de React in momentul in care componenta este complet randata in pagina.
    //Asigura filtrarea comentariilor.
    componentDidMount = () => {
        const result = this.filterComments();
        this.setState({filteredComments: result});
    }

    //Randare componenta:
    render() {
        return (
            <div>
                {
                    this.filterComments().length !== 0 ?
                        <div className='Comments'>
                            {
                                this.filterComments().map((comment) => (
                                    <p className='CommentText'><span
                                        className="CommentUserName">{comment.commentAuthor}: </span>{comment.content}
                                    </p>
                                ))
                            }
                        </div> : <p className='CommentText'>No available comments for this post yet</p>
                }
            </div>
        );
    }
}

export default ViewComments;