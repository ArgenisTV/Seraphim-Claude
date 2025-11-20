/**
 * SSRF Protection
 *
 * Prevents Server-Side Request Forgery by blocking private IPs and cloud metadata endpoints
 */

const BLOCKED_IP_PATTERNS = [
  /^127\./,           // Loopback
  /^localhost$/i,
  /^10\./,            // Private: 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private: 172.16.0.0/12
  /^192\.168\./,      // Private: 192.168.0.0/16
  /^169\.254\./,      // Link-local
];

const BLOCKED_HOSTS = [
  '169.254.169.254',  // Cloud metadata (AWS, Azure, GCP, DigitalOcean)
  'metadata.google.internal',
  'metadata',
];

/**
 * Checks if a URL is safe to access
 *
 * @param {string} url - The URL to validate
 * @returns {Object} Object with 'safe' boolean and optional 'reason'
 */
export function isUrlSafe(url: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(url);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTP and HTTPS protocols allowed' };
    }

    const hostname = parsed.hostname?.toLowerCase();
    if (!hostname) {
      return { safe: false, reason: 'Invalid hostname' };
    }

    // Check blocked hosts
    if (BLOCKED_HOSTS.includes(hostname)) {
      return { safe: false, reason: 'Cloud metadata endpoint blocked' };
    }

    // Check private IPs
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return { safe: false, reason: 'Private IP address blocked' };
      }
    }

    return { safe: true };
  } catch (error) {
    return { safe: false, reason: 'Invalid URL format' };
  }
}
