import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';
import BirthForm from './BirthForm';

const Authors = () => {
	const { data, loading, error } = useQuery(ALL_AUTHORS);
	if (loading) return <div>Loading Data...</div>;
	if (error) return <p>Error : {error.message}</p>;

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th>Author</th>
						<th>born</th>
						<th>books</th>
					</tr>
					{data.allAuthors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<BirthForm authors={data.allAuthors} />
		</div>
	);
};

export default Authors;
