import React, {Component} from 'react';
import firebase from '../firebase.js';
import "../scss/main.scss"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: "",
            title: "",
            rating: "",
            newRating: "",
            books: [],
            editing: false
        };
    };

    handleChange = (event) => {
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
        // dlaczego czyszczenie nie działa w outpucie? State sprawdzony, działa
        this.setState({
            author: "",
            title: "",
            rating: ""
        });
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
        })
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
                        <ul className="display-book_booklist">
                            {this.state.books.map((book) => {
                                let rating;
                                if (!this.state.editing) {
                                    rating =  <p>Rating: {book.rating}</p>
                                } else {
                                    rating =
                                        <div>
                                            <input type="text"
                                                   onChange={this.handleChange}
                                                   name="newRating"/>
                                            <button onClick={() => this.handleSave(book.id)}>Save</button>
                                        </div>
                                }
                                return (
                                    <li key={book.id}
                                        className="booklist_item">
                                        <h2>{book.author}</h2>
                                        <h3>{book.title}</h3>
                                       {rating}
                                        <button onClick={() => this.handleEdit(book.id)}>Edit</button>
                                        <button onClick={() => this.handleDelete(book.id)}>Delete</button>
                                        {/* dlaczego () => this.handleDelete(book.id) a nie this.handleDelete(book.id)*/}
                                    </li>
                                )
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
                })
            }
            this.setState({
                books: newBookList
            });
        });
    }
}

export default App;
