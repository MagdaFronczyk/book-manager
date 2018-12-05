import React, {Component} from "react";
import firebase from "../firebase.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook} from "@fortawesome/free-solid-svg-icons";

import "../scss/main.scss";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: "",
            title: "",
            rating: "",
            newRating: "",
            books: [],
            editing: false,
            failure: []
        };
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
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

        //walidacja
        let success = false;
        let failure = [];

        if (!this.state.author) {
            success = false;
            failure.push("You forgot to enter the book's author");
        }
        if (!this.state.title) {
            success = false;
            failure.push("You forgot to enter the book's title");
        }
        if (isNaN(Number(this.state.rating))) {
            success = false;
            failure.push("It looks as if you've entered incorrect rating");
        }
        if (!this.state.rating) {
            success = false;
            failure.push("You forgot to enter the book's rating");
        }
        if (!success) {
            this.setState({
                failure: failure
            });
        }
    };

    handleDelete = (bookId) => {
        const bookRef = firebase.database().ref(`/books/${bookId}`);
        bookRef.remove();
    };

    //uruchomić tylko dla przyciśniętego elementu
    handleEdit = () => {
        this.setState({
            editing: true,
            rating: ""
        });
    };

    handleSave = (bookId) => {
        const bookRef = firebase.database().ref(`/books/${bookId}`);
        bookRef.update(
            {"rating": this.state.newRating}
        );
        this.setState({
            editing: false,
            newRating: ""
        });
    };

    render() {
        let errors;
        if (this.state.failure) {
            errors = this.state.failure.map((error, index) => {
                return <li key={index} className="errors_item">{error}</li>;
            });
        } else {
            errors = null;
        }

        return (
            <div>
                <header className="header">
                    <div className="main-width header_container">
                        <h1 className="header_title">
                            Book Manager
                        </h1>
                        <FontAwesomeIcon icon={faBook} spin className="header_icon"/>
                        <FontAwesomeIcon icon={faBook} spin className="header_icon header_icon--blue"/>
                        <FontAwesomeIcon icon={faBook} spin className="header_icon header_icon--red"/>
                    </div>
                </header>
                <div className="book-panel main-width">
                    <section className="book-panel_form">
                        <form className="add-book"
                              onSubmit={this.handleSubmit}>
                            <label className="add-book_input_label">Author
                                <input type="text"
                                       id="author"
                                       name="author"
                                       placeholder="Author"
                                       className="add-book_input add-book_input--author"
                                       onChange={this.handleChange}
                                       value={this.state.author}
                                />
                            </label>
                            <label className="add-book_input_label"> Title
                                <input type="text"
                                       name="title"
                                       placeholder="Title"
                                       className="add-book_input add-book_input--title"
                                       onChange={this.handleChange}
                                       value={this.state.title}
                                />
                            </label>
                            <label className="add-book_input_label">Rating
                                <input type="text"
                                       name="rating"
                                       placeholder="Rating"
                                       className="add-book_input add-book_input--rating"
                                       onChange={this.handleChange}
                                       value={this.state.rating}
                                />
                            </label>
                            <button className="add-book_button">
                                Add Book
                            </button>
                        </form>
                    </section>
                    <section className="book-panel_display-errors">
                        <ul className="errors_list">
                            {errors}
                        </ul>
                    </section>
                    <section className="book-panel_display-book">
                        <ul className="display-book_booklist">
                            {this.state.books.map((book) => {
                                let rating;
                                if (!this.state.editing) {
                                    rating = <h2>Rating: {book.rating}</h2>;
                                } else {
                                    rating =
                                        <div>
                                            <input type="text"
                                                   onChange={this.handleChange}
                                                   name="newRating"/>
                                            <button onClick={() => this.handleSave(book.id)}>Save</button>
                                        </div>;
                                }
                                return (
                                    <li key={book.id}
                                        className="booklist_book">
                                        <h2 className="book_author">
                                            {book.author}
                                        </h2>
                                        <h2 className="book_title">
                                            {book.title}
                                        </h2>
                                        {rating}
                                        <button
                                            onClick={() => this.handleEdit(book.id)}
                                            className="book_button button--edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => this.handleDelete(book.id)}
                                            className="book_button button--delete"
                                        >
                                            Delete
                                        </button>
                                        {/* dlaczego () => this.handleDelete(book.id) a nie this.handleDelete(book.id)*/}
                                    </li>
                                );
                            })}
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

    componentDidMount() {
        const booksRef = firebase.database().ref("books");
        booksRef.on("value", (snapshot) => {
            const books = snapshot.val();
            let newBookList = [];
            for (let book in books) {
                newBookList.push({
                    id: book,
                    author: books[book].author,
                    title: books[book].title,
                    rating: books[book].rating
                });
            }
            this.setState({
                books: newBookList
            });
        });
    }
}

export default App;
