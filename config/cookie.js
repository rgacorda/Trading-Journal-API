const commonOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: "lax", // lax is fine for same-origin but different ports
  secure: false,  
  // domain: undefined, // optional if needed for subdomains
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
