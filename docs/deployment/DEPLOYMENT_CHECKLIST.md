# Deployment Checklist

Use this checklist before deploying to production.

---

## ☐ Pre-Deployment Checks

### Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `DISCORD_TOKEN` set (from Discord Developer Portal)
- [ ] `CLIENT_ID` set (from Discord Developer Portal)
- [ ] `LAVALINK_PASSWORD` set (secure random password, not default)
- [ ] `DEFAULT_VOLUME` validated (0-100)
- [ ] Optional: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` configured

### Lavalink Configuration
- [ ] `lavalink/application.yml` uses environment variable for password
- [ ] YouTube plugin v1.16.0 downloaded to `lavalink/plugins/`
- [ ] Old YouTube plugin v1.5.2 removed (if exists)
- [ ] Audio quality set to `MEDIUM` or higher
- [ ] Plugin repository configured correctly

### Docker Configuration
- [ ] Docker installed and running (`docker --version`)
- [ ] Docker Compose installed (`docker-compose --version`)
- [ ] Sufficient disk space (2GB+ free)
- [ ] Sufficient RAM (2GB+ available)
- [ ] `docker-compose.yml` uses environment variables (no hardcoded passwords)
- [ ] Health checks configured for Lavalink

### Code & Dependencies
- [ ] All critical fixes applied (see `CRITICAL_FIXES_SUMMARY.md`)
- [ ] No hardcoded credentials in code
- [ ] TypeScript compiles without errors (if building locally)
- [ ] `.gitignore` includes `.env` file
- [ ] `.dockerignore` optimized

---

## ☐ Deployment Steps

### Build & Start
- [ ] Run deployment script (`./deploy.sh` or `deploy.bat`)
- [ ] OR manually: `docker-compose build --no-cache`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify services running: `docker-compose ps`

### Verify Services
- [ ] Lavalink shows "healthy" status
- [ ] Bot shows "Up" status
- [ ] Lavalink logs show successful plugin loading
- [ ] Bot logs show "Logged in as [BotName]"
- [ ] Bot logs show "Lavalink connection initialized"

### Test Functionality
- [ ] Bot appears online in Discord
- [ ] Slash commands registered (`/play`, `/pause`, `/skip`, etc.)
- [ ] `/play never gonna give you up` works
- [ ] `/play [YouTube URL]` works
- [ ] `/play [Spotify URL]` works (or falls back to YouTube)
- [ ] `/pause` and `/skip` work
- [ ] `/queue` displays correctly
- [ ] Bot joins voice channel successfully
- [ ] Audio plays without issues

---

## ☐ Post-Deployment Verification

### Logs & Monitoring
- [ ] No errors in bot logs: `docker-compose logs bot | grep -i error`
- [ ] No errors in Lavalink logs: `docker-compose logs lavalink | grep -i error`
- [ ] Memory usage acceptable (<500MB for bot, <1.5GB for Lavalink)
- [ ] CPU usage acceptable (<20% idle, <80% under load)

### Security Verification
- [ ] No passwords visible in logs
- [ ] No passwords committed to git: `git log -S "youshallnotpass"`
- [ ] `.env` file in `.gitignore`
- [ ] Lavalink port not exposed to internet (only internal Docker network)
- [ ] Strong password used for LAVALINK_PASSWORD

### Performance Checks
- [ ] Music plays without stuttering
- [ ] Commands respond within 3 seconds
- [ ] No memory leaks after 1 hour of operation
- [ ] Bot reconnects automatically if disconnected
- [ ] Multiple guilds work simultaneously (if applicable)

---

## ☐ Production Readiness

### Documentation
- [ ] README.md reviewed
- [ ] DOCKER_DEPLOYMENT.md reviewed
- [ ] SPOTIFY_SETUP.md reviewed (if using Spotify)
- [ ] Team knows how to view logs
- [ ] Team knows how to restart services
- [ ] Troubleshooting guide accessible

### Backup & Recovery
- [ ] `.env` file backed up securely
- [ ] `lavalink/application.yml` backed up
- [ ] Lavalink plugins backed up
- [ ] Recovery procedure documented
- [ ] Team knows how to restore from backup

### Monitoring & Alerts
- [ ] Log monitoring configured (optional)
- [ ] Resource monitoring configured (optional)
- [ ] Alert system configured (optional)
- [ ] On-call person designated
- [ ] Incident response plan ready

### Maintenance Plan
- [ ] Update schedule defined (weekly/monthly)
- [ ] Backup schedule defined
- [ ] Log rotation configured
- [ ] Disk space monitoring enabled
- [ ] Team trained on common issues

---

## ☐ Optional Enhancements

### Spotify Integration
- [ ] Spotify Developer App created
- [ ] Client ID and Secret obtained
- [ ] Credentials added to `.env`
- [ ] Spotify URLs tested
- [ ] Spotify playlists tested

### Advanced Features
- [ ] Multiple Lavalink nodes configured (high availability)
- [ ] Load balancing configured
- [ ] Auto-scaling configured
- [ ] CDN configured for faster audio delivery
- [ ] Metrics/Prometheus enabled

### User Support
- [ ] Bot invite link created
- [ ] Permission requirements documented
- [ ] Support channel created in Discord
- [ ] FAQ prepared for common questions
- [ ] Command help messages clear

---

## ☐ Go-Live Checklist

### Final Verification (Do Immediately Before Launch)
- [ ] All services running
- [ ] All tests passing
- [ ] No errors in logs (last 50 lines)
- [ ] Bot responding to commands
- [ ] Music playback working
- [ ] Team notified of launch
- [ ] Rollback plan ready

### Post-Launch (Within 1 Hour)
- [ ] Monitor logs for errors
- [ ] Check memory/CPU usage
- [ ] Verify auto-restart works
- [ ] Test from multiple guilds
- [ ] Collect user feedback
- [ ] Document any issues

### Post-Launch (Within 24 Hours)
- [ ] No crashes reported
- [ ] Memory usage stable
- [ ] CPU usage acceptable
- [ ] User satisfaction high
- [ ] No security issues
- [ ] Performance acceptable
- [ ] Document lessons learned

---

## 🚨 Rollback Plan

If deployment fails:

1. **Stop Services**
   ```bash
   docker-compose down
   ```

2. **Restore Backup** (if applicable)
   ```bash
   cp .env.backup .env
   cp lavalink/application.yml.backup lavalink/application.yml
   ```

3. **Revert Code** (if needed)
   ```bash
   git reset --hard [previous-commit]
   ```

4. **Restart Services**
   ```bash
   docker-compose up -d
   ```

5. **Verify Rollback**
   ```bash
   docker-compose logs -f
   ```

6. **Investigate Issue**
   - Check logs
   - Review changes
   - Test in dev environment
   - Fix issues
   - Re-deploy

---

## ✅ Deployment Status

**Date:** ________________

**Deployed By:** ________________

**Version:** ________________

**All Checks Passed:** ☐ Yes ☐ No

**Production Ready:** ☐ Yes ☐ No

**Notes:**
_______________________________________
_______________________________________
_______________________________________

**Sign-off:** ________________

---

## 📞 Emergency Contacts

**Bot Admin:** ________________

**DevOps Lead:** ________________

**On-Call:** ________________

**Emergency Procedure:**
1. Check logs: `docker-compose logs -f`
2. Restart if needed: `docker-compose restart`
3. Contact admin if issue persists

---

**Last Updated:** November 19, 2025
**Document Version:** 1.0
