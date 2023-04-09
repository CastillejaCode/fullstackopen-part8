import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
			bookCount
		}
	}
`;

export const ALL_BOOKS = gql`
	query AllBooks($genre: String) {
		allBooks(genre: $genre) {
			title
			author {
				name
				born
			}
			genres
			published
		}
	}
`;

export const ADD_BOOK = gql`
	mutation AddBook(
		$title: String!
		$author: String!
		$genres: [String!]!
		$published: Int!
	) {
		addBook(
			title: $title
			author: $author
			genres: $genres
			published: $published
		) {
			author {
				name
			}
			published
			title
			genres
		}
	}
`;

export const EDIT_AUTHOR = gql`
	mutation EditAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
			born
			bookCount
		}
	}
`;

export const LOGIN = gql`
	mutation Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const ME = gql`
	query Query {
		me {
			favoriteGenre
			username
		}
	}
`;
