import axios from 'axios';
import { showAlert } from './alerts';

export const bookConsultation = async (name, email, phone, skinConcern, currentRoutine) => {
    try{
    const res = await axios({
        method: 'POST',
        url: '/api/v1/consultations/book-consulation',
        data: {
            name,
            email,
            phone,
            skinConcern,
            currentRoutine
        }
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Consultation booked successfully! A member of our team will be in touch within 24 hours.');
        window.setTimeout(() => {
            location.assign('/');
        }, 3000);
    }
} catch (err) {
    showAlert('error', err.response.data.message);
    }
};