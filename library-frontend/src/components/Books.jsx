import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = () => {
	const { data, loading, error } = useQuery(ALL_BOOKS);

	const [genre, setGenre] = useState(undefined);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	const genres = [...new Set(data.allBooks.flatMap((book) => book.genres))];

	return (
		<div>
			<h2>books</h2>

			<p>
				in genre <strong>{genre}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th />
						<th>author</th>
						<th>published</th>
					</tr>
					{data.allBooks
						.filter((book) =>
							genre ? book.genres.some((element) => element === genre) : true
						)
						.map((a) => (
							<tr key={a.title}>
								<td>{a.title}</td>
								<td>{a.author.name}</td>
								<td>{a.published}</td>
							</tr>
						))}
				</tbody>
			</table>
			{genres.map((gen) => (
				<button onClick={() => setGenre(gen)} type='button' key={gen}>
					{gen}
				</button>
			))}
			<button onClick={() => setGenre(null)} type='button'>
				all genres
			</button>
		</div>
	);
};

export default Books;
