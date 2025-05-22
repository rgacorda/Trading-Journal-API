const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false in development
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: undefined
};

module.exports = cookieConfig;
