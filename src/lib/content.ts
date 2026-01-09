// Blog/article content for each tool
export interface Article {
	id: string;
	title: string;
	description: string;
	content: string; // Markdown content
	tags: string[];
}

export interface ToolContent {
	toolId: string;
	articles: Article[];
}

export const toolContent: Record<string, ToolContent> = {
	// ==================== ENCODING TOOLS ====================
	base64: {
		toolId: "base64",
		articles: [
			{
				id: "what-is-base64",
				title: "What is Base64 Encoding?",
				description:
					"Understanding Base64 encoding, how it works, and why it's essential for web development.",
				tags: ["basics", "encoding", "web"],
				content: `
## What is Base64?

Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's called "Base64" because it uses 64 different characters to represent data: A-Z, a-z, 0-9, +, and /.

### Why Do We Need Base64?

Many systems were designed to handle text, not binary data. Email protocols, HTML, CSS, and URLs all have limitations on what characters they can safely transmit. Base64 solves this by converting binary data into a safe text format.

### Common Use Cases

- **Data URLs**: Embedding images directly in HTML/CSS
- **Email attachments**: MIME encoding for binary files
- **API authentication**: Basic Auth headers use Base64
- **Storing binary in JSON/XML**: These formats only support text

### How Base64 Works

1. Take the binary input
2. Split into 6-bit chunks (2^6 = 64 possible values)
3. Map each chunk to one of 64 characters
4. Pad with "=" if the input isn't divisible by 3 bytes

### Size Consideration

Base64 encoded data is approximately 33% larger than the original. This is because 3 bytes of binary become 4 bytes of Base64 text.

\`\`\`javascript
// Example: Encoding a string
const encoded = btoa("Hello, World!");
// Result: "SGVsbG8sIFdvcmxkIQ=="

const decoded = atob("SGVsbG8sIFdvcmxkIQ==");
// Result: "Hello, World!"
\`\`\`
`,
			},
			{
				id: "base64-in-javascript",
				title: "Working with Base64 in JavaScript",
				description:
					"Complete guide to encoding and decoding Base64 in JavaScript, including handling Unicode and binary data.",
				tags: ["javascript", "tutorial", "code"],
				content: `
## Base64 in JavaScript

JavaScript provides built-in functions for Base64 encoding, but there are important nuances to understand.

### Built-in Functions

\`\`\`javascript
// Encoding
const encoded = btoa("Hello"); // "SGVsbG8="

// Decoding  
const decoded = atob("SGVsbG8="); // "Hello"
\`\`\`

### The Unicode Problem

\`btoa()\` only works with ASCII characters. For Unicode text, you need extra steps:

\`\`\`javascript
// Encoding Unicode
function encodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode('0x' + p1)
  ));
}

// Decoding Unicode
function decodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(
    c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
}
\`\`\`

### Modern Approach with TextEncoder

\`\`\`javascript
// Encoding with TextEncoder (handles Unicode properly)
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, b => 
    String.fromCodePoint(b)
  ).join("");
  return btoa(binString);
}

// Decoding
function fromBase64(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, c => 
    c.codePointAt(0)
  );
  return new TextDecoder().decode(bytes);
}
\`\`\`

### Working with Files

\`\`\`javascript
// Convert File to Base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

// Usage
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const base64 = await fileToBase64(e.target.files[0]);
  console.log(base64); // "data:image/png;base64,iVBORw0..."
});
\`\`\`
`,
			},
			{
				id: "base64-security",
				title: "Base64 is NOT Encryption",
				description:
					"A critical security reminder: Base64 encoding provides zero security. Understanding why and what to use instead.",
				tags: ["security", "important", "best-practices"],
				content: `
## Base64 is NOT Security

One of the most common misconceptions in web development is that Base64 provides some form of security. **It does not.**

### What Base64 Actually Does

Base64 is an **encoding** scheme, not **encryption**. The difference is crucial:

- **Encoding**: Transforms data format (reversible by anyone)
- **Encryption**: Secures data with a key (only reversible with the key)

### A Dangerous Example

\`\`\`javascript
// NEVER DO THIS
const password = "secretpassword123";
const "secured" = btoa(password); 
// "c2VjcmV0cGFzc3dvcmQxMjM="

// Anyone can decode this instantly
atob("c2VjcmV0cGFzc3dvcmQxMjM=");
// "secretpassword123"
\`\`\`

### Real-World Vulnerabilities

1. **Basic Auth headers** - Credentials are Base64 encoded, not encrypted
2. **JWT tokens** - The payload is just Base64, anyone can read it
3. **"Hidden" API keys** - Base64 in source code is not hidden

### What to Use Instead

For actual security, use proper cryptographic methods:

\`\`\`javascript
// For passwords: Use hashing (server-side)
// bcrypt, Argon2, or PBKDF2

// For sensitive data: Use encryption
const subtle = window.crypto.subtle;

async function encrypt(plaintext, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  
  return { ciphertext, iv };
}
\`\`\`

### When Base64 IS Appropriate

- Embedding binary data in text formats
- Data URLs for images
- Transferring binary over text-only protocols
- Making binary data URL-safe (with Base64URL variant)
`,
			},
		],
	},

	url: {
		toolId: "url",
		articles: [
			{
				id: "url-encoding-explained",
				title: "URL Encoding Explained",
				description:
					"Why URLs need encoding, which characters must be escaped, and how percent-encoding works.",
				tags: ["basics", "web", "http"],
				content: `
## Why URLs Need Encoding

URLs can only contain a limited set of characters from the ASCII character set. When you need to include special characters, spaces, or non-ASCII characters in a URL, they must be encoded.

### Reserved Characters

These characters have special meaning in URLs:

| Character | Purpose |
|-----------|---------|
| \`/\` | Path separator |
| \`?\` | Query string start |
| \`&\` | Parameter separator |
| \`=\` | Key-value separator |
| \`#\` | Fragment identifier |
| \`:\` | Scheme separator |
| \`@\` | User info separator |

### How Percent-Encoding Works

Each unsafe character is replaced with \`%\` followed by its hexadecimal ASCII value:

- Space → \`%20\`
- \`&\` → \`%26\`
- \`=\` → \`%3D\`
- \`?\` → \`%3F\`

### Example

\`\`\`
Original: https://example.com/search?q=hello world&lang=en
Encoded:  https://example.com/search?q=hello%20world&lang=en
\`\`\`

### Common Gotchas

1. **Spaces**: Can be \`%20\` or \`+\` (in query strings only)
2. **Double encoding**: Encoding already-encoded strings creates bugs
3. **UTF-8**: Non-ASCII characters are first converted to UTF-8 bytes, then percent-encoded
`,
			},
			{
				id: "javascript-url-functions",
				title: "JavaScript URL Encoding Functions",
				description:
					"Understanding encodeURI vs encodeURIComponent and when to use each.",
				tags: ["javascript", "tutorial", "code"],
				content: `
## JavaScript URL Functions

JavaScript provides four functions for URL encoding/decoding, and using the wrong one is a common source of bugs.

### encodeURI vs encodeURIComponent

| Function | Encodes | Use Case |
|----------|---------|----------|
| \`encodeURI\` | Spaces, non-ASCII | Full URLs |
| \`encodeURIComponent\` | All special chars | URL parameters |

### encodeURI

Use for encoding complete URLs. Preserves URL structure characters.

\`\`\`javascript
encodeURI("https://example.com/path with spaces")
// "https://example.com/path%20with%20spaces"

// Does NOT encode: ; / ? : @ & = + $ , #
encodeURI("https://example.com?name=John&age=30")
// "https://example.com?name=John&age=30" (unchanged)
\`\`\`

### encodeURIComponent

Use for encoding values to be placed IN a URL. Encodes everything except alphanumeric and \`- _ . ! ~ * ' ( )\`.

\`\`\`javascript
encodeURIComponent("hello world")
// "hello%20world"

encodeURIComponent("name=John&age=30")
// "name%3DJohn%26age%3D30"

// Building a URL with user input
const userQuery = "cats & dogs";
const url = \`https://api.com/search?q=\${encodeURIComponent(userQuery)}\`;
// "https://api.com/search?q=cats%20%26%20dogs"
\`\`\`

### The URL API (Modern Approach)

\`\`\`javascript
// Building URLs safely
const url = new URL("https://example.com/search");
url.searchParams.set("q", "cats & dogs");
url.searchParams.set("page", "1");

console.log(url.toString());
// "https://example.com/search?q=cats+%26+dogs&page=1"

// Parsing URLs
const parsed = new URL("https://example.com/path?name=John");
console.log(parsed.hostname);     // "example.com"
console.log(parsed.pathname);     // "/path"
console.log(parsed.searchParams.get("name")); // "John"
\`\`\`
`,
			},
			{
				id: "url-encoding-security",
				title: "URL Encoding and Security",
				description:
					"How improper URL encoding leads to security vulnerabilities like XSS and injection attacks.",
				tags: ["security", "xss", "best-practices"],
				content: `
## URL Encoding Security

Improper URL encoding is a common source of security vulnerabilities. Understanding these risks is essential for web developers.

### Injection Attacks

Without proper encoding, attackers can inject malicious content:

\`\`\`javascript
// VULNERABLE: Direct string concatenation
const userInput = "'; DROP TABLE users; --";
const url = \`/api/search?q=\${userInput}\`;
// Could lead to SQL injection if backend doesn't sanitize

// SAFE: Proper encoding
const url = \`/api/search?q=\${encodeURIComponent(userInput)}\`;
\`\`\`

### XSS via URLs

URLs in HTML attributes need careful handling:

\`\`\`javascript
// VULNERABLE
const link = \`<a href="\${userUrl}">Click</a>\`;
// Attacker could inject: javascript:alert('xss')

// SAFE: Validate URL scheme
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
\`\`\`

### Open Redirect Vulnerabilities

\`\`\`javascript
// VULNERABLE: Unvalidated redirect
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url); // Attacker: ?url=https://evil.com
});

// SAFE: Whitelist allowed domains
const allowedDomains = ['example.com', 'api.example.com'];

function isAllowedRedirect(url) {
  try {
    const parsed = new URL(url);
    return allowedDomains.includes(parsed.hostname);
  } catch {
    return false;
  }
}
\`\`\`

### Best Practices

1. Always use \`encodeURIComponent\` for user input in URLs
2. Use the URL API instead of string concatenation
3. Validate URL schemes (http/https only)
4. Whitelist allowed redirect domains
5. Never trust URL parameters without validation
`,
			},
		],
	},

	jwt: {
		toolId: "jwt",
		articles: [
			{
				id: "what-is-jwt",
				title: "Understanding JSON Web Tokens (JWT)",
				description:
					"A comprehensive guide to JWTs: what they are, how they work, and their role in modern authentication.",
				tags: ["basics", "authentication", "security"],
				content: `
## What is a JWT?

JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. JWTs are commonly used for authentication and information exchange.

### JWT Structure

A JWT consists of three parts separated by dots:

\`\`\`
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
\`\`\`

### 1. Header

Contains the token type and signing algorithm:

\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### 2. Payload

Contains the claims (statements about the user and metadata):

\`\`\`json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

### 3. Signature

Verifies the token hasn't been tampered with:

\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
\`\`\`

### Standard Claims

| Claim | Name | Description |
|-------|------|-------------|
| \`iss\` | Issuer | Who created the token |
| \`sub\` | Subject | Who the token is about |
| \`aud\` | Audience | Who the token is for |
| \`exp\` | Expiration | When the token expires |
| \`iat\` | Issued At | When the token was created |
| \`nbf\` | Not Before | Token not valid before this time |

### Why Use JWTs?

1. **Stateless**: Server doesn't need to store session data
2. **Scalable**: Works across multiple servers
3. **Mobile-friendly**: Easy to use in native apps
4. **Cross-domain**: Can be used across different domains
`,
			},
			{
				id: "jwt-security-best-practices",
				title: "JWT Security Best Practices",
				description:
					"Critical security considerations when implementing JWT authentication in your applications.",
				tags: ["security", "best-practices", "authentication"],
				content: `
## JWT Security Best Practices

JWTs are powerful but come with security considerations. Follow these practices to keep your implementation secure.

### 1. Use Strong Secrets

\`\`\`javascript
// BAD: Weak secret
const secret = "password123";

// GOOD: Strong, random secret (256 bits minimum)
const secret = crypto.randomBytes(32).toString('hex');
\`\`\`

### 2. Always Validate Tokens

\`\`\`javascript
// Verify signature, expiration, and issuer
const jwt = require('jsonwebtoken');

try {
  const decoded = jwt.verify(token, secret, {
    algorithms: ['HS256'], // Specify allowed algorithms
    issuer: 'your-app',
    audience: 'your-api',
  });
} catch (err) {
  // Token invalid - reject request
}
\`\`\`

### 3. Set Short Expiration Times

\`\`\`javascript
// Access tokens: 15 minutes
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Use refresh tokens for longer sessions
const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
\`\`\`

### 4. Never Store Sensitive Data in Payload

The payload is only Base64 encoded, not encrypted:

\`\`\`javascript
// BAD: Sensitive data exposed
{
  "userId": 123,
  "password": "secret",      // NEVER do this
  "creditCard": "4111..."    // NEVER do this
}

// GOOD: Only store references
{
  "userId": 123,
  "role": "admin"
}
\`\`\`

### 5. Protect Against Algorithm Confusion

\`\`\`javascript
// Always specify allowed algorithms
jwt.verify(token, secret, { algorithms: ['HS256'] });

// Reject tokens with "alg": "none"
\`\`\`

### 6. Secure Token Storage (Frontend)

\`\`\`javascript
// For web apps: HttpOnly cookies (preferred)
// Protects against XSS attacks

// If using localStorage (less secure):
// - Never store refresh tokens
// - Implement CSRF protection
\`\`\`

### 7. Implement Token Revocation

Since JWTs are stateless, implement a blacklist for revoked tokens:

\`\`\`javascript
const revokedTokens = new Set();

function isRevoked(token) {
  const { jti } = jwt.decode(token);
  return revokedTokens.has(jti);
}
\`\`\`
`,
			},
			{
				id: "jwt-vs-sessions",
				title: "JWT vs Session-Based Authentication",
				description:
					"Comparing JWTs with traditional session-based authentication to help you choose the right approach.",
				tags: ["architecture", "comparison", "authentication"],
				content: `
## JWT vs Sessions: Which Should You Use?

Both approaches have their place. Understanding the tradeoffs helps you make the right choice.

### Session-Based Authentication

\`\`\`
Client                    Server
  |                         |
  |-- Login credentials --> |
  |                         | Create session in DB
  |<-- Session cookie ----  |
  |                         |
  |-- Request + cookie -->  |
  |                         | Lookup session in DB
  |<-- Response ----------  |
\`\`\`

**Pros:**
- Easy to revoke (delete from DB)
- Session data stays on server
- Battle-tested approach

**Cons:**
- Requires database lookup per request
- Harder to scale horizontally
- Sticky sessions may be needed

### JWT Authentication

\`\`\`
Client                    Server
  |                         |
  |-- Login credentials --> |
  |                         | Create & sign JWT
  |<-- JWT token ---------  |
  |                         |
  |-- Request + JWT ----->  |
  |                         | Verify signature only
  |<-- Response ----------  |
\`\`\`

**Pros:**
- Stateless - no DB lookup needed
- Scales horizontally easily
- Works across microservices
- Good for mobile/SPAs

**Cons:**
- Can't easily revoke tokens
- Token size larger than session ID
- Complexity in refresh token handling

### When to Use Sessions

- Traditional server-rendered apps
- When you need instant revocation
- Simpler applications
- When you already have session infrastructure

### When to Use JWTs

- Microservices architecture
- Mobile applications
- Single Page Applications (SPAs)
- Cross-domain authentication
- When horizontal scaling is important

### Hybrid Approach

Many apps use both:

\`\`\`javascript
// Short-lived JWT for API access (15 min)
// Server-side session for refresh tokens

// On API request: Validate JWT (no DB)
// On token refresh: Check session (DB lookup)
// On logout: Invalidate session (blocks refresh)
\`\`\`
`,
			},
		],
	},

	qr: {
		toolId: "qr",
		articles: [
			{
				id: "history-of-qr-codes",
				title: "The History of QR Codes",
				description:
					"From Toyota factories to global ubiquity: the fascinating origin story of QR codes.",
				tags: ["history", "basics"],
				content: `
## The History of QR Codes

QR codes are everywhere today, but their origin story begins in an unexpected place: automotive manufacturing.

### Birth at Denso Wave (1994)

QR codes were invented by Masahiro Hara and his team at Denso Wave, a Toyota subsidiary, in 1994. The goal was to track vehicle parts during manufacturing.

### Why Barcodes Weren't Enough

Traditional barcodes had limitations:
- Only held ~20 characters
- Required precise alignment to scan
- Couldn't handle Japanese characters (Kanji)

### The QR Solution

QR (Quick Response) codes solved these problems:
- Store up to 7,089 numeric characters
- Can be read from any angle
- Support multiple character sets
- Include error correction

### Key Milestones

| Year | Event |
|------|-------|
| 1994 | QR code invented by Denso Wave |
| 1997 | AIM International standard approved |
| 2000 | ISO standard (ISO/IEC 18004) published |
| 2002 | Camera phones with QR readers launch in Japan |
| 2010 | Smartphone adoption drives global awareness |
| 2017 | iOS adds native QR scanner to Camera app |
| 2020 | COVID-19 accelerates contactless QR adoption |

### Open Standard Decision

Denso Wave made a crucial decision: they held the patent but made the technology freely available. This open approach enabled global adoption.

### Modern Ubiquity

Today QR codes are used for:
- Mobile payments (WeChat Pay, Alipay)
- Restaurant menus
- Product information
- Authentication (2FA)
- COVID vaccination records
- Event tickets
- WiFi sharing
`,
			},
			{
				id: "how-qr-codes-work",
				title: "How QR Codes Work: Technical Deep Dive",
				description:
					"Understanding the structure, encoding, and error correction that makes QR codes reliable.",
				tags: ["technical", "encoding", "deep-dive"],
				content: `
## How QR Codes Work

QR codes pack a lot of engineering into those black and white squares. Let's explore how they actually work.

### QR Code Structure

A QR code contains several functional regions:

\`\`\`
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓ ░░░░░ ▓▓▓▓▓▓▓ │  Finder patterns
│ ▓░░░░░▓       ▓░░░░░▓ │  (corners)
│ ▓░▓▓▓░▓       ▓░▓▓▓░▓ │
│ ▓░▓▓▓░▓       ▓░▓▓▓░▓ │
│ ▓░░░░░▓       ▓░░░░░▓ │
│ ▓▓▓▓▓▓▓ ░▓░▓░ ▓▓▓▓▓▓▓ │  Timing patterns
│         ░░░░░         │
│ ░▓░▓░▓░ DATA ░▓░▓░▓░  │  Data region
│         AREA          │
│ ▓▓▓▓▓▓▓ ░░░░░ ░░░░░░  │
│ ▓░░░░░▓ ░▓▓▓░ ░▓▓▓░░  │
│ ▓░▓▓▓░▓               │  Alignment pattern
└─────────────────────────────┘
\`\`\`

### Finder Patterns

The three large squares in corners help scanners:
1. Locate the QR code
2. Determine orientation
3. Calculate the code's angle

### Encoding Modes

QR codes support multiple encoding modes:

| Mode | Characters | Bits per char |
|------|------------|---------------|
| Numeric | 0-9 | 3.33 |
| Alphanumeric | A-Z, 0-9, symbols | 5.5 |
| Byte | Any (UTF-8) | 8 |
| Kanji | Japanese characters | 13 |

### Error Correction

QR codes use Reed-Solomon error correction with four levels:

| Level | Recovery | Use Case |
|-------|----------|----------|
| L | ~7% | Clean environments |
| M | ~15% | General use |
| Q | ~25% | Dirty/damaged likely |
| H | ~30% | Maximum durability |

This is why QR codes work even when partially damaged or obscured!

### Version and Capacity

QR codes come in 40 versions (sizes):

| Version | Modules | Max Alphanumeric |
|---------|---------|------------------|
| 1 | 21×21 | 25 characters |
| 10 | 57×57 | 395 characters |
| 40 | 177×177 | 4,296 characters |

### Masking

To ensure even distribution of dark/light modules, one of 8 mask patterns is applied. The encoder tests all patterns and picks the one with the best score.
`,
			},
			{
				id: "qr-code-libraries",
				title: "Best QR Code Libraries for JavaScript",
				description:
					"A curated list of QR code libraries for generating and scanning QR codes in JavaScript applications.",
				tags: ["libraries", "javascript", "tools"],
				content: `
## QR Code Libraries for JavaScript

Whether you need to generate or scan QR codes, here are the best libraries available.

### Generation Libraries

#### qrcode (node-qrcode)

The most popular QR code generator for Node.js and browsers.

\`\`\`javascript
npm install qrcode
\`\`\`

\`\`\`javascript
import QRCode from 'qrcode';

// Generate as data URL
const dataUrl = await QRCode.toDataURL('Hello World');

// Generate to canvas
await QRCode.toCanvas(canvas, 'Hello World');

// Generate as SVG
const svg = await QRCode.toString('Hello World', { type: 'svg' });

// With options
await QRCode.toDataURL('Hello', {
  errorCorrectionLevel: 'H',
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
});
\`\`\`

#### qrcode-generator

Lightweight, no dependencies.

\`\`\`javascript
import qrcode from 'qrcode-generator';

const qr = qrcode(0, 'M');
qr.addData('Hello World');
qr.make();

// As HTML img tag
const imgTag = qr.createImgTag();

// As SVG
const svg = qr.createSvgTag();
\`\`\`

### Scanning Libraries

#### html5-qrcode

Full-featured scanner with camera support.

\`\`\`javascript
npm install html5-qrcode
\`\`\`

\`\`\`javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: { width: 250, height: 250 }
});

scanner.render(
  (decodedText) => {
    console.log('Scanned:', decodedText);
  },
  (error) => {
    console.warn('Scan error:', error);
  }
);
\`\`\`

#### jsQR

Pure JavaScript QR scanner (no camera handling).

\`\`\`javascript
import jsQR from 'jsqr';

// From image data
const code = jsQR(imageData.data, width, height);
if (code) {
  console.log('Found:', code.data);
}
\`\`\`

### React Libraries

#### react-qr-code

Simple React component for QR generation.

\`\`\`jsx
import QRCode from 'react-qr-code';

<QRCode 
  value="https://example.com"
  size={256}
  level="H"
/>
\`\`\`

### Comparison Table

| Library | Size | Generation | Scanning | Framework |
|---------|------|------------|----------|-----------|
| qrcode | 45kb | ✅ | ❌ | Any |
| qrcode-generator | 12kb | ✅ | ❌ | Any |
| html5-qrcode | 65kb | ❌ | ✅ | Any |
| jsQR | 55kb | ❌ | ✅ | Any |
| react-qr-code | 8kb | ✅ | ❌ | React |
`,
			},
		],
	},

	base: {
		toolId: "base",
		articles: [
			{
				id: "number-systems-explained",
				title: "Number Systems Explained",
				description:
					"Understanding binary, octal, decimal, and hexadecimal number systems and their uses in computing.",
				tags: ["basics", "math", "computing"],
				content: `
## Number Systems in Computing

Computers fundamentally work with binary, but we use different number bases for different purposes.

### Why Different Bases?

| Base | Name | Digits | Use Case |
|------|------|--------|----------|
| 2 | Binary | 0-1 | How computers actually work |
| 8 | Octal | 0-7 | Unix file permissions |
| 10 | Decimal | 0-9 | Human-readable numbers |
| 16 | Hexadecimal | 0-F | Memory addresses, colors |

### Binary (Base 2)

The foundation of all computing. Each digit is a "bit" representing on (1) or off (0).

\`\`\`
Decimal 13 in binary:
13 = 8 + 4 + 0 + 1
   = 1×2³ + 1×2² + 0×2¹ + 1×2⁰
   = 1101₂
\`\`\`

### Hexadecimal (Base 16)

Compact representation of binary. Each hex digit = 4 binary bits.

\`\`\`
Binary:      1101 0101
Hexadecimal:    D    5

Common uses:
- Colors: #FF5733
- Memory: 0x7FFE0000
- MAC addresses: AA:BB:CC:DD:EE:FF
\`\`\`

### Octal (Base 8)

Each octal digit = 3 binary bits. Used in Unix permissions.

\`\`\`
chmod 755 file
  7 = rwx (owner)
  5 = r-x (group)
  5 = r-x (others)

  7 = 111₂ = read + write + execute
  5 = 101₂ = read + execute
\`\`\`

### Quick Conversion Reference

\`\`\`
Decimal  Binary   Octal   Hex
   0     0000      0       0
   1     0001      1       1
   2     0010      2       2
   ...
   9     1001     11       9
  10     1010     12       A
  11     1011     13       B
  12     1100     14       C
  13     1101     15       D
  14     1110     16       E
  15     1111     17       F
  16    10000     20      10
\`\`\`
`,
			},
			{
				id: "javascript-number-conversion",
				title: "Number Base Conversion in JavaScript",
				description:
					"How to convert between number bases using JavaScript's built-in methods and custom functions.",
				tags: ["javascript", "tutorial", "code"],
				content: `
## Number Conversion in JavaScript

JavaScript provides built-in methods for common base conversions.

### parseInt() - String to Number

\`\`\`javascript
// Parse with specific base (radix)
parseInt('1010', 2);    // 10 (binary to decimal)
parseInt('FF', 16);     // 255 (hex to decimal)
parseInt('777', 8);     // 511 (octal to decimal)

// Without radix, JS guesses (avoid this!)
parseInt('10');         // 10
parseInt('010');        // 10 (modern JS) or 8 (old)
\`\`\`

### toString() - Number to String

\`\`\`javascript
const num = 255;

num.toString(2);   // "11111111" (binary)
num.toString(8);   // "377" (octal)
num.toString(16);  // "ff" (hex)
num.toString(36);  // "73" (base 36, max)
\`\`\`

### Combining for Conversion

\`\`\`javascript
// Binary to Hex
function binaryToHex(binary) {
  return parseInt(binary, 2).toString(16);
}
binaryToHex('11111111'); // "ff"

// Hex to Binary
function hexToBinary(hex) {
  return parseInt(hex, 16).toString(2);
}
hexToBinary('ff'); // "11111111"

// Any base to any base
function convertBase(value, fromBase, toBase) {
  return parseInt(value, fromBase).toString(toBase);
}
convertBase('ff', 16, 2);  // "11111111"
convertBase('777', 8, 16); // "1ff"
\`\`\`

### Padding Binary Output

\`\`\`javascript
function toBinary(num, bits = 8) {
  return num.toString(2).padStart(bits, '0');
}

toBinary(5);     // "00000101"
toBinary(5, 4);  // "0101"
toBinary(255);   // "11111111"
\`\`\`

### Handling Large Numbers

For numbers larger than 2^53, use BigInt:

\`\`\`javascript
const big = BigInt('0xFFFFFFFFFFFFFFFF');
big.toString(2);
// "1111111111111111111111111111111111111111111111111111111111111111"

// Parse large binary
const bigBin = BigInt('0b' + '1'.repeat(64));
bigBin.toString(16);
// "ffffffffffffffff"
\`\`\`
`,
			},
		],
	},

	// ==================== DATA FORMAT TOOLS ====================
	json: {
		toolId: "json",
		articles: [
			{
				id: "json-basics",
				title: "JSON: The Complete Guide",
				description:
					"Everything you need to know about JSON - syntax, data types, and best practices.",
				tags: ["basics", "data", "web"],
				content: `
## What is JSON?

JSON (JavaScript Object Notation) is a lightweight data interchange format. It's easy for humans to read and write, and easy for machines to parse and generate.

### JSON Syntax

\`\`\`json
{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "email": null,
  "hobbies": ["reading", "coding", "gaming"],
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
\`\`\`

### Data Types

| Type | Example | Notes |
|------|---------|-------|
| String | \`"hello"\` | Must use double quotes |
| Number | \`42\`, \`3.14\` | No leading zeros |
| Boolean | \`true\`, \`false\` | Lowercase only |
| Null | \`null\` | Lowercase only |
| Array | \`[1, 2, 3]\` | Ordered list |
| Object | \`{"key": "value"}\` | Unordered key-value pairs |

### Common Mistakes

\`\`\`javascript
// ❌ Wrong: Single quotes
{'name': 'John'}

// ✅ Correct: Double quotes
{"name": "John"}

// ❌ Wrong: Trailing comma
{"name": "John",}

// ✅ Correct: No trailing comma
{"name": "John"}

// ❌ Wrong: Comments
{
  "name": "John" // this is a comment
}

// ✅ JSON doesn't support comments
{"name": "John"}
\`\`\`

### JSON vs JavaScript Objects

\`\`\`javascript
// JavaScript object (more flexible)
const jsObj = {
  name: 'John',           // Unquoted keys OK
  'full-name': 'John Doe', // Quoted keys OK
  greet() { },            // Methods allowed
};

// JSON (stricter)
const json = {
  "name": "John",         // Keys must be quoted
  "full-name": "John Doe" // Always double quotes
  // No methods, no functions
};
\`\`\`
`,
			},
			{
				id: "json-javascript",
				title: "Working with JSON in JavaScript",
				description:
					"Parse, stringify, and manipulate JSON data effectively in JavaScript applications.",
				tags: ["javascript", "tutorial", "code"],
				content: `
## JSON in JavaScript

JavaScript has built-in support for JSON through the \`JSON\` global object.

### Parsing JSON

\`\`\`javascript
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString);

console.log(obj.name); // "John"
console.log(obj.age);  // 30
\`\`\`

### Stringifying Objects

\`\`\`javascript
const obj = { name: "John", age: 30 };
const json = JSON.stringify(obj);
// '{"name":"John","age":30}'

// Pretty print with indentation
const pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "John",
  "age": 30
}
*/
\`\`\`

### Handling Errors

\`\`\`javascript
function safeParse(jsonString) {
  try {
    return { data: JSON.parse(jsonString), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

const { data, error } = safeParse('invalid json');
if (error) {
  console.error('Parse error:', error);
}
\`\`\`

### The Replacer Function

\`\`\`javascript
const obj = {
  name: "John",
  password: "secret",
  age: 30
};

// Filter out sensitive data
const json = JSON.stringify(obj, (key, value) => {
  if (key === 'password') return undefined;
  return value;
});
// '{"name":"John","age":30}'

// Or use an array of allowed keys
JSON.stringify(obj, ['name', 'age']);
// '{"name":"John","age":30}'
\`\`\`

### The Reviver Function

\`\`\`javascript
const json = '{"date": "2024-01-15T00:00:00.000Z"}';

// Convert date strings to Date objects
const obj = JSON.parse(json, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});

console.log(obj.date instanceof Date); // true
\`\`\`

### Deep Clone Objects

\`\`\`javascript
// Quick deep clone (with limitations)
const clone = JSON.parse(JSON.stringify(original));

// Limitations:
// - Loses functions
// - Loses undefined values
// - Loses Dates (become strings)
// - Loses Map, Set, etc.
\`\`\`
`,
			},
			{
				id: "json-schema",
				title: "Validating JSON with JSON Schema",
				description:
					"How to define and validate JSON data structures using JSON Schema.",
				tags: ["validation", "schema", "best-practices"],
				content: `
## JSON Schema

JSON Schema is a vocabulary for validating JSON documents. It describes the structure and constraints of your data.

### Basic Schema

\`\`\`json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["name", "email"]
}
\`\`\`

### Type Keywords

\`\`\`json
{ "type": "string" }
{ "type": "number" }
{ "type": "integer" }
{ "type": "boolean" }
{ "type": "null" }
{ "type": "array" }
{ "type": "object" }
{ "type": ["string", "null"] }  // Multiple types
\`\`\`

### String Constraints

\`\`\`json
{
  "type": "string",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[A-Za-z]+$",
  "format": "email"
}
\`\`\`

### Number Constraints

\`\`\`json
{
  "type": "number",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": 0,
  "multipleOf": 0.01
}
\`\`\`

### Array Constraints

\`\`\`json
{
  "type": "array",
  "items": { "type": "string" },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}
\`\`\`

### Validation in JavaScript

\`\`\`javascript
import Ajv from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['name']
};

const validate = ajv.compile(schema);

const valid = validate({ name: 'John', age: 30 });
// true

const invalid = validate({ age: -5 });
// false
console.log(validate.errors);
// [{ keyword: 'required', ... }, { keyword: 'minimum', ... }]
\`\`\`
`,
			},
		],
	},

	yaml: {
		toolId: "yaml",
		articles: [
			{
				id: "yaml-vs-json",
				title: "YAML vs JSON: When to Use Each",
				description:
					"A comparison of YAML and JSON formats, their strengths, and appropriate use cases.",
				tags: ["comparison", "data", "config"],
				content: `
## YAML vs JSON

Both are data serialization formats, but they serve different purposes best.

### Syntax Comparison

**JSON:**
\`\`\`json
{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": true
  },
  "databases": ["mysql", "redis"]
}
\`\`\`

**YAML:**
\`\`\`yaml
server:
  host: localhost
  port: 8080
  ssl: true
databases:
  - mysql
  - redis
\`\`\`

### Key Differences

| Feature | JSON | YAML |
|---------|------|------|
| Comments | ❌ Not supported | ✅ # comments |
| Readability | Moderate | High |
| Verbosity | More punctuation | Minimal |
| Parsing speed | Faster | Slower |
| Multi-document | ❌ No | ✅ Yes |
| Anchors/aliases | ❌ No | ✅ Yes |

### When to Use JSON

- **APIs**: Standard for REST APIs
- **Data exchange**: Universal support
- **JavaScript apps**: Native parsing
- **Performance critical**: Faster parsing
- **Machine-generated**: Easier to produce

### When to Use YAML

- **Configuration files**: More readable
- **Docker Compose**: Standard format
- **Kubernetes**: All manifests are YAML
- **CI/CD pipelines**: GitHub Actions, GitLab CI
- **Documentation**: Easier to write by hand

### YAML Superpowers

\`\`\`yaml
# Multi-line strings
description: |
  This is a multi-line
  string that preserves
  line breaks.

# Anchors and aliases (DRY)
defaults: &defaults
  timeout: 30
  retries: 3

production:
  <<: *defaults
  host: prod.example.com

staging:
  <<: *defaults
  host: staging.example.com

# Multiple documents
---
document: 1
---
document: 2
\`\`\`
`,
			},
			{
				id: "yaml-gotchas",
				title: "YAML Gotchas Every Developer Should Know",
				description:
					"Common YAML pitfalls that cause bugs and how to avoid them.",
				tags: ["best-practices", "pitfalls", "debugging"],
				content: `
## YAML Gotchas

YAML's flexibility can lead to unexpected behavior. Here are the most common pitfalls.

### 1. The Norway Problem

\`\`\`yaml
# These are parsed as booleans!
country: NO      # false
answer: YES      # true
maybe: on        # true
disabled: off    # false

# Fix: Quote strings
country: "NO"
answer: "YES"
\`\`\`

### 2. Unquoted Strings

\`\`\`yaml
# Surprise! These aren't strings:
version: 1.0     # Float: 1.0
port: 8080       # Integer: 8080
time: 12:30      # Sexagesimal: 750 (12*60+30)!
date: 2024-01-15 # Date object

# Fix: Quote when you want strings
version: "1.0"
time: "12:30"
\`\`\`

### 3. Indentation Sensitivity

\`\`\`yaml
# This is an object
parent:
  child: value

# This is a string "child: value"
parent: 
child: value

# Tabs vs spaces (use spaces!)
parent:
	child: broken  # Tab = error in many parsers
\`\`\`

### 4. Empty Values

\`\`\`yaml
# These are all null:
key1:
key2: null
key3: ~
key4:

# Empty string needs quotes:
key5: ""
\`\`\`

### 5. Special Characters

\`\`\`yaml
# Colon in value needs quoting
url: "https://example.com"

# Or use a space after the colon
url: https://example.com  # Works, but risky

# Hash in value needs quoting
color: "#FF5733"

# Otherwise it's a comment
color: #FF5733  # Everything after # is gone!
\`\`\`

### 6. Multi-line String Styles

\`\`\`yaml
# Literal (preserves newlines)
literal: |
  line 1
  line 2

# Folded (joins lines with spaces)
folded: >
  this becomes
  one line

# With chomping indicators
keep_final_newline: |+
  text

strip_final_newline: |-
  text
\`\`\`

### Safe YAML Parsing

\`\`\`javascript
import yaml from 'js-yaml';

// Use safeLoad to prevent code execution
const data = yaml.load(yamlString, { schema: yaml.JSON_SCHEMA });
\`\`\`
`,
			},
		],
	},

	env: {
		toolId: "env",
		articles: [
			{
				id: "env-files-guide",
				title: "Complete Guide to .env Files",
				description:
					"How to use .env files for configuration, best practices, and common patterns.",
				tags: ["basics", "config", "security"],
				content: `
## Understanding .env Files

Environment files (.env) store configuration as key-value pairs, keeping sensitive data out of your code.

### Basic Syntax

\`\`\`bash
# Database configuration
DATABASE_URL=postgresql://localhost:5432/mydb
DATABASE_POOL_SIZE=10

# API Keys
API_KEY=sk_live_abc123
API_SECRET=your_secret_here

# Feature flags
ENABLE_FEATURE_X=true
DEBUG_MODE=false

# Multi-line values (varies by parser)
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
\`\`\`

### Loading .env Files

**Node.js with dotenv:**
\`\`\`javascript
npm install dotenv
\`\`\`

\`\`\`javascript
require('dotenv').config();
// or
import 'dotenv/config';

// Access variables
const dbUrl = process.env.DATABASE_URL;
\`\`\`

**Python with python-dotenv:**
\`\`\`python
from dotenv import load_dotenv
import os

load_dotenv()
db_url = os.getenv('DATABASE_URL')
\`\`\`

### Multiple Environments

\`\`\`
.env                 # Default/shared values
.env.local           # Local overrides (gitignored)
.env.development     # Development settings
.env.production      # Production settings
.env.test            # Test settings
\`\`\`

### Priority Order (typical)

1. Actual environment variables
2. \`.env.{environment}.local\`
3. \`.env.local\`
4. \`.env.{environment}\`
5. \`.env\`

### What NOT to Put in .env

- Anything that should be in code
- Non-sensitive configuration
- Values that never change
- Large data or files
`,
			},
			{
				id: "env-security",
				title: ".env Security Best Practices",
				description:
					"How to handle environment variables securely and avoid common security mistakes.",
				tags: ["security", "best-practices", "devops"],
				content: `
## .env Security

Environment variables are for secrets, but they need proper handling to stay secure.

### The Golden Rules

1. **Never commit .env files**
\`\`\`gitignore
# .gitignore
.env
.env.local
.env.*.local
\`\`\`

2. **Provide a template**
\`\`\`bash
# .env.example (safe to commit)
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your_api_key_here
SECRET_KEY=generate_a_secret
\`\`\`

### Common Mistakes

\`\`\`javascript
// ❌ WRONG: Exposing to client-side
const config = {
  apiKey: process.env.API_KEY  // Bundled in JS!
};

// ❌ WRONG: Logging secrets
console.log('Config:', process.env);

// ❌ WRONG: Error messages with secrets
throw new Error(\`DB failed: \${process.env.DATABASE_URL}\`);
\`\`\`

### Client vs Server Variables

\`\`\`bash
# Next.js example
# Server-only (not exposed)
DATABASE_URL=...
API_SECRET=...

# Client-exposed (prefixed)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-12345
\`\`\`

### Production Best Practices

1. **Use a secrets manager**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Google Secret Manager
   - Azure Key Vault

2. **Rotate secrets regularly**
\`\`\`bash
# Document rotation procedure
# 1. Generate new secret
# 2. Add new secret (support both)
# 3. Update all services
# 4. Remove old secret
\`\`\`

3. **Principle of least privilege**
   - Each service gets only needed secrets
   - Use separate credentials per environment
   - Audit access regularly

4. **Encrypt at rest**
   - Don't store plaintext secrets in CI/CD
   - Use encrypted secret storage
   - Encrypt backups containing secrets
`,
			},
		],
	},

	sql: {
		toolId: "sql",
		articles: [
			{
				id: "sql-formatting-guide",
				title: "SQL Formatting Best Practices",
				description:
					"Write readable, maintainable SQL with consistent formatting conventions.",
				tags: ["best-practices", "style", "readability"],
				content: `
## SQL Formatting Guide

Well-formatted SQL is easier to read, review, and maintain. Here are industry-standard conventions.

### Basic Formatting Rules

\`\`\`sql
-- ✅ Good: Keywords uppercase, proper indentation
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active'
    AND u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 100;

-- ❌ Bad: Hard to read
select u.id,u.name,u.email,count(o.id) as order_count from users u left join orders o on o.user_id=u.id where u.status='active' and u.created_at>'2024-01-01' group by u.id,u.name,u.email having count(o.id)>5 order by order_count desc limit 100;
\`\`\`

### Column Lists

\`\`\`sql
-- One column per line for many columns
SELECT
    id,
    first_name,
    last_name,
    email,
    phone,
    created_at,
    updated_at
FROM users;

-- Inline for few columns
SELECT id, name FROM users;
\`\`\`

### JOIN Formatting

\`\`\`sql
SELECT
    o.id,
    o.total,
    u.name AS customer_name,
    p.name AS product_name
FROM orders o
INNER JOIN users u
    ON u.id = o.user_id
LEFT JOIN order_items oi
    ON oi.order_id = o.id
LEFT JOIN products p
    ON p.id = oi.product_id
WHERE o.status = 'completed';
\`\`\`

### Subqueries

\`\`\`sql
SELECT
    u.name,
    u.email,
    (
        SELECT COUNT(*)
        FROM orders
        WHERE user_id = u.id
    ) AS order_count
FROM users u
WHERE u.id IN (
    SELECT DISTINCT user_id
    FROM orders
    WHERE total > 1000
);
\`\`\`

### CTEs (Common Table Expressions)

\`\`\`sql
WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(*) AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.name,
    au.email,
    COALESCE(uo.order_count, 0) AS orders,
    COALESCE(uo.total_spent, 0) AS spent
FROM active_users au
LEFT JOIN user_orders uo ON uo.user_id = au.id
ORDER BY spent DESC;
\`\`\`
`,
			},
			{
				id: "sql-injection",
				title: "Preventing SQL Injection",
				description:
					"Understanding SQL injection attacks and how to write secure database queries.",
				tags: ["security", "injection", "best-practices"],
				content: `
## SQL Injection Prevention

SQL injection remains one of the most dangerous and common web vulnerabilities.

### What is SQL Injection?

Attackers insert malicious SQL through user input:

\`\`\`javascript
// Vulnerable code
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// Attacker input: "1; DROP TABLE users; --"
// Resulting query:
// SELECT * FROM users WHERE id = 1; DROP TABLE users; --
\`\`\`

### Prevention: Parameterized Queries

**Node.js (pg):**
\`\`\`javascript
// ❌ WRONG: String concatenation
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// ✅ CORRECT: Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await client.query(query, [email]);
\`\`\`

**Python (psycopg2):**
\`\`\`python
# ❌ WRONG
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# ✅ CORRECT
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
\`\`\`

### ORMs and Query Builders

\`\`\`javascript
// Prisma (safe by default)
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// Knex.js
const users = await knex('users')
  .where('email', userInput)
  .select('*');

// Be careful with raw queries!
// ❌ Still vulnerable
knex.raw(\`SELECT * FROM users WHERE email = '\${email}'\`);

// ✅ Safe raw query
knex.raw('SELECT * FROM users WHERE email = ?', [email]);
\`\`\`

### Input Validation (Defense in Depth)

\`\`\`javascript
// Even with parameterized queries, validate input
function validateEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email;
}

// Validate IDs are actually numbers
function validateId(id) {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed < 1) {
    throw new Error('Invalid ID');
  }
  return parsed;
}
\`\`\`

### Additional Protections

1. **Least privilege**: DB user should only have needed permissions
2. **Stored procedures**: Pre-compiled queries when possible
3. **WAF**: Web Application Firewall as additional layer
4. **Error handling**: Don't expose SQL errors to users
`,
			},
		],
	},

	// ==================== GENERATOR TOOLS ====================
	uuid: {
		toolId: "uuid",
		articles: [
			{
				id: "uuid-versions-explained",
				title: "UUID Versions Explained",
				description:
					"Understanding the different UUID versions, their use cases, and how to choose the right one.",
				tags: ["basics", "versions", "comparison"],
				content: `
## UUID Versions

UUID (Universally Unique Identifier) has several versions, each with different properties.

### Version Overview

| Version | Based On | Sortable | Use Case |
|---------|----------|----------|----------|
| v1 | Timestamp + MAC | Partially | Legacy systems |
| v4 | Random | No | General purpose |
| v5 | Namespace + Name | No | Deterministic IDs |
| v7 | Timestamp + Random | Yes | Modern databases |

### UUID v4 (Random)

The most commonly used version. 122 random bits.

\`\`\`
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
          ^    ^
          |    Variant (8, 9, a, or b)
          Version (4)

Example: 550e8400-e29b-41d4-a716-446655440000
\`\`\`

**Pros:**
- Simple to generate
- No coordination needed
- Privacy (no embedded info)

**Cons:**
- Not sortable
- Poor database index performance

### UUID v7 (Timestamp-based)

Newest version. Timestamp prefix + random suffix.

\`\`\`
tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
^^^^^^^^ ^^^^
Unix timestamp (ms)

Example: 0188a5f5-c308-7b99-b5c0-7b5c1c1c1c1c
\`\`\`

**Pros:**
- Sortable by creation time
- Better database indexing
- Still globally unique

**Cons:**
- Reveals creation time
- Slightly newer (less library support)

### When to Use What

**Use v4 when:**
- You don't need sorting
- Privacy is important
- Simple random IDs are fine

**Use v7 when:**
- Database performance matters
- You need chronological ordering
- Building time-series data

### Collision Probability

UUID v4 has 2^122 possible values. The probability of collision:

- After 1 billion UUIDs: ~0.00000000000000001%
- You'd need 2.71 × 10^18 UUIDs for 50% collision chance
- That's generating 1 billion UUIDs per second for 85 years
`,
			},
			{
				id: "uuid-in-databases",
				title: "Using UUIDs in Databases",
				description:
					"Best practices for storing and indexing UUIDs in SQL and NoSQL databases.",
				tags: ["database", "performance", "best-practices"],
				content: `
## UUIDs in Databases

UUIDs are great for distributed systems, but require careful handling in databases.

### Storage Formats

\`\`\`sql
-- String (36 bytes) - Simple but wasteful
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY
);

-- Binary (16 bytes) - Efficient but less readable
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY
);

-- Native UUID type (PostgreSQL, MySQL 8+)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
\`\`\`

### PostgreSQL

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Or use built-in gen_random_uuid() (v13+)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert
INSERT INTO users (name) VALUES ('John');

-- Query
SELECT * FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440000';
\`\`\`

### MySQL

\`\`\`sql
-- Using BINARY(16) for efficiency
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Insert with UUID_TO_BIN (MySQL 8+)
INSERT INTO users (id, name) 
VALUES (UUID_TO_BIN(UUID()), 'John');

-- Query
SELECT BIN_TO_UUID(id) AS id, name 
FROM users 
WHERE id = UUID_TO_BIN('550e8400-e29b-41d4-a716-446655440000');
\`\`\`

### Indexing Considerations

\`\`\`sql
-- UUIDv4: Random distribution = B-tree fragmentation
-- UUIDv7: Sequential = Better B-tree performance

-- Consider partial indexes
CREATE INDEX idx_users_recent ON users (id)
WHERE created_at > NOW() - INTERVAL '30 days';

-- Or use composite indexes
CREATE INDEX idx_users_created_id ON users (created_at, id);
\`\`\`

### UUID vs Auto-Increment

| Factor | UUID | Auto-Increment |
|--------|------|----------------|
| Storage | 16 bytes | 4-8 bytes |
| Index size | Larger | Smaller |
| Insert speed | Slower (v4) | Faster |
| Distributed | ✅ No coordination | ❌ Needs coordination |
| Security | ✅ Not guessable | ❌ Sequential |
| Merging data | ✅ Easy | ❌ Conflicts |
`,
			},
		],
	},

	hash: {
		toolId: "hash",
		articles: [
			{
				id: "hash-functions-explained",
				title: "Cryptographic Hash Functions Explained",
				description:
					"Understanding hash functions, their properties, and when to use different algorithms.",
				tags: ["basics", "cryptography", "security"],
				content: `
## What is a Hash Function?

A hash function takes input data of any size and produces a fixed-size output (the "hash" or "digest").

### Key Properties

1. **Deterministic**: Same input always produces same output
2. **Fast**: Quick to compute for any input size
3. **One-way**: Cannot reverse hash to get input
4. **Collision-resistant**: Hard to find two inputs with same hash
5. **Avalanche effect**: Small input change = completely different hash

### Common Algorithms

| Algorithm | Output Size | Status |
|-----------|-------------|--------|
| MD5 | 128 bits | ❌ Broken |
| SHA-1 | 160 bits | ❌ Broken |
| SHA-256 | 256 bits | ✅ Secure |
| SHA-384 | 384 bits | ✅ Secure |
| SHA-512 | 512 bits | ✅ Secure |
| SHA-3 | Variable | ✅ Secure |
| BLAKE3 | Variable | ✅ Secure, Fast |

### Example: SHA-256

\`\`\`
Input: "Hello"
SHA-256: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969

Input: "hello" (just lowercase)
SHA-256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

Completely different output!
\`\`\`

### Use Cases

| Use Case | Recommended |
|----------|-------------|
| Password storage | bcrypt, Argon2 (NOT raw SHA) |
| File integrity | SHA-256 |
| Digital signatures | SHA-256 or SHA-3 |
| Hash tables | Non-crypto (MurmurHash) |
| Checksums | SHA-256 or BLAKE3 |
| Git commits | SHA-1 (legacy) → SHA-256 |
`,
			},
			{
				id: "hashing-for-passwords",
				title: "Password Hashing Done Right",
				description:
					"Why regular hashing is wrong for passwords and how to properly secure user credentials.",
				tags: ["security", "passwords", "best-practices"],
				content: `
## Password Hashing

Regular hash functions (SHA-256, etc.) are NOT suitable for passwords. Here's why and what to use instead.

### Why SHA-256 is Wrong for Passwords

\`\`\`javascript
// ❌ WRONG: Raw SHA-256
const hash = crypto.createHash('sha256')
  .update(password)
  .digest('hex');

// Problems:
// 1. Too fast - attackers can try billions/second
// 2. No salt - rainbow table attacks
// 3. Identical passwords have identical hashes
\`\`\`

### The Right Way: bcrypt

\`\`\`javascript
import bcrypt from 'bcrypt';

// Hashing a password
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
// $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aAfnvKY5P8m3K.

// Verifying a password
const isMatch = await bcrypt.compare(password, hash);
\`\`\`

### Even Better: Argon2

\`\`\`javascript
import argon2 from 'argon2';

// Hashing
const hash = await argon2.hash(password, {
  type: argon2.argon2id,  // Recommended variant
  memoryCost: 65536,      // 64 MB
  timeCost: 3,            // Iterations
  parallelism: 4          // Threads
});

// Verifying
const isMatch = await argon2.verify(hash, password);
\`\`\`

### Comparison

| Feature | SHA-256 | bcrypt | Argon2 |
|---------|---------|--------|--------|
| Purpose | General | Passwords | Passwords |
| Speed | Fast | Slow | Slow |
| Salt | Manual | Built-in | Built-in |
| Memory-hard | ❌ | ❌ | ✅ |
| GPU-resistant | ❌ | Somewhat | ✅ |
| Recommended | ❌ | ✅ | ✅✅ |

### Best Practices

1. **Never store plaintext passwords**
2. **Use Argon2id or bcrypt**
3. **Use a work factor that takes ~250ms**
4. **Increase work factor over time**
5. **Re-hash on login when upgrading**
6. **Implement rate limiting**
7. **Use secure password requirements**
`,
			},
		],
	},

	lorem: {
		toolId: "lorem",
		articles: [
			{
				id: "history-of-lorem-ipsum",
				title: "The History of Lorem Ipsum",
				description:
					"The surprising 500-year history of the world's most famous placeholder text.",
				tags: ["history", "design", "typography"],
				content: `
## The History of Lorem Ipsum

Lorem Ipsum has been the industry's standard dummy text since the 1500s, but its story is often misunderstood.

### Ancient Origins

Lorem Ipsum is derived from "De finibus bonorum et malorum" (On the Ends of Good and Evil) by Cicero, written in 45 BC. It's a treatise on ethics, not random Latin.

### The Original Text

\`\`\`
"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, 
consectetur, adipisci velit..."

Translation: "There is no one who loves pain itself, who seeks 
after it and wants to have it, simply because it is pain..."
\`\`\`

### How It Became "Lorem Ipsum"

The standard Lorem Ipsum passage was created by scrambling the original Cicero text:

1. Words were removed
2. Letters were added/removed
3. The result is pseudo-Latin (mostly nonsense)

### First Print Use (1500s)

An unknown printer scrambled Cicero's text to create a type specimen book. This was used to showcase fonts without the distraction of readable content.

### Modern Revival (1960s)

Letraset sheets featuring Lorem Ipsum became popular with graphic designers and typesetters. This standardized its use across the industry.

### Digital Era (1980s-Present)

- **1985**: Aldus PageMaker includes Lorem Ipsum
- **1990s**: Web design adopts it universally
- **Today**: Built into most design tools

### The Standard Passage

\`\`\`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
aliquip ex ea commodo consequat.
\`\`\`
`,
			},
			{
				id: "lorem-ipsum-alternatives",
				title: "Lorem Ipsum Alternatives for Developers",
				description:
					"Fun and useful alternatives to Lorem Ipsum for placeholder text in your projects.",
				tags: ["tools", "alternatives", "fun"],
				content: `
## Lorem Ipsum Alternatives

Sometimes you want placeholder text that's more interesting—or more realistic.

### Fun Alternatives

**Bacon Ipsum** - Meaty placeholder text
\`\`\`
Bacon ipsum dolor amet hamburger pork chop leberkas ham hock 
ribeye meatloaf pig ball tip biltong buffalo strip steak ham.
\`\`\`

**Cupcake Ipsum** - Sweet placeholder
\`\`\`
Cupcake ipsum dolor sit amet tootsie roll dragée tiramisu. 
Powder chocolate bar jelly beans marshmallow jujubes.
\`\`\`

**Hipster Ipsum** - Artisanal filler
\`\`\`
Craft beer pork belly aesthetic, 8-bit meditation sustainable 
hella polaroid artisan direct trade squid.
\`\`\`

**Pirate Ipsum** - Arr!
\`\`\`
Prow scuttle parrel provost Sail ho shrouds spirits boom 
mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's.
\`\`\`

### Practical Alternatives

**Office Ipsum** - Corporate speak
\`\`\`
Let's circle back on this and leverage our synergies to move the 
needle on key deliverables and drive stakeholder alignment.
\`\`\`

**Legal Ipsum** - Legal jargon
\`\`\`
Whereas the party of the first part hereinafter agrees to 
indemnify and hold harmless the party of the second part...
\`\`\`

### Real Content Approaches

**Wikipedia excerpts**: Use public domain text
**News headlines**: Scraped and anonymized
**Books**: Out-of-copyright literature

### Generator Libraries

\`\`\`javascript
// faker.js - Realistic fake data
import { faker } from '@faker-js/faker';

faker.lorem.paragraph();
faker.lorem.sentences(3);
faker.person.fullName();
faker.internet.email();

// For specific domains
faker.commerce.productDescription();
faker.company.catchPhrase();
\`\`\`
`,
			},
		],
	},

	password: {
		toolId: "password",
		articles: [
			{
				id: "password-entropy",
				title: "Understanding Password Entropy",
				description:
					"The math behind password strength: what entropy means and why it matters.",
				tags: ["security", "math", "basics"],
				content: `
## Password Entropy

Entropy measures password strength in bits. Higher entropy = harder to crack.

### The Formula

\`\`\`
Entropy = log₂(C^L)
       = L × log₂(C)

Where:
- C = Number of possible characters
- L = Password length
\`\`\`

### Character Set Sizes

| Character Set | Size (C) | Example |
|--------------|----------|---------|
| Digits | 10 | 0-9 |
| Lowercase | 26 | a-z |
| Uppercase | 26 | A-Z |
| Lower + Upper | 52 | a-z, A-Z |
| Alphanumeric | 62 | a-z, A-Z, 0-9 |
| + Symbols | 95 | Full ASCII printable |

### Entropy Examples

\`\`\`
4-digit PIN:         log₂(10^4)  = 13.3 bits
8 char lowercase:    log₂(26^8)  = 37.6 bits
8 char mixed case:   log₂(52^8)  = 45.6 bits
8 char + numbers:    log₂(62^8)  = 47.6 bits
8 char + symbols:    log₂(95^8)  = 52.6 bits
12 char mixed:       log₂(62^12) = 71.5 bits
16 char mixed:       log₂(62^16) = 95.3 bits
\`\`\`

### How Long to Crack?

At 1 trillion guesses/second:

| Entropy | Combinations | Time to Crack |
|---------|--------------|---------------|
| 40 bits | 1.1 × 10^12 | 1 second |
| 50 bits | 1.1 × 10^15 | 18 minutes |
| 60 bits | 1.2 × 10^18 | 13 days |
| 70 bits | 1.2 × 10^21 | 37 years |
| 80 bits | 1.2 × 10^24 | 38,000 years |
| 128 bits | 3.4 × 10^38 | Heat death of universe |

### Recommendations

- **Minimum**: 60 bits (important accounts)
- **Good**: 70-80 bits (sensitive data)
- **Excellent**: 90+ bits (critical systems)

### The Passphrase Advantage

\`\`\`
Random password: "j7#kL9$m"  (52 bits)
Passphrase:      "correct horse battery staple" (44+ bits*)

*With dictionary attacks considered, but:
- Easier to remember
- Easier to type
- Add more words for more entropy
\`\`\`
`,
			},
			{
				id: "secure-password-generation",
				title: "Generating Cryptographically Secure Passwords",
				description:
					"How to generate truly random passwords using proper cryptographic methods.",
				tags: ["code", "security", "cryptography"],
				content: `
## Secure Password Generation

Not all random is created equal. Here's how to generate passwords properly.

### Bad: Math.random()

\`\`\`javascript
// ❌ NEVER use Math.random() for security
function badPassword(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Why it's bad:
// - Predictable (seeded by timestamp)
// - Not cryptographically secure
// - Can be reverse-engineered
\`\`\`

### Good: Web Crypto API

\`\`\`javascript
// ✅ Browser-safe secure random
function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  return Array.from(randomValues)
    .map(v => charset[v % charset.length])
    .join('');
}
\`\`\`

### Good: Node.js crypto

\`\`\`javascript
import crypto from 'crypto';

// ✅ Node.js secure random
function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const bytes = crypto.randomBytes(length);
  
  return Array.from(bytes)
    .map(b => charset[b % charset.length])
    .join('');
}

// Or use randomInt for unbiased selection
function generatePasswordUnbiased(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset[crypto.randomInt(charset.length)];
  }
  
  return password;
}
\`\`\`

### Passphrase Generation

\`\`\`javascript
const wordlist = ['correct', 'horse', 'battery', 'staple', ...]; // Use EFF wordlist

function generatePassphrase(wordCount = 4) {
  const bytes = crypto.randomBytes(wordCount * 2);
  const words = [];
  
  for (let i = 0; i < wordCount; i++) {
    const index = bytes.readUInt16BE(i * 2) % wordlist.length;
    words.push(wordlist[index]);
  }
  
  return words.join('-');
}

// Output: "correct-horse-battery-staple"
\`\`\`

### Libraries

\`\`\`javascript
// generate-password (npm)
import generator from 'generate-password';

const password = generator.generate({
  length: 16,
  numbers: true,
  symbols: true,
  uppercase: true,
  strict: true  // At least one of each
});
\`\`\`
`,
			},
		],
	},

	// ==================== TEXT TOOLS ====================
	diff: {
		toolId: "diff",
		articles: [
			{
				id: "diff-algorithms",
				title: "How Diff Algorithms Work",
				description:
					"Understanding the algorithms behind text comparison tools like Git diff.",
				tags: ["algorithms", "technical", "git"],
				content: `
## Diff Algorithms

Diff tools find the differences between two texts. Here's how they work.

### The Problem

Given two sequences, find the minimum edit operations (insert, delete) to transform one into the other.

\`\`\`
Text A: "ABCDEF"
Text B: "ABXDEF"

Diff: Replace C with X (or delete C, insert X)
\`\`\`

### Longest Common Subsequence (LCS)

Most diff algorithms are based on finding the LCS.

\`\`\`
A: "ABCDEF"
B: "ABXDEF"
LCS: "ABDEF" (length 5)

Difference = chars not in LCS
A has: C (deleted)
B has: X (inserted)
\`\`\`

### Myers' Algorithm

The standard algorithm (used by Git). Finds the shortest edit script.

\`\`\`
Time: O((N+M)×D) where D = edit distance
Space: O((N+M)×D) or O(N+M) with optimization

For similar files (small D): Nearly linear
For very different files: Up to O(N×M)
\`\`\`

### Patience Diff

Alternative algorithm that produces more readable diffs.

\`\`\`
1. Find unique lines that appear once in both files
2. Use these as "anchors"
3. Recursively diff between anchors

Better for:
- Code refactoring
- Moved blocks of code
- Structural changes
\`\`\`

### Git Diff Options

\`\`\`bash
# Default (Myers)
git diff

# Patience algorithm
git diff --patience

# Minimal diff
git diff --minimal

# Histogram (faster patience)
git diff --histogram
\`\`\`

### Output Formats

**Unified Diff** (most common):
\`\`\`diff
--- a/file.txt
+++ b/file.txt
@@ -1,4 +1,4 @@
 line 1
-old line 2
+new line 2
 line 3
\`\`\`

**Side-by-side**:
\`\`\`
line 1          | line 1
old line 2      | new line 2
line 3          | line 3
\`\`\`
`,
			},
			{
				id: "diff-in-javascript",
				title: "Implementing Diff in JavaScript",
				description:
					"Libraries and techniques for comparing text in JavaScript applications.",
				tags: ["javascript", "code", "libraries"],
				content: `
## Diff in JavaScript

Several libraries make text comparison easy in JavaScript.

### diff (npm)

The most popular diff library.

\`\`\`javascript
npm install diff
\`\`\`

\`\`\`javascript
import * as Diff from 'diff';

// Character-level diff
const diff = Diff.diffChars('hello', 'hallo');
diff.forEach(part => {
  const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
  console.log(part.value, color);
});

// Word-level diff
const wordDiff = Diff.diffWords('hello world', 'hello there');

// Line-level diff
const lineDiff = Diff.diffLines(oldText, newText);

// Create patch
const patch = Diff.createPatch('file.txt', oldText, newText);

// Apply patch
const result = Diff.applyPatch(oldText, patch);
\`\`\`

### jsdiff Output Format

\`\`\`javascript
[
  { value: 'hel', count: 3 },
  { value: 'l', count: 1, removed: true },
  { value: 'a', count: 1, added: true },
  { value: 'o', count: 1 }
]
\`\`\`

### diff2html

Render diffs as HTML.

\`\`\`javascript
import { html } from 'diff2html';

const diffString = \`
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,3 @@
 line 1
-old line
+new line
 line 3
\`;

const htmlOutput = html(diffString, {
  drawFileList: true,
  outputFormat: 'side-by-side'
});
\`\`\`

### Simple Custom Implementation

\`\`\`javascript
// Basic line diff for simple cases
function simpleDiff(oldText, newText) {
  const oldLines = oldText.split('\\n');
  const newLines = newText.split('\\n');
  const result = [];
  
  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      result.push({ type: 'add', line: newLines[j++] });
    } else if (j >= newLines.length) {
      result.push({ type: 'remove', line: oldLines[i++] });
    } else if (oldLines[i] === newLines[j]) {
      result.push({ type: 'same', line: oldLines[i] });
      i++; j++;
    } else {
      result.push({ type: 'remove', line: oldLines[i++] });
      result.push({ type: 'add', line: newLines[j++] });
    }
  }
  
  return result;
}
\`\`\`
`,
			},
		],
	},

	regex: {
		toolId: "regex",
		articles: [
			{
				id: "regex-basics",
				title: "Regular Expressions: A Beginner's Guide",
				description:
					"Learn regex from scratch with clear examples and explanations.",
				tags: ["basics", "tutorial", "beginner"],
				content: `
## Regular Expressions Basics

Regular expressions (regex) are patterns for matching text. They're powerful but can be intimidating at first.

### Simple Patterns

\`\`\`javascript
// Literal match
/hello/        // Matches "hello"

// Case insensitive
/hello/i       // Matches "Hello", "HELLO", etc.

// Global (find all)
/hello/g       // Finds all occurrences
\`\`\`

### Character Classes

\`\`\`javascript
/[abc]/        // Matches a, b, or c
/[a-z]/        // Matches any lowercase letter
/[A-Z]/        // Matches any uppercase letter
/[0-9]/        // Matches any digit
/[a-zA-Z0-9]/  // Matches any alphanumeric

// Negation
/[^abc]/       // Matches anything EXCEPT a, b, c
\`\`\`

### Shorthand Classes

\`\`\`javascript
\\d             // Digit [0-9]
\\D             // Non-digit [^0-9]
\\w             // Word char [a-zA-Z0-9_]
\\W             // Non-word char
\\s             // Whitespace
\\S             // Non-whitespace
.              // Any character (except newline)
\`\`\`

### Quantifiers

\`\`\`javascript
/a*/           // Zero or more a's
/a+/           // One or more a's
/a?/           // Zero or one a
/a{3}/         // Exactly 3 a's
/a{2,4}/       // 2 to 4 a's
/a{2,}/        // 2 or more a's
\`\`\`

### Anchors

\`\`\`javascript
/^hello/       // Starts with "hello"
/world$/       // Ends with "world"
/^exact$/      // Exactly "exact"
/\\bhello\\b/    // "hello" as whole word
\`\`\`

### Groups

\`\`\`javascript
/(abc)+/       // One or more "abc"
/(a|b|c)/      // a OR b OR c
/(?:abc)/      // Non-capturing group
\`\`\`

### Common Patterns

\`\`\`javascript
// Email (simple)
/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

// URL
/https?:\\/\\/[^\\s]+/

// Phone (US)
/\\d{3}-\\d{3}-\\d{4}/

// Date (YYYY-MM-DD)
/\\d{4}-\\d{2}-\\d{2}/
\`\`\`
`,
			},
			{
				id: "regex-advanced",
				title: "Advanced Regex Techniques",
				description:
					"Lookaheads, lookbehinds, and other advanced regex features.",
				tags: ["advanced", "techniques", "patterns"],
				content: `
## Advanced Regex

Once you've mastered the basics, these advanced features unlock even more power.

### Lookahead

Match only if followed by pattern (doesn't consume):

\`\`\`javascript
// Positive lookahead (?=)
/foo(?=bar)/     // "foo" only if followed by "bar"
"foobar".match(/foo(?=bar)/)  // ["foo"]

// Negative lookahead (?!)
/foo(?!bar)/     // "foo" only if NOT followed by "bar"
"foobaz".match(/foo(?!bar)/)  // ["foo"]
\`\`\`

### Lookbehind

Match only if preceded by pattern:

\`\`\`javascript
// Positive lookbehind (?<=)
/(?<=@)\\w+/      // Word after @
"user@domain".match(/(?<=@)\\w+/)  // ["domain"]

// Negative lookbehind (?<!)
/(?<!\\d)\\d{3}(?!\\d)/  // 3 digits not part of larger number
\`\`\`

### Named Groups

\`\`\`javascript
const pattern = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const match = "2024-01-15".match(pattern);

console.log(match.groups.year);   // "2024"
console.log(match.groups.month);  // "01"
console.log(match.groups.day);    // "15"
\`\`\`

### Backreferences

\`\`\`javascript
// Match repeated words
/(\\w+)\\s+\\1/    // "the the" matches

// Named backreference
/(?<word>\\w+)\\s+\\k<word>/
\`\`\`

### Non-Greedy Matching

\`\`\`javascript
// Greedy (default): matches as much as possible
/<.*>/g.exec("<a><b>")     // ["<a><b>"]

// Non-greedy: matches as little as possible
/<.*?>/g.exec("<a><b>")    // ["<a>"]
\`\`\`

### Unicode Support

\`\`\`javascript
// Unicode flag
/\\p{Emoji}/u      // Match emoji
/\\p{Script=Greek}/u  // Match Greek letters

// Example
"Hello 👋 World".match(/\\p{Emoji}/gu)  // ["👋"]
\`\`\`

### Practical Examples

\`\`\`javascript
// Password validation (complex)
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/

// Extract domain from URL
/(?<=:\\/\\/)[^/]+/

// Match balanced quotes
/"([^"\\\\]|\\\\.)*"/

// Validate credit card (basic)
/^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$/
\`\`\`
`,
			},
		],
	},

	markdown: {
		toolId: "markdown",
		articles: [
			{
				id: "markdown-syntax",
				title: "Complete Markdown Syntax Reference",
				description:
					"Every Markdown syntax element you need to know, from basic to extended.",
				tags: ["syntax", "reference", "basics"],
				content: `
## Markdown Syntax Reference

Markdown is a lightweight markup language for creating formatted text.

### Headings

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`

### Text Formatting

\`\`\`markdown
**bold** or __bold__
*italic* or _italic_
***bold and italic***
~~strikethrough~~
\`inline code\`
\`\`\`

### Links and Images

\`\`\`markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")
![Alt text](image.jpg)
![Alt text](image.jpg "Image title")

<!-- Reference style -->
[link][ref]
[ref]: https://example.com
\`\`\`

### Lists

\`\`\`markdown
<!-- Unordered -->
- Item 1
- Item 2
  - Nested item
  - Another nested

<!-- Ordered -->
1. First
2. Second
3. Third

<!-- Task list -->
- [x] Completed task
- [ ] Incomplete task
\`\`\`

### Code Blocks

\`\`\`\`markdown
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
\`\`\`\`

### Blockquotes

\`\`\`markdown
> This is a quote.
>
> It can span multiple paragraphs.
>
> > Nested quotes work too.
\`\`\`

### Tables

\`\`\`markdown
| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Left     | Center   | Right    |
| aligned  | aligned  | aligned  |
\`\`\`

### Horizontal Rule

\`\`\`markdown
---
***
___
\`\`\`

### Extended Syntax

\`\`\`markdown
<!-- Footnotes -->
Here's a sentence with a footnote.[^1]
[^1]: This is the footnote.

<!-- Definition lists -->
Term
: Definition

<!-- Abbreviations -->
*[HTML]: Hyper Text Markup Language

<!-- Emoji (GitHub) -->
:smile: :rocket: :+1:
\`\`\`
`,
			},
			{
				id: "markdown-libraries",
				title: "Best Markdown Libraries for JavaScript",
				description:
					"Parsing, rendering, and extending Markdown in JavaScript applications.",
				tags: ["javascript", "libraries", "tools"],
				content: `
## Markdown Libraries

Choose the right library for your Markdown needs.

### marked

Fast and lightweight. Good for basic needs.

\`\`\`javascript
npm install marked
\`\`\`

\`\`\`javascript
import { marked } from 'marked';

const html = marked.parse('# Hello World');
// <h1>Hello World</h1>

// With options
marked.setOptions({
  gfm: true,        // GitHub Flavored Markdown
  breaks: true,     // Convert \\n to <br>
  headerIds: true,  // Add IDs to headings
});
\`\`\`

### markdown-it

Extensible and CommonMark compliant.

\`\`\`javascript
npm install markdown-it
\`\`\`

\`\`\`javascript
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const html = md.render('# Hello *World*');

// Add plugins
import emoji from 'markdown-it-emoji';
import anchor from 'markdown-it-anchor';

md.use(emoji)
  .use(anchor, { permalink: true });
\`\`\`

### remark

Part of the unified ecosystem. Best for transformations.

\`\`\`javascript
npm install remark remark-html
\`\`\`

\`\`\`javascript
import { remark } from 'remark';
import html from 'remark-html';

const result = await remark()
  .use(html)
  .process('# Hello World');

console.log(String(result));

// With MDX (JSX in Markdown)
import { compile } from '@mdx-js/mdx';
const code = await compile('# Hello <Button />');
\`\`\`

### react-markdown

Render Markdown as React components.

\`\`\`jsx
npm install react-markdown
\`\`\`

\`\`\`jsx
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function Article({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter language={match[1]}>
              {String(children)}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
\`\`\`

### Comparison

| Library | Size | Speed | Extensibility | Best For |
|---------|------|-------|---------------|----------|
| marked | Small | Fast | Moderate | Simple rendering |
| markdown-it | Medium | Fast | High | Plugins needed |
| remark | Large | Moderate | Very High | AST manipulation |
| react-markdown | Medium | Moderate | High | React apps |
`,
			},
		],
	},

	cron: {
		toolId: "cron",
		articles: [
			{
				id: "cron-syntax",
				title: "Cron Expression Syntax Explained",
				description:
					"Complete guide to cron syntax, with examples for common scheduling patterns.",
				tags: ["syntax", "basics", "scheduling"],
				content: `
## Cron Expression Syntax

Cron expressions define schedules for recurring tasks.

### Standard Format (5 fields)

\`\`\`
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12 or JAN-DEC)
│ │ │ │ ┌───────────── day of week (0-6 or SUN-SAT)
│ │ │ │ │
* * * * *
\`\`\`

### Special Characters

| Char | Meaning | Example |
|------|---------|---------|
| \`*\` | Any value | \`* * * * *\` (every minute) |
| \`,\` | List | \`1,15,30\` (at 1, 15, and 30) |
| \`-\` | Range | \`1-5\` (1 through 5) |
| \`/\` | Step | \`*/15\` (every 15) |

### Common Patterns

\`\`\`bash
# Every minute
* * * * *

# Every hour at minute 0
0 * * * *

# Every day at midnight
0 0 * * *

# Every day at 2:30 AM
30 2 * * *

# Every Monday at 9:00 AM
0 9 * * 1

# Every weekday at 9:00 AM
0 9 * * 1-5

# First day of every month at midnight
0 0 1 * *

# Every 15 minutes
*/15 * * * *

# Every 6 hours
0 */6 * * *

# At 10:00 AM on weekdays
0 10 * * MON-FRI

# Twice daily at 8 AM and 8 PM
0 8,20 * * *
\`\`\`

### Extended Format (6-7 fields)

Some systems add seconds and/or year:

\`\`\`
┌───────────── second (0-59) [optional]
│ ┌───────────── minute (0-59)
│ │ ┌──────────���── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (0-6)
│ │ │ │ │ │ ┌───────────── year [optional]
│ │ │ │ │ │ │
* * * * * * *
\`\`\`

### Special Strings

\`\`\`bash
@yearly    # 0 0 1 1 * (once a year)
@monthly   # 0 0 1 * * (once a month)
@weekly    # 0 0 * * 0 (once a week)
@daily     # 0 0 * * * (once a day)
@hourly    # 0 * * * * (once an hour)
@reboot    # Run once at startup
\`\`\`
`,
			},
			{
				id: "cron-in-code",
				title: "Scheduling Tasks with Cron in Node.js",
				description:
					"How to use cron expressions in JavaScript applications for task scheduling.",
				tags: ["javascript", "nodejs", "code"],
				content: `
## Cron in Node.js

Schedule recurring tasks in your Node.js applications.

### node-cron

Simple and popular cron library.

\`\`\`javascript
npm install node-cron
\`\`\`

\`\`\`javascript
import cron from 'node-cron';

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Running every minute');
});

// Run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily cleanup');
});

// With timezone
cron.schedule('0 9 * * *', () => {
  console.log('9 AM in New York');
}, {
  timezone: 'America/New_York'
});

// Validate expression
const isValid = cron.validate('* * * * *'); // true
\`\`\`

### cron-parser

Parse and iterate cron expressions.

\`\`\`javascript
npm install cron-parser
\`\`\`

\`\`\`javascript
import parser from 'cron-parser';

// Parse expression
const interval = parser.parseExpression('*/5 * * * *');

// Get next occurrences
console.log(interval.next().toString());
console.log(interval.next().toString());
console.log(interval.next().toString());

// With options
const interval2 = parser.parseExpression('0 9 * * *', {
  currentDate: new Date(),
  tz: 'America/New_York'
});

// Iterate
const occurrences = [];
for (let i = 0; i < 5; i++) {
  occurrences.push(interval.next().toDate());
}
\`\`\`

### Agenda

Full-featured job scheduling.

\`\`\`javascript
npm install agenda
\`\`\`

\`\`\`javascript
import { Agenda } from 'agenda';

const agenda = new Agenda({ db: { address: mongoUrl } });

// Define a job
agenda.define('send email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  await sendEmail(to, subject, body);
});

// Schedule with cron
await agenda.every('0 9 * * *', 'send email', {
  to: 'user@example.com',
  subject: 'Daily Report',
  body: '...'
});

// Start processing
await agenda.start();
\`\`\`

### Bull (Redis-based)

For distributed job queues.

\`\`\`javascript
import Queue from 'bull';

const myQueue = new Queue('tasks', { redis: { port: 6379 } });

// Add repeating job
await myQueue.add(
  { task: 'cleanup' },
  { repeat: { cron: '0 0 * * *' } }
);

// Process jobs
myQueue.process(async (job) => {
  console.log('Processing:', job.data);
});
\`\`\`
`,
			},
		],
	},

	// ==================== UTILITY TOOLS ====================
	timestamp: {
		toolId: "timestamp",
		articles: [
			{
				id: "unix-timestamp-explained",
				title: "Unix Timestamps Explained",
				description:
					"What Unix timestamps are, why they exist, and how to work with them.",
				tags: ["basics", "time", "unix"],
				content: `
## What is a Unix Timestamp?

A Unix timestamp (or Epoch time) is the number of seconds since January 1, 1970, 00:00:00 UTC.

### Why January 1, 1970?

This date was chosen when Unix was being developed in the early 1970s. It's called the "Unix Epoch" - a simple, arbitrary starting point.

### Examples

\`\`\`
Timestamp: 0
Date: Thu Jan 01 1970 00:00:00 UTC

Timestamp: 1000000000
Date: Sun Sep 09 2001 01:46:40 UTC

Timestamp: 1704067200
Date: Mon Jan 01 2024 00:00:00 UTC
\`\`\`

### Seconds vs Milliseconds

| System | Unit | Example |
|--------|------|---------|
| Unix/Linux | Seconds | 1704067200 |
| JavaScript | Milliseconds | 1704067200000 |
| Java (modern) | Milliseconds | 1704067200000 |

\`\`\`javascript
// JavaScript uses milliseconds
Date.now()                    // 1704067200000
new Date().getTime()          // 1704067200000

// Convert to seconds
Math.floor(Date.now() / 1000) // 1704067200
\`\`\`

### The Year 2038 Problem

32-bit systems store timestamps as signed integers:
- Max value: 2,147,483,647
- This represents: Tue Jan 19 2038 03:14:07 UTC

After this, the number overflows to negative, breaking date calculations. Modern 64-bit systems don't have this issue.

### Advantages of Timestamps

1. **Timezone agnostic**: Same value everywhere
2. **Easy math**: Add/subtract seconds directly
3. **Compact**: Single number vs date string
4. **Sortable**: Natural chronological order
5. **Unambiguous**: No date format confusion

### Common Operations

\`\`\`javascript
const now = Math.floor(Date.now() / 1000);

// Add 1 hour
const inOneHour = now + 3600;

// Add 1 day
const tomorrow = now + 86400;

// Difference in days
const days = Math.floor((timestamp2 - timestamp1) / 86400);
\`\`\`
`,
			},
			{
				id: "datetime-javascript",
				title: "Date and Time in JavaScript",
				description:
					"Working with dates, timestamps, and timezones in JavaScript.",
				tags: ["javascript", "code", "tutorial"],
				content: `
## JavaScript Date Handling

JavaScript's Date handling has quirks. Here's what you need to know.

### Creating Dates

\`\`\`javascript
// Current time
new Date()

// From timestamp (milliseconds!)
new Date(1704067200000)

// From string (ISO 8601)
new Date('2024-01-01T00:00:00Z')

// From components (month is 0-indexed!)
new Date(2024, 0, 1, 0, 0, 0) // Jan 1, 2024

// From Unix timestamp (seconds)
new Date(unixTimestamp * 1000)
\`\`\`

### Getting Components

\`\`\`javascript
const date = new Date();

date.getFullYear()    // 2024
date.getMonth()       // 0-11 (0 = January!)
date.getDate()        // 1-31 (day of month)
date.getDay()         // 0-6 (0 = Sunday)
date.getHours()       // 0-23
date.getMinutes()     // 0-59
date.getSeconds()     // 0-59
date.getMilliseconds() // 0-999

// UTC versions
date.getUTCFullYear()
date.getUTCMonth()
// etc.
\`\`\`

### Formatting

\`\`\`javascript
const date = new Date('2024-01-15T14:30:00Z');

// Built-in formatting
date.toISOString()      // "2024-01-15T14:30:00.000Z"
date.toLocaleDateString() // "1/15/2024" (locale-dependent)
date.toLocaleTimeString() // "2:30:00 PM"
date.toLocaleString()   // "1/15/2024, 2:30:00 PM"

// With options
date.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}); // "Monday, January 15, 2024"
\`\`\`

### Better: Use a Library

\`\`\`javascript
// date-fns (recommended)
import { format, addDays, differenceInDays } from 'date-fns';

format(new Date(), 'yyyy-MM-dd'); // "2024-01-15"
addDays(new Date(), 7);
differenceInDays(date1, date2);

// day.js (lightweight)
import dayjs from 'dayjs';

dayjs().format('YYYY-MM-DD');
dayjs().add(7, 'day');
dayjs(date1).diff(date2, 'day');
\`\`\`

### Timezone Handling

\`\`\`javascript
// Get timezone offset (minutes)
new Date().getTimezoneOffset() // -300 for EST

// Format with timezone
new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
}).format(new Date());
\`\`\`
`,
			},
		],
	},

	color: {
		toolId: "color",
		articles: [
			{
				id: "color-formats",
				title: "Understanding Color Formats",
				description:
					"HEX, RGB, HSL, and more: understanding different color representations.",
				tags: ["basics", "formats", "design"],
				content: `
## Color Formats Explained

Different color formats serve different purposes. Here's what each offers.

### HEX Colors

Hexadecimal representation of RGB values.

\`\`\`
#RRGGBB or #RGB (shorthand)

#FF5733  = RGB(255, 87, 51)
#F00     = #FF0000 = RGB(255, 0, 0)

With alpha:
#FF573380  = 50% transparent
\`\`\`

**Best for**: CSS, design tools, quick notation

### RGB / RGBA

Red, Green, Blue values (0-255).

\`\`\`css
rgb(255, 87, 51)
rgba(255, 87, 51, 0.5)  /* 50% transparent */

/* Modern syntax */
rgb(255 87 51)
rgb(255 87 51 / 50%)
\`\`\`

**Best for**: Programmatic color manipulation

### HSL / HSLA

Hue, Saturation, Lightness - more intuitive!

\`\`\`css
hsl(14, 100%, 60%)
hsla(14, 100%, 60%, 0.5)

/* Hue: 0-360 (color wheel position)
   Saturation: 0-100% (gray to vivid)
   Lightness: 0-100% (black to white) */
\`\`\`

**Best for**: Creating color variations, themes

### HSL Color Wheel

\`\`\`
  0° = Red
 60° = Yellow
120° = Green
180° = Cyan
240° = Blue
300° = Magenta
360° = Red (wraps around)
\`\`\`

### Conversion Formulas

\`\`\`javascript
// HEX to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// RGB to HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
\`\`\`

### Modern: OKLCH

Perceptually uniform color space (CSS Color Level 4).

\`\`\`css
oklch(70% 0.15 180)
/* Lightness, Chroma, Hue */
\`\`\`

**Best for**: Accessible color palettes, consistent perceived brightness
`,
			},
			{
				id: "color-accessibility",
				title: "Color Accessibility: Contrast and WCAG",
				description:
					"Ensuring your color choices are accessible to all users.",
				tags: ["accessibility", "wcag", "contrast"],
				content: `
## Color Accessibility

Good color choices ensure everyone can use your interface.

### WCAG Contrast Requirements

| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | 4.5:1 |

Large text = 18pt+ or 14pt+ bold

### Calculating Contrast

\`\`\`javascript
// Relative luminance
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast ratio
function contrast(rgb1, rgb2) {
  const l1 = luminance(...rgb1);
  const l2 = luminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Usage
contrast([0, 0, 0], [255, 255, 255]); // 21:1 (max)
contrast([255, 255, 255], [119, 119, 119]); // 4.5:1 (AA pass)
\`\`\`

### Color Blindness

~8% of men and ~0.5% of women have some form of color blindness.

| Type | Affected Colors | % of Population |
|------|-----------------|-----------------|
| Deuteranopia | Red-Green | ~6% of men |
| Protanopia | Red-Green | ~2% of men |
| Tritanopia | Blue-Yellow | ~0.01% |

### Best Practices

1. **Don't rely on color alone**
\`\`\`html
<!-- Bad: Only color indicates error -->
<input style="border-color: red">

<!-- Good: Icon + color + text -->
<input style="border-color: red">
<span class="error-icon">⚠</span>
<span>This field is required</span>
\`\`\`

2. **Use sufficient contrast**
\`\`\`css
/* Bad: Low contrast */
color: #999;
background: #fff;  /* 2.85:1 - fails AA */

/* Good: Sufficient contrast */
color: #595959;
background: #fff;  /* 7:1 - passes AAA */
\`\`\`

3. **Test with simulators**
- Chrome DevTools → Rendering → Emulate vision deficiencies
- Stark plugin (Figma)
- Color Oracle (desktop app)

4. **Use patterns with colors**
\`\`\`
Chart data: Use different line styles (solid, dashed)
             AND colors for each series
\`\`\`
`,
			},
		],
	},
};

// Helper function to get content for a specific tool
export function getToolContent(toolId: string): ToolContent | undefined {
	return toolContent[toolId];
}

// Helper function to get all articles across all tools (for search/indexing)
export function getAllArticles(): Array<Article & { toolId: string }> {
	return Object.entries(toolContent).flatMap(([toolId, content]) =>
		content.articles.map((article) => ({ ...article, toolId }))
	);
}
