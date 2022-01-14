import axios from 'axios';

const baseURL = 'http://localhost:6868';

const client = axios.create({
    baseURL,
    headers: {
        "Content-type": "application/json",
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default client;