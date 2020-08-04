import '@babel/polyfill';
import { signup } from './signup';
import { login, logout } from './login';
import { updateSettings } from './updateMe';
import { bookConsultation } from './consultations';
import { addProduct, deleteProduct } from './addNewProduct';
import { addBlog, deleteBlog } from './addNewBlog';

// DOM Elements

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const consultationForm = document.querySelector('.form--consultations');
const newProductForm = document.querySelector('.new-product-form');
const deleteProductButton = document.querySelector('.btn--delete');
const newBlogForm = document.querySelector('.form--new-blog');
const deleteBlogButton = document.querySelector('.btn--delete-blog');


// Sign Up

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name, email, password, confirmPassword);
  });

// Login / Out

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

// Update User Data

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new formData();
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])
    console.log(form);

    updateSettings(form, 'data');
  });


if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML = 'Updating...'

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent, password, confirmPassword}, 'password');

    document.querySelector('.btn--save-password').innerHTML = 'Save Password'
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// Book a Consultation

if (consultationForm)
  consultationForm.addEventListener('submit', e => {
    e.preventDefault()

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const skinConcern = document.getElementById('skinConcern').value;
    const currentRoutine = document.getElementById('currentRoutine').value;

    bookConsultation(name, email, phone, skinConcern, currentRoutine);
  });

  // Add a New Product

if (newProductForm)
  newProductForm.addEventListener('submit', e => {
    e.preventDefault();
    const brand = document.getElementById('brand').value;
    const name = document.getElementById('name').value;
    const skinType = document.getElementById('skinType').value;
    const price = document.getElementById('price').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const coverImage = document.getElementById('coverImage').value;
    addProduct(brand, name, skinType, price, summary, description, coverImage);
  });

  // Delete a Product
  
if (deleteProductButton) deleteProductButton.addEventListener('click', deleteProduct);

// Add a New Blog 

if (newBlogForm)
  newBlogForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const summary = document.getElementById('summary').value;
    const blogContent = document.getElementById('blogContent').value;
    const coverImage = document.getElementById('coverImage').value;
    addBlog(title, summary, blogContent, coverImage);
  });

  // Delete a Blog

if (deleteBlogButton) deleteBlogButton.addEventListener('click', deleteBlog);

