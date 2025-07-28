const commonOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: "None", // lax is fine for same-origin but different ports
  // domain: undefined, // optional if needed for subdomains
  path: '/',
};

const accessTokenCookieConfig = {
  ...commonOptions,
  maxAge: 5 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieConfig = {
  ...commonOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
};
