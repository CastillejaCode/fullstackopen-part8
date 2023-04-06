import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR } from '../queries';
import { ALL_AUTHORS } from '../queries';

const BirthForm = ({ authors }) => {
	const [editYear] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	const submit = (event) => {
		event.preventDefault();
		const name = event.target.names.value;
		const setBornTo = parseInt(event.target.year.value);
		editYear({ variables: { name, setBornTo } });
		event.target.names.value = '';
		event.target.year.value = '';
	};

	return (
		<div>
			<h2>Set BirthYear</h2>
			<form action='' onSubmit={submit}>
				<select name='names' id='names'>
					{authors.map((author) => {
						return (
							<option key={author.name} value={author.name}>
								{author.name}
							</option>
						);
					})}
				</select>
				<div>
					year
					<input type='number' name='year' />
				</div>
				<button type='submit'>Submit</button>
			</form>
		</div>
	);
};

export default BirthForm;
