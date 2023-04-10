import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommend from './components/Recommend';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

const App = () => {
	const [token, setToken] = useState(null);
	const client = useApolloClient();

	useEffect(() => {
		setToken(localStorage.getItem('token'));
	}, []);

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			const addedBook = data.data.bookAdded;
			window.alert(`${addedBook.title} added`);

			client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
				return {
					allBooks: allBooks.concat(addedBook),
				};
			});

			client.cache.updateQuery(
				{ query: ALL_BOOKS, variables: { genre: null } },
				({ allBooks }) => {
					return {
						allBooks: allBooks.concat(addedBook),
					};
				}
			);
		},
	});

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	return (
		<Router>
			<div>
				<Link to='/authors'>authors</Link>
				<Link to='/books'>books</Link>
				{token ? <Link to='/recommend'>recommendation</Link> : null}
				{token ? <Link to='/addbook'>add book</Link> : null}
				<Link to='/login'>login</Link>
				<button onClick={logout} type='button'>
					logout
				</button>
			</div>

			<Routes>
				<Route path='/authors' element={<Authors />} />
				<Route path='/books' element={<Books />} />
				<Route path='/addbook' element={<NewBook />} />
				<Route path='/login' element={<LoginForm setToken={setToken} />} />
				<Route path='/recommend' element={<Recommend />} />
			</Routes>
		</Router>
	);
};

export default App;
