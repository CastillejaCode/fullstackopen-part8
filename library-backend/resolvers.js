const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),

		// Works
		allBooks: async (root, args) => {
			if (args.genre && args.author) {
				return books
					.filter((book) => book.genres.some((genre) => genre === args.genre))
					.filter((book) => book.author === args.author);
			}
			if (args.genre) {
				return Book.find({ genres: args.genre }).populate('author');
			}
			if (args.author) {
				books.filter((book) => book.author === args.author);
			}
			return Book.find({}).populate('author');
		},

		allAuthors: async () => {
			const authors = await Author.find({});
			return Promise.all(
				authors.map(async (auth) => {
					const bookCount = await Book.countDocuments({ author: auth.id });
					return { ...auth._doc, bookCount, id: auth._doc._id };
				})
			);

			// return authors.map((author) => {
			// 	const bookCount = books.filter(
			// 		(book) => book.author === author.name
			// 	).length;
			// 	console.log(bookCount);
			// 	return { ...author, bookCount };
			// });
		},
		me: (root, args, { currentUser }) => currentUser,
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
		},
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			const author = new Author({ name: args.author });

			if (!currentUser) {
				throw new GraphQLError('no authentication', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
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

			const addedBook = await book.populate('author');
			pubsub.publish('BOOK_ADDED', { bookAdded: addedBook });
			return addedBook;
		},
		// works
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('no authentication', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}

			const foundAuthor = await Author.findOneAndUpdate(
				{ name: args.name },
				{ born: args.setBornTo },
				{ new: true }
			);

			if (!foundAuthor) return null;

			return foundAuthor;
		},
		createUser: async (root, args) => {
			const user = new User({ ...args });

			return user.save().catch((error) => {
				throw new GraphQLError('creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'password') {
				throw new GraphQLError('Invalid credentials', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
		},
	},
};

module.exports = resolvers;
