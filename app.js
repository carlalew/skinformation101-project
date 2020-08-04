const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const blogRouter = require('./routes/blogRoutes');
const viewRouter = require('./routes/viewsRoutes');
const consultationRouter = require('./routes/consultationRoutes');
const staffRouter = require('./routes/staffRoutes')
const cookieParser = require('cookie-parser');

const app = express();

// Set Pug as the template engine - most commonly used template engine with NodeJS. Pug also makes it easier and faster to write HTML code.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. GLOBAL Middlewares

// Serving static files - Static assists will be served from the 'Public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Setting Security HTTP Headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
}
// Limit the number of requests that can come from any single IP address
const limiter = rateLimit({
    max: 100, 
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this address!! Please try again later!'
});

app.use('/api', limiter); 

//Body Parser (reading data from body into req.body)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanatisation against NoSQL Query Injection and XSS attacks
app.use(mongoSanitize());
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
    'brand', 
    'skinType', 
    'price']
}));

app.use((req, res, next) => {
    next();
})

// Test middleware

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
    // console.log(req.cookies);
})

// 3. Routes
app.use('/', viewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/consultations', consultationRouter);
app.use('/api/v1/staff', staffRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;