import axios from 'axios';
import { showAlert } from './alerts';

export const addBlog = async (title, summary, blogContent, coverImage) => {
    try{
    const res = await axios({
        method: 'POST',
        url: '/api/v1/blogs',
        data: {
            title,
            summary,
            blogContent,
            coverImage
        }
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Blog Added Successfully!');
        window.setTimeout(() => {
            location.assign('/blogs');
        }, 3000);
    }
} catch (err) {
    alert(err.response.data.message);
    }
};

export const deleteBlog = async () => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: '/api/v1/blogs/:id'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Could not delete this product! Try again later!');
    }
};