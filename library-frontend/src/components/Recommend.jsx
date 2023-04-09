import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommend = () => {
	const { data, loading, error } = useQuery(ALL_BOOKS);
	const genre = useQuery(ME, {
		fetchPolicy: 'network-only',
	});

	console.log(genre);

	if (genre.data === undefined || genre.data.me === null)
		return <div>User not logged in!</div>;
	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	const booksFavorite = data.allBooks.filter((book) =>
		book.genres.some((element) => element === genre.data.me.favoriteGenre)
	);

	return (
		<div>
			<h2>Recommendations</h2>

			<p>
				books in your favorite genre:{' '}
				<strong>{genre.data.me.favoriteGenre}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th />
						<th>author</th>
						<th>published</th>
					</tr>
					{booksFavorite.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommend;
