const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const { v1: uuid } = require('uuid');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Book = require('./models/book');
const Author = require('./models/author');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('connected to MONGODB'))
	.catch((error) => console.log('error connection', error.message));

let authors = [
	{
		name: 'Robert Martin',
		id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
		born: 1963,
	},
	{
		name: 'Fyodor Dostoevsky',
		id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
		born: 1821,
	},
	{
		name: 'Joshua Kerievsky', // birthyear not known
		id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
	},
	{
		name: 'Sandi Metz', // birthyear not known
		id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
	},
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
		genres: ['agile', 'patterns', 'design'],
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'patterns'],
	},
	{
		title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'design'],
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'crime'],
	},
	{
		title: 'The Demon ',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'revolution'],
	},
];

/*
  you can remove the placeholder query once your first own has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
        title:String!
        author: String!
        genres: [String!]!
        published: Int!
        ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),

		// Works
		allBooks: async (root, args) => {
			if (args.genre && args.author) {
				return books
					.filter((book) => book.genres.some((genre) => genre === args.genre))
					.filter((book) => book.author === args.author);
			}
			if (args.genre) {
				return Book.find({ genres: [args.genre] }).populate('author');
			}
			if (args.author) {
				return books.filter((book) => book.author === args.author);
			}
			return Book.find({}).populate('author');
		},

		//works
		allAuthors: async () => {
			return Author.find({});

			// return authors.map((author) => {
			// 	const bookCount = books.filter(
			// 		(book) => book.author === author.name
			// 	).length;
			// 	console.log(bookCount);
			// 	return { ...author, bookCount };
			// });
		},
	},
	Mutation: {
		// works
		addBook: async (root, args) => {
			const author = new Author({ name: args.author });
			try {
				await author.save();
			} catch (error) {
				throw new GraphQLError('saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				});
			}

			const book = new Book({ ...args, author: author.id });
			try {
				await book.save();
			} catch (error) {
				throw new GraphQLError('saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				});
			}

			return book.populate('author');
		},
		// works
		editAuthor: async (root, args) => {
			const foundAuthor = await Author.findOneAndUpdate(
				{ name: args.name },
				{ born: args.setBornTo },
				{ new: true }
			);
			if (!foundAuthor) return null;

			// const newAuthor = { ...foundAuthor, born: args.setBornTo };
			// authors = authors.map((author) =>
			// 	author.name === args.name ? newAuthor : author
			// );
			return foundAuthor;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
