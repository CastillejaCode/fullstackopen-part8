import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';

const authlink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : null,
		},
	};
});

const httpLink = createHttpLink({
	uri: 'http://localhost:4000',
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: authlink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
