
const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    maxAge: 3600000, 
    sameSite: 'strict', 
};

module.exports = cookieConfig;
