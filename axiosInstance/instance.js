import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.bachduong.app',
    headers: {
        "Content-Type": "application/json"
    }
});

export default instance;
