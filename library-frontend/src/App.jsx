import { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
	return (
		<Router>
			<div>
				<Link to='/authors'>authors</Link>
				<Link to='/books'>books</Link>
				<Link to='/addbook'>add book</Link>
			</div>

			<Routes>
				<Route path='/authors' element={<Authors />} />
				<Route path='/books' element={<Books />} />
				<Route path='/addbook' element={<NewBook />} />
			</Routes>
		</Router>
	);
};

export default App;
