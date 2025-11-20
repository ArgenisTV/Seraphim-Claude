/**
 * SSRF Protection Utilities
 *
 * Provides protection against Server-Side Request Forgery (SSRF) attacks
 * by validating URLs and blocking access to private networks and cloud metadata endpoints.
 */

/**
 * Private IP ranges and blocked patterns (RFC 1918, RFC 4193, RFC 3927)
 *
 * Blocks access to:
 * - Loopback addresses (127.0.0.0/8, ::1)
 * - Private networks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 * - Link-local addresses (169.254.0.0/16, fe80::/10)
 * - IPv6 unique local addresses (fc00::/7)
 */
const BLOCKED_IP_PATTERNS = [
  // IPv4 Loopback
  /^127\./,
  /^localhost$/i,

  // IPv4 Private Networks (RFC 1918)
  /^10\./,                           // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16

  // IPv4 Link-local (RFC 3927)
  /^169\.254\./,                     // 169.254.0.0/16

  // IPv6 Loopback
  /^::1$/,
  /^0:0:0:0:0:0:0:1$/,

  // IPv6 Link-local (fe80::/10)
  /^fe80:/i,

  // IPv6 Unique Local Addresses (fc00::/7)
  /^fc00:/i,
  /^fd00:/i,
];

/**
 * Cloud metadata endpoints that must be blocked
 *
 * These endpoints expose sensitive cloud provider metadata and credentials
 * to instances running in cloud environments.
 */
const BLOCKED_HOSTS = [
  // AWS, Azure, GCP, DigitalOcean, Oracle Cloud metadata
  '169.254.169.254',

  // GCP metadata DNS name
  'metadata.google.internal',
  'metadata',

  // Alibaba Cloud
  '100.100.100.200',

  // Alternative metadata IPs
  'fd00:ec2::254',  // AWS IPv6 metadata
];

/**
 * Checks if a URL is safe to access (not targeting internal networks or metadata endpoints)
 *
 * @param {string} url - The URL to validate
 * @returns {Object} Object with 'safe' boolean and optional 'reason' for rejection
 *
 * @example
 * const check = isUrlSafe('http://10.0.0.1');
 * // Returns: { safe: false, reason: 'Private IP address not allowed' }
 *
 * @example
 * const check = isUrlSafe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * // Returns: { safe: true }
 */
export function isUrlSafe(url: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(url);

    // Only allow HTTP and HTTPS protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        safe: false,
        reason: 'Only HTTP and HTTPS protocols are allowed',
      };
    }

    const hostname = parsed.hostname?.toLowerCase();
    if (!hostname) {
      return {
        safe: false,
        reason: 'Invalid or missing hostname',
      };
    }

    // Check against blocked hosts list
    if (BLOCKED_HOSTS.includes(hostname)) {
      return {
        safe: false,
        reason: 'Access to cloud metadata endpoints is forbidden',
      };
    }

    // Check against private IP patterns
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return {
          safe: false,
          reason: 'Private IP addresses and internal networks are not allowed',
        };
      }
    }

    // Additional check: Reject URLs with authentication in them (user:pass@host)
    if (parsed.username || parsed.password) {
      return {
        safe: false,
        reason: 'URLs with embedded credentials are not allowed',
      };
    }

    // Additional check: Reject non-standard ports that might be used for port scanning
    const port = parsed.port;
    if (port) {
      const portNum = parseInt(port, 10);
      // Allow common web ports
      const allowedPorts = [80, 443, 8080, 8443];
      if (!allowedPorts.includes(portNum)) {
        return {
          safe: false,
          reason: 'Non-standard ports are not allowed',
        };
      }
    }

    return { safe: true };
  } catch (error) {
    return {
      safe: false,
      reason: 'Invalid URL format',
    };
  }
}

/**
 * Validates that a hostname is not an IP address (helps prevent IP-based SSRF)
 *
 * @param {string} hostname - The hostname to check
 * @returns {boolean} True if hostname is not an IP address
 *
 * @example
 * isHostnameNotIp('example.com') // true
 * isHostnameNotIp('192.168.1.1') // false
 */
export function isHostnameNotIp(hostname: string): boolean {
  // Simple check for IPv4 addresses
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;

  // Simple check for IPv6 addresses (basic pattern)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  return !ipv4Pattern.test(hostname) && !ipv6Pattern.test(hostname);
}
