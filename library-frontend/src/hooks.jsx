import { useState } from 'react';
export const useField = (type) => {
	const [value, setValue] = useState('');

	onChange = (event) => {
		setValue(event.target.value);
	};

	return {
		type,
		value,
		onChange,
	};
};
