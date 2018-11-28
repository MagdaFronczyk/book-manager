import React, {Component} from 'react';
import firebase from '../firebase.js';
import "../scss/main.scss"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: "",
            title: "",
            rating: ""
        };
    };

    handleChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value,
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const booksRef = firebase.database().ref("books");
        const book = {
            author: this.state.author,
            title: this.state.title,
            rating: this.state.rating
        };
        booksRef.push(book);
        this.setState({
            author: "",
            title: "",
            rating: ""
        });
    };

    render() {
        return (
            <div>
                <header className="header">
                    <div className="header main-width">
                        <h1 className="header_title">Book Manager</h1>
                    </div>
                </header>
                <div className="book-panel main-width">
                    <section className="book-panel_form">
                        <form className="add-book"
                              onSubmit={this.handleSubmit}>
                            <input type="text"
                                   name="author"
                                   placeholder="Author"
                                   className="add-book_input add-book_input--author"
                                   onChange={this.handleChange}
                            />
                            <input type="text"
                                   name="title"
                                   placeholder="Title"
                                   className="add-book_input add-book_input--title"
                                   onChange={this.handleChange}/>
                            <input type="text"
                                   name="rating"
                                   placeholder="Rating"
                                   className="add-book_input add-book_input--rating"
                                   onChange={this.handleChange}/>
                            <button className="add-book_button">
                                Add Book
                            </button>
                        </form>
                    </section>
                    <section className="book-panel_display-book">
                        <ul>

                        </ul>
                    </section>
                </div>
                <footer className=" footer main-width">
                    <ul>

                    </ul>
                </footer>
            </div>
        );
    }
}

export default App;
