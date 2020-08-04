const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env. JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        // The cookie should not be able to be manipulated in the browser in any way - set httpOnly to true
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    // Log User In
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync (async (req, res, next) => {
    const { email, password } = req.body;

    // 1. check if email and password exist
    if (!email || !password) {
       return next(new AppError('Please provide your email address and password', 400));
    }

    // 2. check if user exists and password correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next( new AppError ('Invalid email or password!', 404));
    }

    console.log(user);

    // 3. if all okay, send JWT back to client
    createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
   // 1. Get the JWT and check if it exists
   let token;
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access!', 401));
    }
   // 2. Verify the JWT
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   console.log(decoded);

   // 3. Check if user exists
   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
       return next(new AppError('This user no longer exists!', 401))
   }
   // 4. Check if password has been updated since JWT was issued
   if (currentUser.changedPasswordAfter(decoded.iat)) {
       return next(new AppError('Password has been updated! Please log in again!', 401)
       );
   }

   // Grant access to protected route
   req.user = currentUser;
   res.locals.user = currentUser;
    next();
});


// Only for rendered pages, no errors.
exports.LoginStatus = async (req, res, next) => {
    // 1. Get the JWT and check if it exists
    if(req.cookies.jwt) {
        try {
    // Verify the token
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt, 
            process.env.JWT_SECRET
            ); 
    // 3. Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next();
    }
    // 4. Check if password has been updated since JWT was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
    };
 
    // There is a logged in user
    res.locals.user = currentUser;
    return next();
    } catch (err) {
        return next();
    }
}
    next();
 };

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array 
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorised to perform this action!', 403));
        }
        next();
    };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1. Get the user 
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if the posted password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is incorrect!', 401));
    }
    // 3. If so, update the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword; 
    await user.save();

    // 4. Log the user in
    createSendToken(user, 200, res);
});