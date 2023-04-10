import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = () => {
	const allBooks = useQuery(ALL_BOOKS);
	const { data, loading, error, refetch, variables } = useQuery(ALL_BOOKS);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	const genres = [
		...new Set(allBooks.data.allBooks.flatMap((book) => book.genres)),
	];

	return (
		<div>
			<h2>books</h2>

			<p>
				in genre <strong>{variables.genre ? variables.genre : 'All'}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th>book</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{data.allBooks.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			{genres.map((gen) => (
				<button onClick={() => refetch({ genre: gen })} type='button' key={gen}>
					{gen}
				</button>
			))}
			<button onClick={() => refetch({ genre: null })} type='button'>
				all genres
			</button>
		</div>
	);
};

export default Books;
