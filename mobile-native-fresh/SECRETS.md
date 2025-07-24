# Secrets Management

This project uses 1Password SecretKeeper Vault for all sensitive configuration.

## Setup

1. Install 1Password CLI: `brew install 1password-cli`
2. Sign in: `op signin`
3. Generate environment file: `op run --env-file env.template > .env`

## Environment Variables

All secrets are stored in the `tm-mobile-cursor` vault in 1Password and referenced via the `op://` protocol.

### Available Secrets

- **Slack**: Bot tokens, signing secrets, app tokens
- **Stripe**: API keys, webhook secrets
- **SendGrid**: API keys for email
- **Firebase**: Project configuration
- **OpenAI**: API keys for AI features
- **Database**: Connection strings
- **Ngrok**: API keys for tunneling

## Security

- Never commit `.env` files to Git
- All secrets are automatically rotated via 1Password
- Access is controlled through 1Password team management
- Secrets are encrypted at rest and in transit

## Development

```{ { { { bash
# Generate .env from 1Password & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
op run --env-file env.template > .env

# Run with secrets
op run --env-file .env -- { { { { npm start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

## Production

In production environments, use 1Password's integration with your deployment platform or container orchestration system. 