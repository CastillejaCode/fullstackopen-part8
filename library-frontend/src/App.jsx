import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';

const App = () => {
	const [token, setToken] = useState(null);
	const client = useApolloClient();

	useEffect(() => {
		setToken(localStorage.getItem('token'));
	}, []);

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
			</Routes>
		</Router>
	);
};

export default App;
