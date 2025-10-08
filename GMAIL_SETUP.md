# Gmail OAuth2 Setup for Production

This guide explains how to set up Gmail OAuth2 for automated email sending without manually generating refresh tokens via OAuth Playground.

## Prerequisites

1. Google Cloud Console account
2. Gmail account for sending emails

## Initial Setup (One-Time)

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. **Enable Gmail API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - **User Type**: External
   - **App name**: Your app name (e.g., "Trading Journal")
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `https://mail.google.com/` or `https://www.googleapis.com/auth/gmail.send`
   - **Test users**: Add your Gmail account
4. Create OAuth client ID:
   - **Application type**: Web application
   - **Name**: "Trading Journal Backend"
   - **Authorized redirect URIs**: `http://localhost:3000/oauth/callback`
5. Download credentials or copy **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GMAIL_OAUTH_USER=your-gmail@gmail.com
GOOGLE_REFRESH_TOKEN=will-be-generated-next
NODE_ENV=production
```

### 4. Generate Refresh Token

Run the setup script:

```bash
npm run setup:gmail
```

This will:
1. Display an authorization URL
2. Open the URL in your browser
3. Sign in with your Gmail account
4. Grant permissions
5. Copy the authorization code from the URL
6. Paste it into the terminal
7. Receive your refresh token

Add the refresh token to your `.env` file.

## How It Works

The updated `sendMail.js` now:

1. Uses `googleapis` library to manage OAuth2 tokens
2. Automatically refreshes access tokens when they expire
3. Uses the refresh token to get new access tokens on-demand
4. No manual intervention needed after initial setup

## Production Deployment

### Environment Variables

Ensure these are set in your production environment:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GMAIL_OAUTH_USER`
- `NODE_ENV=production`

### Security Notes

1. **Never commit** `.env` file to version control
2. **Keep refresh token secret** - it doesn't expire unless revoked
3. Use environment variable management (Railway, Heroku Config Vars, AWS Secrets Manager, etc.)
4. Rotate credentials periodically for security

## Troubleshooting

### "Invalid grant" error
- Refresh token may be expired or revoked
- Re-run `npm run setup:gmail` to generate a new one

### "Access blocked" error
- Ensure your app is verified in Google Cloud Console
- Add your email as a test user in OAuth consent screen

### "Insufficient permissions" error
- Check that Gmail API is enabled
- Verify scopes include `https://mail.google.com/`

## Token Lifespan

- **Access Token**: Expires after 1 hour (automatically refreshed)
- **Refresh Token**: Doesn't expire (unless revoked or unused for 6 months)

## Benefits Over OAuth Playground

✅ Automated token refresh
✅ No manual token generation every time
✅ Production-ready authentication flow
✅ Better security practices
✅ Scalable for multiple environments
