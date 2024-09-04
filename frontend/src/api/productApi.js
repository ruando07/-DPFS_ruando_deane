import axios from 'axios';

const getProducts = () => axios.get('/api/products');
const getProductById = (id) => axios.get(`/api/products/${id}`);

export { getProducts, getProductById };
