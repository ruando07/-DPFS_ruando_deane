import axios from 'axios';

const registerUser = (userData) => axios.post('/api/users/register', userData);
const loginUser = (credentials) => axios.post('/api/users/login', credentials);

export { registerUser, loginUser };
