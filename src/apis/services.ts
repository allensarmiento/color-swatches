import axios from 'axios';

export const colorService = axios.create({
	baseURL: 'https://www.thecolorapi.com'
});
