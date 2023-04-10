import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ setToken }) => {
	const [login, result] = useMutation(LOGIN);

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			setToken(token);
			localStorage.setItem('token', token);
		}
	}, [result.data]);

	const submit = async (event) => {
		event.preventDefault();
		const username = event.target.username.value;
		const password = event.target.pwd.value;

		login({ variables: { username, password } });
		event.target.username.value = '';
		event.target.pwd.value = '';
	};

	return (
		<div>
			<form action='' onSubmit={submit}>
				<label>
					username
					<input type='text' name='username' />
				</label>
				<label>
					password
					<input type='text' name='pwd' />
				</label>
				<button type='submit'>Submit</button>
			</form>
			<div>
				username: test <br />
				password: password
			</div>
		</div>
	);
};

export default LoginForm;
