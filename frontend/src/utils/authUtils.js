const getToken = () => localStorage.getItem('token');

const isAuthenticated = () => !!getToken();

export { getToken, isAuthenticated };
