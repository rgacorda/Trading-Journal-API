const isProduction = process.env.NODE_ENV === 'production';

const commonOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  domain: isProduction ? ".trade2learn.site" : undefined,
  path: '/',
};

const accessTokenCookieConfig = {
  ...commonOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieConfig = {
  ...commonOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
};
