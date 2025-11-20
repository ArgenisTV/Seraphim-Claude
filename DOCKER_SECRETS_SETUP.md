# Docker Secrets Setup Guide

This guide explains how to use Docker secrets to protect your credentials from being exposed via `docker inspect` or environment variable dumps.

## 🔒 Why Use Docker Secrets?

**Without Docker secrets:**
```bash
docker inspect seraphim-bot | grep -i token
# Your Discord token is visible in plaintext! 😱
```

**With Docker secrets:**
```bash
docker inspect seraphim-bot | grep -i token
# No credentials exposed! ✅
```

---

## 🚀 Quick Setup

### 1. Create Secrets Directory

```bash
mkdir -p ./secrets
```

### 2. Create Secret Files

Create one file per credential:

```bash
# Discord bot token
echo "YOUR_DISCORD_TOKEN_HERE" > ./secrets/discord_token.txt

# Discord application client ID
echo "YOUR_CLIENT_ID_HERE" > ./secrets/client_id.txt

# Lavalink password
echo "YOUR_LAVALINK_PASSWORD_HERE" > ./secrets/lavalink_password.txt
```

**Important:** Remove any trailing newlines or spaces!

### 3. Secure the Files

```bash
# Make files read-only for owner only
chmod 600 ./secrets/*.txt

# Make directory accessible only to owner
chmod 700 ./secrets
```

### 4. Add to .gitignore

**CRITICAL:** Never commit secrets to git!

```bash
echo "secrets/" >> .gitignore
```

### 5. Start with Secrets

Use the secrets-enabled compose file:

```bash
docker-compose -f docker-compose.secrets.yml up -d
```

---

## 🔄 Migrating from .env File

If you're currently using a `.env` file:

### Option 1: Create Secrets from .env

```bash
# Extract credentials from .env to secret files
mkdir -p ./secrets
grep DISCORD_TOKEN .env | cut -d '=' -f2 > ./secrets/discord_token.txt
grep CLIENT_ID .env | cut -d '=' -f2 > ./secrets/client_id.txt
grep LAVALINK_PASSWORD .env | cut -d '=' -f2 > ./secrets/lavalink_password.txt

# Secure the files
chmod 600 ./secrets/*.txt
chmod 700 ./secrets
```

### Option 2: Hybrid Approach

You can use both! The secrets manager checks secrets first, then falls back to environment variables:

1. Keep using `.env` for non-sensitive config (e.g., `DEFAULT_VOLUME`)
2. Move sensitive credentials to Docker secrets

---

## ✅ Verification

### Check that secrets are loaded:

```bash
docker-compose -f docker-compose.secrets.yml logs bot | grep "Loaded credentials"
```

You should see:
```
Loaded credentials from Docker secrets
```

### Verify credentials are NOT exposed:

```bash
# This should NOT show your token
docker inspect seraphim-bot | grep -i token

# This should NOT show your password
docker inspect seraphim-lavalink | grep -i password
```

---

## 🔐 Security Benefits

| Method | docker inspect | Memory Dumps | Process List | Git Exposure |
|--------|----------------|--------------|--------------|--------------|
| **Environment Variables** | ❌ Exposed | ❌ Exposed | ❌ Exposed | ⚠️ Risk if committed |
| **Docker Secrets** | ✅ Protected | ⚠️ Still in memory | ✅ Protected | ✅ Files in .gitignore |

**Note:** Credentials are always in memory while the application runs. Docker secrets prevent exposure through container metadata and process listings.

---

## 🛠️ Troubleshooting

### "Missing required secrets" error

**Problem:** Bot fails to start with secrets error

**Solution:** Verify secret files exist and have correct permissions:

```bash
ls -la ./secrets/
# Should show:
# -rw------- 1 user user ... discord_token.txt
# -rw------- 1 user user ... client_id.txt
# -rw------- 1 user user ... lavalink_password.txt
```

### Secrets have trailing newlines

**Problem:** Authentication fails due to whitespace in secrets

**Solution:** Remove trailing newlines:

```bash
# Use printf instead of echo (echo adds newline)
printf "YOUR_TOKEN_HERE" > ./secrets/discord_token.txt

# Or trim existing files
for file in ./secrets/*.txt; do
  tr -d '\n' < "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done
```

### Permission denied errors

**Problem:** Container can't read secret files

**Solution:** Fix permissions:

```bash
chmod 600 ./secrets/*.txt
chmod 700 ./secrets
```

---

## 🔄 Rotating Credentials

When you need to change credentials:

```bash
# 1. Update secret file
echo "NEW_TOKEN_HERE" > ./secrets/discord_token.txt

# 2. Restart containers
docker-compose -f docker-compose.secrets.yml restart bot

# No rebuild needed!
```

---

## 📋 Comparison: docker-compose.yml vs docker-compose.secrets.yml

### Standard (docker-compose.yml)
- ✅ Simple setup
- ✅ Works with .env files
- ❌ Credentials visible in `docker inspect`
- ⚠️ Suitable for development

### Secrets (docker-compose.secrets.yml)
- ✅ Enhanced security
- ✅ Credentials NOT visible in `docker inspect`
- ✅ Production-ready
- ⚠️ Slightly more setup

---

## 🎯 Best Practices

1. **Always use secrets in production**
2. **Never commit secret files to git**
3. **Use strong, unique passwords** (min 32 characters)
4. **Rotate credentials regularly** (every 90 days)
5. **Limit secret file permissions** (600 for files, 700 for directory)
6. **Backup secrets securely** (encrypted, separate from code)

---

## 🔗 Related Documentation

- [Docker Secrets Official Docs](https://docs.docker.com/engine/swarm/secrets/)
- [Discord Bot Token Security](https://discord.com/developers/docs/topics/oauth2#bot-vs-user-accounts)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Security Note:** Even with Docker secrets, credentials are still stored in plain text files on disk. For maximum security in production environments, consider using:
- **HashiCorp Vault**
- **AWS Secrets Manager**
- **Azure Key Vault**
- **Google Cloud Secret Manager**
