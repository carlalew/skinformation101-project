import axios from 'axios';
import { showAlert } from './alerts';

export const addProduct = async (brand, name, skinType, price, summary, description, coverImage) => {
    try{
    const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/products',
        data: {
            brand,
            name,
            skinType,
            price,
            summary,
            description,
            coverImage
        }
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Product Added Successfully!');
        window.setTimeout(() => {
            location.assign('/');
        }, 3000);
    }
} catch (err) {
    alert(err.response.data.message);
    }
};

export const deleteProduct = async () => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: 'http://127.0.0.1:3000/api/v1/products/:id'
      });
      if (res.data.status = 'success') {
        showAlert('success','Product Deleted!');
        window.setTimeout(() => {
            location.assign('/')
        }, 1000);
    };
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error deleting product! Try again.');
  }
};