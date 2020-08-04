import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, confirmPassword) => {
    try{
    const res = await axios({
        method: 'POST',
        url: '/api/v1/users/signup',
        data: {
            name,
            email,
            password,
            confirmPassword
        }
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Registered successfully! Welcome to Skinformation101!');
        window.setTimeout(() => {
            location.assign('/about');
        }, 3000);
    }
} catch (err) {
    alert(err.response.data.message);
    }
};