// Structured FAQ data for tools and articles
// Organized for easy editing, parsing, and SEO optimization

export interface FAQItem {
	question: string;
	answer: string;
}

export interface ToolFAQ {
	toolId: string;
	faqs: FAQItem[];
}

// =============================================================================
// TOOL FAQs - Comprehensive Q&A for each developer tool
// =============================================================================

export const toolFAQs: Record<string, FAQItem[]> = {
	// =========================================================================
	// BASE64 ENCODER/DECODER
	// =========================================================================
	base64: [
		{
			question: "What is Base64 encoding?",
			answer:
				"Base64 is a binary-to-text encoding scheme that converts binary data into a string of ASCII characters. It uses 64 characters (A-Z, a-z, 0-9, +, /) to represent data, making it safe to transmit binary data over text-based protocols like email or HTTP.",
		},
		{
			question: "How do I encode text to Base64?",
			answer:
				"To encode text to Base64: 1) Enter or paste your text in the input field, 2) Select 'Encode' mode, 3) The Base64 encoded output appears instantly, 4) Click 'Copy' to copy the result. In JavaScript, you can use btoa() for ASCII text or the TextEncoder API for Unicode.",
		},
		{
			question: "How do I decode Base64 to text?",
			answer:
				"To decode Base64: 1) Paste your Base64 string in the input field, 2) Select 'Decode' mode, 3) The decoded text appears instantly, 4) Click 'Copy' to copy the result. In JavaScript, use atob() for ASCII or TextDecoder with Uint8Array for Unicode.",
		},
		{
			question: "Is Base64 encoding the same as encryption?",
			answer:
				"No, Base64 is NOT encryption. Base64 is an encoding scheme that can be easily reversed by anyone. It provides zero security. Never use Base64 to 'hide' passwords, API keys, or sensitive data. For security, use proper encryption algorithms like AES or hashing algorithms like bcrypt for passwords.",
		},
		{
			question: "Why does Base64 make data larger?",
			answer:
				"Base64 increases data size by approximately 33% because it converts every 3 bytes of binary data into 4 ASCII characters. This overhead is the trade-off for being able to safely transmit binary data through text-only channels.",
		},
		{
			question: "What is Base64 used for?",
			answer:
				"Common Base64 uses include: 1) Data URLs for embedding images in HTML/CSS, 2) Email attachments (MIME encoding), 3) Basic HTTP authentication headers, 4) Storing binary data in JSON or XML, 5) Encoding binary data for APIs, 6) JWT token segments.",
		},
		{
			question: "What is the difference between Base64 and Base64URL?",
			answer:
				"Base64URL is a URL-safe variant of Base64. It replaces '+' with '-' and '/' with '_', and typically omits padding '=' characters. This makes it safe for use in URLs and filenames without requiring additional encoding.",
		},
		{
			question: "Can Base64 encode any type of file?",
			answer:
				"Yes, Base64 can encode any binary file including images, PDFs, audio, video, and executables. However, remember that the encoded output will be ~33% larger than the original file, so it's not ideal for large files.",
		},
		{
			question: "How do I encode an image to Base64?",
			answer:
				"To encode an image to Base64: 1) Read the image file as binary data, 2) Convert the binary to Base64 string, 3) Prepend the data URL prefix (e.g., 'data:image/png;base64,'). In JavaScript, use FileReader.readAsDataURL() for the easiest approach.",
		},
		{
			question: "Why do I get 'invalid character' errors when decoding Base64?",
			answer:
				"Invalid character errors occur when: 1) The input contains characters outside the Base64 alphabet, 2) The string has incorrect padding, 3) There are hidden whitespace or newline characters. Clean your input and ensure it's valid Base64 before decoding.",
		},
	],

	// =========================================================================
	// URL ENCODER/DECODER
	// =========================================================================
	url: [
		{
			question: "What is URL encoding?",
			answer:
				"URL encoding (also called percent-encoding) converts special characters in URLs to a format that can be safely transmitted. Characters are replaced with '%' followed by their hexadecimal ASCII value (e.g., space becomes %20, & becomes %26).",
		},
		{
			question: "Why do URLs need encoding?",
			answer:
				"URLs can only contain a limited set of ASCII characters. Special characters like spaces, &, =, ?, and non-ASCII characters must be encoded to avoid breaking URL structure or causing security issues. Encoding ensures URLs work correctly across all systems.",
		},
		{
			question: "What is the difference between encodeURI and encodeURIComponent?",
			answer:
				"encodeURI() encodes a complete URL, preserving characters with special URL meaning (: / ? & = #). encodeURIComponent() encodes ALL special characters, making it suitable for encoding values within query parameters. Use encodeURIComponent() for user input in URLs.",
		},
		{
			question: "How do I encode a URL with special characters?",
			answer:
				"To encode a URL: 1) Enter your URL or text in the input field, 2) Select 'Encode' mode, 3) Copy the encoded result. For query parameters specifically, use encodeURIComponent() in JavaScript: `?q=${encodeURIComponent(userInput)}`.",
		},
		{
			question: "How do I decode a URL-encoded string?",
			answer:
				"To decode a URL: 1) Paste the encoded URL in the input field, 2) Select 'Decode' mode, 3) The decoded result appears instantly. In JavaScript, use decodeURIComponent() for query parameters or decodeURI() for complete URLs.",
		},
		{
			question: "What characters need to be URL encoded?",
			answer:
				"Characters that must be encoded include: spaces (%20), ampersand & (%26), equals = (%3D), question mark ? (%3F), hash # (%23), percent % (%25), and all non-ASCII characters. Reserved characters depend on context within the URL.",
		},
		{
			question: "Should spaces be encoded as %20 or +?",
			answer:
				"In query strings, spaces can be encoded as either %20 or +. The + notation is specific to application/x-www-form-urlencoded format. For path segments and general use, %20 is preferred. Modern JavaScript's URL API uses + for query parameters.",
		},
		{
			question: "What is double encoding and why is it a problem?",
			answer:
				"Double encoding occurs when already-encoded characters get encoded again (e.g., %20 becomes %2520). This causes URLs to fail because the server sees literal '%20' instead of a space. Always decode before re-encoding if unsure.",
		},
		{
			question: "How do I encode Unicode characters in URLs?",
			answer:
				"Unicode characters are first converted to UTF-8 bytes, then each byte is percent-encoded. For example, '日' becomes %E6%97%A5. JavaScript's encodeURIComponent() handles this automatically.",
		},
		{
			question: "How can URL encoding prevent security vulnerabilities?",
			answer:
				"Proper URL encoding prevents injection attacks by ensuring user input cannot break out of its intended context. Always encode user-supplied values in URLs using encodeURIComponent() to prevent XSS, open redirects, and parameter pollution attacks.",
		},
	],

	// =========================================================================
	// JWT DECODER
	// =========================================================================
	jwt: [
		{
			question: "What is a JWT (JSON Web Token)?",
			answer:
				"A JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It consists of three parts: Header (algorithm and type), Payload (claims/data), and Signature (verification). JWTs are commonly used for authentication and authorization.",
		},
		{
			question: "How do I decode a JWT token?",
			answer:
				"To decode a JWT: 1) Paste your JWT token in the input field, 2) The tool instantly displays the decoded Header and Payload, 3) View the claims including expiration time, issuer, and custom data. Note: Decoding reveals the data but doesn't verify the signature.",
		},
		{
			question: "Is it safe to decode JWTs in the browser?",
			answer:
				"Yes, decoding JWTs in the browser is safe because the payload is only Base64-encoded, not encrypted. Anyone can decode a JWT. However, this tool processes tokens entirely in your browser - they're never sent to any server, protecting your sensitive tokens.",
		},
		{
			question: "What is the difference between JWT encoding and encryption?",
			answer:
				"JWTs are encoded (Base64URL), not encrypted. The payload can be read by anyone. The signature only ensures integrity (data hasn't been tampered with), not confidentiality. For sensitive data, use JWE (JSON Web Encryption) or don't include sensitive data in JWTs.",
		},
		{
			question: "What are JWT claims?",
			answer:
				"Claims are statements about the subject (user) and metadata. Standard claims include: iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at), nbf (not before). Custom claims can include user roles, permissions, or other application-specific data.",
		},
		{
			question: "How do I check if a JWT is expired?",
			answer:
				"Check the 'exp' (expiration) claim in the decoded payload. This is a Unix timestamp. Compare it with the current time: if current time > exp, the token is expired. Our decoder shows the expiration time in human-readable format and indicates if expired.",
		},
		{
			question: "What algorithms are used to sign JWTs?",
			answer:
				"Common JWT signing algorithms include: HS256 (HMAC with SHA-256) using a shared secret, RS256 (RSA with SHA-256) using public/private key pairs, and ES256 (ECDSA with SHA-256). The algorithm is specified in the JWT header's 'alg' field.",
		},
		{
			question: "Can I verify a JWT signature in this tool?",
			answer:
				"This tool decodes and displays JWT contents but doesn't verify signatures (which requires the secret/private key). For security, always verify signatures server-side using libraries like jsonwebtoken (Node.js), PyJWT (Python), or similar.",
		},
		{
			question: "What should NOT be stored in a JWT?",
			answer:
				"Never store sensitive data in JWTs: passwords, credit card numbers, social security numbers, or any PII that shouldn't be exposed. Remember, JWTs can be decoded by anyone. Store only necessary claims like user ID, roles, and expiration.",
		},
		{
			question: "What is the difference between JWT and session-based authentication?",
			answer:
				"JWTs are stateless (server doesn't store session data) while sessions are stateful (stored server-side). JWTs scale better across servers and work well for APIs/mobile apps. Sessions offer easier revocation and smaller token size. Many apps use a hybrid approach.",
		},
	],

	// =========================================================================
	// QR CODE GENERATOR
	// =========================================================================
	qr: [
		{
			question: "How do I generate a QR code?",
			answer:
				"To generate a QR code: 1) Enter your text, URL, or data in the input field, 2) Adjust size and error correction if needed, 3) The QR code generates instantly, 4) Download as PNG or SVG, or copy the image. The tool supports URLs, plain text, WiFi credentials, and more.",
		},
		{
			question: "What is the maximum data a QR code can store?",
			answer:
				"QR code capacity depends on the data type and error correction level. Maximum capacities: 7,089 numeric characters, 4,296 alphanumeric characters, 2,953 bytes of binary data, or 1,817 Japanese Kanji characters. Practical limits are often lower for reliable scanning.",
		},
		{
			question: "What is QR code error correction?",
			answer:
				"Error correction allows QR codes to be read even when partially damaged or obscured. Four levels exist: L (7% recovery), M (15%), Q (25%), and H (30%). Higher levels mean more redundancy but also larger codes. Use H for printed codes that may get damaged.",
		},
		{
			question: "What size should my QR code be?",
			answer:
				"QR code size depends on scanning distance and content. General guidelines: 2cm (0.8in) minimum for close scanning, 10x scanning distance for optimal size (10cm QR for 1m distance). More data requires larger codes. Test with multiple devices before printing.",
		},
		{
			question: "Can I customize QR code colors?",
			answer:
				"Yes, QR codes can be customized with different colors. Ensure sufficient contrast between foreground and background (dark on light works best). Avoid red/green combinations and maintain at least 40% contrast ratio for reliable scanning.",
		},
		{
			question: "What is the difference between PNG and SVG QR codes?",
			answer:
				"PNG is a raster format with fixed resolution - good for web and specific print sizes. SVG is vector format that scales infinitely without quality loss - ideal for printing at any size. Use SVG for print materials and PNG for digital displays.",
		},
		{
			question: "How do I create a QR code for WiFi?",
			answer:
				"WiFi QR codes use the format: WIFI:T:WPA;S:NetworkName;P:Password;; Enter this string or use a WiFi QR generator that creates this format. When scanned, phones can automatically connect to the network.",
		},
		{
			question: "Can QR codes contain malicious content?",
			answer:
				"QR codes themselves aren't malicious, but they can link to harmful URLs. Always preview links before visiting, use QR scanners that show URL previews, and be cautious of QR codes in public places that could be malicious overlays.",
		},
		{
			question: "How long do QR codes last?",
			answer:
				"Static QR codes (with data encoded directly) last forever - they're just images. Dynamic QR codes (linking to a service) depend on the provider. Printed QR codes last as long as they remain scannable. There's no expiration built into QR technology.",
		},
		{
			question: "Why won't my QR code scan?",
			answer:
				"Common scanning issues: 1) Insufficient contrast between colors, 2) QR code too small for distance, 3) Blurry or damaged image, 4) Too much data causing dense pattern, 5) Glare or poor lighting. Try increasing size, using high error correction, and ensuring good contrast.",
		},
	],

	// =========================================================================
	// JSON FORMATTER
	// =========================================================================
	json: [
		{
			question: "How do I format JSON online?",
			answer:
				"To format JSON: 1) Paste your JSON in the input field, 2) Click 'Format' or it formats automatically, 3) The beautified JSON appears with proper indentation, 4) Copy the formatted result. The tool validates syntax and highlights any errors.",
		},
		{
			question: "How do I validate JSON syntax?",
			answer:
				"Paste your JSON into the tool - it automatically validates syntax. Invalid JSON shows an error message with the line number and description of the problem. Common issues include missing quotes, trailing commas, and unescaped special characters.",
		},
		{
			question: "What is the difference between JSON.parse and JSON.stringify?",
			answer:
				"JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() converts a JavaScript object into a JSON string. Use parse() when receiving JSON data, stringify() when sending data or storing objects as text.",
		},
		{
			question: "Why is my JSON invalid?",
			answer:
				"Common JSON errors: 1) Single quotes instead of double quotes, 2) Trailing commas after last item, 3) Unquoted property names, 4) Comments (not allowed in JSON), 5) Undefined or function values, 6) Unescaped control characters in strings.",
		},
		{
			question: "How do I minify JSON?",
			answer:
				"To minify JSON: 1) Paste your JSON in the input, 2) Select 'Minify' mode, 3) Copy the compacted result. Minification removes all whitespace and newlines, reducing file size for production use while keeping the data identical.",
		},
		{
			question: "What data types does JSON support?",
			answer:
				"JSON supports six data types: strings (double-quoted), numbers (integer or floating-point), booleans (true/false), null, arrays (ordered lists), and objects (key-value pairs). It does NOT support undefined, functions, dates, or special number values like NaN/Infinity.",
		},
		{
			question: "How do I handle dates in JSON?",
			answer:
				"JSON has no native date type. Common approaches: 1) ISO 8601 strings ('2024-01-15T00:00:00Z'), 2) Unix timestamps (1705276800), 3) Custom string formats. Use a reviver function with JSON.parse() to convert date strings back to Date objects.",
		},
		{
			question: "Can JSON have comments?",
			answer:
				"No, standard JSON does not support comments. If you need comments, consider: 1) Using JSONC (JSON with Comments) for config files, 2) Adding a '_comment' field, 3) Using YAML instead. Most JSON parsers will error on comments.",
		},
		{
			question: "What is JSON Schema?",
			answer:
				"JSON Schema is a vocabulary for validating JSON documents. It defines the structure, data types, and constraints of your JSON data. Use it for API validation, form generation, and documentation. Libraries like Ajv (JavaScript) implement validation.",
		},
		{
			question: "How do I pretty print JSON in JavaScript?",
			answer:
				"Use JSON.stringify() with spacing: JSON.stringify(obj, null, 2) for 2-space indentation. The second argument is a replacer function (null for none), the third is the indentation (number of spaces or string like '\\t' for tabs).",
		},
	],

	// =========================================================================
	// UUID GENERATOR
	// =========================================================================
	uuid: [
		{
			question: "What is a UUID?",
			answer:
				"A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time. Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. UUIDs are used as database primary keys, session IDs, and anywhere globally unique identifiers are needed.",
		},
		{
			question: "What is the difference between UUID v4 and v7?",
			answer:
				"UUID v4 is randomly generated (122 random bits), offering maximum randomness but no ordering. UUID v7 combines a Unix timestamp with random bits, making it chronologically sortable while remaining unique. v7 is better for database performance due to sequential ordering.",
		},
		{
			question: "How do I generate a UUID?",
			answer:
				"To generate a UUID: 1) Select the version (v4 or v7), 2) Choose quantity (single or bulk), 3) Click 'Generate', 4) Copy the UUID(s). In JavaScript, use crypto.randomUUID() for v4, or libraries like 'uuid' for other versions.",
		},
		{
			question: "Are UUIDs guaranteed to be unique?",
			answer:
				"UUIDs are designed to be unique without central coordination. UUID v4 collision probability is astronomically low - you'd need to generate 1 billion UUIDs per second for 85 years to have a 50% chance of one collision. For practical purposes, they're unique.",
		},
		{
			question: "Should I use UUID or auto-increment for database IDs?",
			answer:
				"UUIDs are better for: distributed systems, security (non-guessable), and data merging. Auto-increment is better for: smaller storage, simpler queries, and single-database systems. UUID v7 offers a middle ground with sortability and distributed generation.",
		},
		{
			question: "How do I store UUIDs in a database?",
			answer:
				"Storage options: 1) Native UUID type (PostgreSQL, MySQL 8+) - most efficient, 2) BINARY(16) - compact storage, 3) VARCHAR(36) - human-readable but larger. PostgreSQL's UUID type is recommended; for MySQL, use BINARY(16) with UUID_TO_BIN().",
		},
		{
			question: "What is a GUID?",
			answer:
				"GUID (Globally Unique Identifier) is Microsoft's term for UUID. They're functionally identical - same format, same generation methods. Use 'UUID' in cross-platform contexts, 'GUID' in Microsoft/.NET environments.",
		},
		{
			question: "Can I generate UUIDs in JavaScript?",
			answer:
				"Yes! Modern browsers and Node.js support crypto.randomUUID() for UUID v4. For v7 or other versions, use the 'uuid' npm package: import { v4, v7 } from 'uuid'. Avoid Math.random()-based implementations for production use.",
		},
		{
			question: "What are nil and max UUIDs?",
			answer:
				"Nil UUID is all zeros (00000000-0000-0000-0000-000000000000), often used as a placeholder or null value. Max UUID is all f's (ffffffff-ffff-ffff-ffff-ffffffffffff). Both are valid UUIDs with special conventional meanings.",
		},
		{
			question: "How do I validate a UUID format?",
			answer:
				"Use regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i. This validates the format and version/variant bits. For stricter validation, check the version digit (position 15) matches expected version (1-7).",
		},
	],

	// =========================================================================
	// HASH GENERATOR
	// =========================================================================
	hash: [
		{
			question: "What is a hash function?",
			answer:
				"A hash function takes input of any size and produces a fixed-size output (digest). Properties: deterministic (same input = same output), one-way (can't reverse), collision-resistant (hard to find two inputs with same hash), and avalanche effect (small change = completely different hash).",
		},
		{
			question: "What is the difference between MD5, SHA-1, and SHA-256?",
			answer:
				"MD5 (128-bit) and SHA-1 (160-bit) are broken - collisions have been found. SHA-256 (256-bit) remains secure. Use SHA-256 or SHA-3 for security-critical applications. MD5/SHA-1 are only acceptable for non-security checksums.",
		},
		{
			question: "How do I generate a SHA-256 hash?",
			answer:
				"To generate a hash: 1) Enter your text in the input field, 2) Select SHA-256 from the algorithm options, 3) The hash generates instantly, 4) Copy the hexadecimal result. In JavaScript, use the Web Crypto API: crypto.subtle.digest('SHA-256', data).",
		},
		{
			question: "Can I reverse a hash to get the original text?",
			answer:
				"No, hash functions are one-way by design. You cannot mathematically reverse a hash. Attackers use rainbow tables (precomputed hashes) or brute force to guess inputs. This is why salting is important for password hashing.",
		},
		{
			question: "Should I use hashing for passwords?",
			answer:
				"Not regular hashing. Use password-specific algorithms: bcrypt, Argon2, or PBKDF2. These are intentionally slow and include salting. Regular SHA-256 is too fast - attackers can try billions of guesses per second. bcrypt/Argon2 limit attempts.",
		},
		{
			question: "What is a salt in hashing?",
			answer:
				"A salt is random data added to input before hashing. It ensures identical inputs produce different hashes, defeating rainbow table attacks. Each password should have a unique salt, stored alongside the hash. Password algorithms like bcrypt handle salting automatically.",
		},
		{
			question: "What is the difference between hashing and encryption?",
			answer:
				"Hashing is one-way - you cannot recover the original data. Encryption is two-way - data can be decrypted with the key. Use hashing for data integrity and passwords; use encryption when you need to retrieve the original data.",
		},
		{
			question: "What hash algorithm should I use?",
			answer:
				"For security: SHA-256 or SHA-3. For passwords: Argon2id or bcrypt. For checksums: SHA-256 or BLAKE3. For hash tables (non-crypto): MurmurHash or xxHash. Never use MD5 or SHA-1 for security purposes.",
		},
		{
			question: "How do I verify file integrity with hashes?",
			answer:
				"Generate a hash of the file, then compare with the expected hash. If they match, the file is intact. Many downloads provide SHA-256 checksums. Use: shasum -a 256 filename (Unix) or Get-FileHash (PowerShell) to verify.",
		},
		{
			question: "What is HMAC?",
			answer:
				"HMAC (Hash-based Message Authentication Code) combines a hash function with a secret key. It verifies both data integrity AND authenticity. Unlike plain hashing, HMAC proves the sender knew the secret key. Used in JWT signatures, API authentication, and secure cookies.",
		},
	],

	// =========================================================================
	// PASSWORD GENERATOR
	// =========================================================================
	password: [
		{
			question: "How do I generate a secure password?",
			answer:
				"To generate a secure password: 1) Set desired length (16+ characters recommended), 2) Enable character types (uppercase, lowercase, numbers, symbols), 3) Click 'Generate', 4) Copy and store in a password manager. The tool uses cryptographically secure random generation.",
		},
		{
			question: "What makes a password secure?",
			answer:
				"Secure passwords have: 1) Length (16+ characters), 2) Complexity (mixed character types), 3) Randomness (not based on words or patterns), 4) Uniqueness (different for each account). Length is most important - a 20-character password is stronger than an 8-character complex one.",
		},
		{
			question: "What is password entropy?",
			answer:
				"Entropy measures password strength in bits. Formula: log2(characters^length). Higher entropy = harder to crack. 60 bits minimum for important accounts, 80+ bits for sensitive data. A 16-character alphanumeric password has ~95 bits of entropy.",
		},
		{
			question: "How long should my password be?",
			answer:
				"Minimum 12 characters, recommended 16+ characters. For high-security accounts (banking, primary email), use 20+ characters or a passphrase. Length beats complexity - 'correcthorsebatterystaple' is stronger than 'Tr0ub4dor&3'.",
		},
		{
			question: "Are passphrases better than random passwords?",
			answer:
				"Passphrases (4-6 random words) offer good security with better memorability. A 4-word passphrase from a 7,776-word list has ~51 bits entropy. Random passwords are more compact but harder to remember. Use passphrases for memorable passwords, random strings for password managers.",
		},
		{
			question: "Why shouldn't I use common passwords?",
			answer:
				"Common passwords are in breach databases and cracking dictionaries. Attackers try these first. '123456', 'password', and 'qwerty' are cracked instantly. Even variations like 'P@ssw0rd' are well-known. Always use randomly generated passwords.",
		},
		{
			question: "Should I include special characters in passwords?",
			answer:
				"Special characters add complexity but aren't essential if length is sufficient. A 20-character alphanumeric password is stronger than a 10-character password with symbols. Include symbols if required, but prioritize length and randomness.",
		},
		{
			question: "How often should I change my password?",
			answer:
				"Change passwords only when: 1) You suspect compromise, 2) After a service breach, 3) When leaving an organization. Routine rotation often leads to weaker passwords. Use unique, strong passwords and a password manager instead of frequent changes.",
		},
		{
			question: "What is a password manager?",
			answer:
				"A password manager securely stores all your passwords, encrypted with one master password. Benefits: unique passwords per site, strong random generation, auto-fill convenience. Popular options: 1Password, Bitwarden, KeePass. Essential for good password hygiene.",
		},
		{
			question: "Is this password generator secure?",
			answer:
				"Yes, this generator uses the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. Passwords are generated entirely in your browser and never sent to any server. The source code is open for inspection.",
		},
	],

	// =========================================================================
	// YAML CONVERTER
	// =========================================================================
	yaml: [
		{
			question: "How do I convert YAML to JSON?",
			answer:
				"To convert YAML to JSON: 1) Paste your YAML in the input field, 2) Select 'YAML to JSON' mode, 3) The JSON output appears instantly, 4) Copy or download the result. The tool validates YAML syntax and shows helpful error messages.",
		},
		{
			question: "How do I convert JSON to YAML?",
			answer:
				"To convert JSON to YAML: 1) Paste your JSON in the input field, 2) Select 'JSON to YAML' mode, 3) The YAML output appears with proper formatting, 4) Copy the result. The tool handles nested objects, arrays, and all JSON data types.",
		},
		{
			question: "What is the difference between YAML and JSON?",
			answer:
				"YAML is more human-readable with minimal syntax (uses indentation, allows comments). JSON is more universal with strict syntax (braces, quotes, no comments). YAML is popular for configuration files; JSON for APIs and data exchange. YAML is a superset of JSON.",
		},
		{
			question: "Does YAML support comments?",
			answer:
				"Yes, YAML supports comments using #. Everything after # on a line is ignored. This makes YAML popular for configuration files. JSON does not support comments, which is one reason teams choose YAML for configs.",
		},
		{
			question: "What are common YAML syntax errors?",
			answer:
				"Common YAML errors: 1) Incorrect indentation (must use spaces, not tabs), 2) Missing space after colon, 3) Inconsistent indentation levels, 4) Unquoted special characters, 5) Wrong multiline string syntax. Always use consistent 2-space indentation.",
		},
		{
			question: "How do I write multiline strings in YAML?",
			answer:
				"YAML multiline options: 1) Literal block '|' preserves newlines, 2) Folded block '>' joins lines with spaces, 3) Quoted strings with \\n. Use '|' for scripts/code, '>' for long text that should wrap. Add '-' for chomping (|-, >-).",
		},
		{
			question: "What data types does YAML support?",
			answer:
				"YAML supports: strings (quoted or unquoted), numbers (int/float), booleans (true/false, yes/no, on/off), null (~, null, empty), arrays (- items or [inline]), objects (key: value or {inline}), dates (2024-01-15), and binary (!!binary).",
		},
		{
			question: "Is YAML used in Kubernetes?",
			answer:
				"Yes, Kubernetes uses YAML extensively for resource definitions (pods, deployments, services). YAML's readability and comment support make it ideal for infrastructure-as-code. Most DevOps tools (Docker Compose, GitHub Actions, Ansible) also use YAML.",
		},
		{
			question: "How do I reference other values in YAML?",
			answer:
				"YAML supports anchors (&) and aliases (*) for referencing. Define with '&name' and reference with '*name'. For merging, use '<<: *name'. This reduces duplication in complex configs. Example: '&defaults' then '<<: *defaults' in another section.",
		},
		{
			question: "Should I use YAML or JSON for my config file?",
			answer:
				"Use YAML for: human-edited configs, files needing comments, Kubernetes/DevOps tools. Use JSON for: API responses, programmatic generation, strict parsing needs. YAML is more readable; JSON is more universal. Both are valid choices.",
		},
	],

	// =========================================================================
	// REGEX TESTER
	// =========================================================================
	regex: [
		{
			question: "How do I test a regular expression?",
			answer:
				"To test a regex: 1) Enter your pattern in the regex field, 2) Add test text in the input area, 3) See matches highlighted in real-time, 4) View capture groups and match details. Add flags like 'g' (global) and 'i' (case-insensitive) as needed.",
		},
		{
			question: "What are regex flags?",
			answer:
				"Common regex flags: g (global - find all matches), i (case-insensitive), m (multiline - ^ and $ match line boundaries), s (dotall - . matches newlines), u (unicode), y (sticky). Combine flags: /pattern/gi for global case-insensitive matching.",
		},
		{
			question: "How do I match an email address with regex?",
			answer:
				"Simple email regex: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/. This validates basic format. Full RFC 5322 compliance is extremely complex. For production, use established validation libraries or send a confirmation email instead of complex regex.",
		},
		{
			question: "What is the difference between * and + in regex?",
			answer:
				"* matches zero or more occurrences (optional, any count). + matches one or more occurrences (at least one required). Examples: /a*/ matches '', 'a', 'aaa'; /a+/ matches 'a', 'aaa' but not ''. Use * for optional repetition, + for required.",
		},
		{
			question: "How do capture groups work in regex?",
			answer:
				"Capture groups () save matched content for later use. Access in JavaScript: match[1], match[2], etc. Named groups: (?<name>pattern) accessed as match.groups.name. Non-capturing groups (?:pattern) group without capturing. Use for extraction and replacement.",
		},
		{
			question: "What is the difference between greedy and lazy matching?",
			answer:
				"Greedy (default) matches as much as possible: /.+/ matches entire string. Lazy (add ?) matches as little as possible: /.+?/ matches minimal content. Example: /<.+>/ on '<a><b>' matches '<a><b>'; /<.+?>/ matches '<a>' then '<b>'.",
		},
		{
			question: "How do I escape special characters in regex?",
			answer:
				"Escape with backslash: \\. \\* \\+ \\? \\[ \\] \\( \\) \\{ \\} \\^ \\$ \\| \\\\. In JavaScript strings, double-escape: '\\\\.' for literal dot. Or use new RegExp(string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')) to escape user input.",
		},
		{
			question: "What are lookahead and lookbehind assertions?",
			answer:
				"Lookahead (?=pattern) matches if followed by pattern, (?!pattern) if not. Lookbehind (?<=pattern) matches if preceded by pattern, (?<!pattern) if not. They don't consume characters. Example: /\\d+(?=px)/ matches '10' in '10px' but not in '10em'.",
		},
		{
			question: "How do I match a word boundary in regex?",
			answer:
				"Use \\b for word boundaries (between \\w and \\W characters). /\\bcat\\b/ matches 'cat' but not 'category' or 'bobcat'. \\B matches non-boundaries. Word boundaries are essential for matching whole words in text.",
		},
		{
			question: "Why is my regex slow?",
			answer:
				"Slow regex causes: 1) Catastrophic backtracking from nested quantifiers like (a+)+, 2) Overly broad patterns with .* 3) Excessive alternation. Solutions: use atomic groups, possessive quantifiers, or specific character classes instead of dot-star.",
		},
	],

	// =========================================================================
	// TIMESTAMP CONVERTER
	// =========================================================================
	timestamp: [
		{
			question: "What is a Unix timestamp?",
			answer:
				"A Unix timestamp is the number of seconds (or milliseconds) since January 1, 1970, 00:00:00 UTC (the Unix epoch). It's a universal way to represent time as a single number, independent of timezone, used extensively in programming and databases.",
		},
		{
			question: "How do I convert a timestamp to a date?",
			answer:
				"To convert a timestamp: 1) Enter the Unix timestamp, 2) Select seconds or milliseconds, 3) See the human-readable date instantly. In JavaScript: new Date(timestamp * 1000) for seconds, new Date(timestamp) for milliseconds.",
		},
		{
			question: "How do I get the current Unix timestamp?",
			answer:
				"In JavaScript: Date.now() returns milliseconds, Math.floor(Date.now() / 1000) for seconds. In Python: import time; time.time(). In command line: date +%s (Unix/Mac). Our tool shows the current timestamp updating in real-time.",
		},
		{
			question: "What is the difference between seconds and milliseconds timestamps?",
			answer:
				"Seconds timestamps are 10 digits (e.g., 1705276800), milliseconds are 13 digits (e.g., 1705276800000). JavaScript Date uses milliseconds, Unix traditionally uses seconds. Check digit count to determine format. Our tool auto-detects and handles both.",
		},
		{
			question: "How do I convert a date to a Unix timestamp?",
			answer:
				"Enter a date/time in the input field and get the timestamp. In JavaScript: new Date('2024-01-15').getTime() for milliseconds, divide by 1000 for seconds. Use Date.UTC() for UTC-based conversion without timezone offset.",
		},
		{
			question: "What is the Year 2038 problem?",
			answer:
				"32-bit systems store timestamps as signed integers, maxing out at 2,147,483,647 (January 19, 2038, 03:14:07 UTC). After this, timestamps overflow and become negative. 64-bit systems extend this by billions of years. Most modern systems are 64-bit.",
		},
		{
			question: "How do I handle timezones with timestamps?",
			answer:
				"Unix timestamps are always UTC - they represent a single moment in time. When displaying, convert to local timezone: new Date(timestamp * 1000).toLocaleString(). Store/transmit as UTC, convert to local only for display.",
		},
		{
			question: "What is ISO 8601 date format?",
			answer:
				"ISO 8601 is the international standard format: 2024-01-15T14:30:00Z. The T separates date and time, Z indicates UTC. With offset: 2024-01-15T14:30:00+05:30. It's unambiguous, sortable, and widely supported. Use toISOString() in JavaScript.",
		},
		{
			question: "How do I calculate the difference between two timestamps?",
			answer:
				"Subtract timestamps to get difference in seconds/milliseconds. Convert to meaningful units: diff / 60 for minutes, / 3600 for hours, / 86400 for days. For complex calculations (months, years), use libraries like date-fns or Luxon.",
		},
		{
			question: "Can timestamps be negative?",
			answer:
				"Yes, negative timestamps represent dates before January 1, 1970. For example, -86400 is December 31, 1969. JavaScript handles negative timestamps correctly: new Date(-86400000) works. Useful for historical dates.",
		},
	],

	// =========================================================================
	// DIFF CHECKER
	// =========================================================================
	diff: [
		{
			question: "How do I compare two texts?",
			answer:
				"To compare texts: 1) Paste the original text in the left panel, 2) Paste the modified text in the right panel, 3) Differences are highlighted automatically. Red shows deletions, green shows additions. Use inline or side-by-side view.",
		},
		{
			question: "What do the colors in diff output mean?",
			answer:
				"Red/minus (-) indicates removed content from the original. Green/plus (+) indicates added content in the new version. Yellow/tilde (~) may indicate modified lines. Unchanged content appears in normal color.",
		},
		{
			question: "What is the difference between unified and side-by-side diff?",
			answer:
				"Unified diff shows changes inline with context, using +/- markers. Side-by-side shows original and modified text in parallel columns. Unified is compact and good for patches; side-by-side is more visual and easier to review.",
		},
		{
			question: "Can I compare code files?",
			answer:
				"Yes, this tool works with any text including code. For best results with code: enable whitespace comparison if indentation matters, use side-by-side view for readability. The tool handles any programming language.",
		},
		{
			question: "How do I ignore whitespace in comparisons?",
			answer:
				"Toggle 'Ignore whitespace' to exclude spacing differences. Useful when comparing code reformatted with different styles. Options may include: ignore all whitespace, ignore trailing whitespace, or ignore blank lines.",
		},
		{
			question: "What is a diff algorithm?",
			answer:
				"Diff algorithms find the minimum set of changes between two texts. Common algorithms: Myers (default in git, optimal), patience (better for code), histogram (improved Myers). This tool uses efficient algorithms for accurate, fast comparisons.",
		},
		{
			question: "How do I create a patch file from a diff?",
			answer:
				"A patch file contains diff output that can be applied to transform one file into another. Use unified diff format with context lines. Apply with: patch < file.patch. Useful for sharing changes without sending full files.",
		},
		{
			question: "Can I compare JSON files?",
			answer:
				"Yes, paste JSON in both panels. For semantic comparison (ignoring formatting), format both JSON files first, then compare. This shows actual data differences rather than whitespace changes.",
		},
		{
			question: "What is three-way merge?",
			answer:
				"Three-way merge compares two modified versions against a common ancestor, automatically merging non-conflicting changes. Used by git for branch merging. This tool does two-way comparison; for three-way, use git merge tools.",
		},
		{
			question: "How do I compare large files?",
			answer:
				"This tool handles reasonably large files in the browser. For very large files: 1) Compare specific sections, 2) Use command-line tools like diff or git diff, 3) Consider specialized diff tools for binary or huge files.",
		},
	],

	// =========================================================================
	// CRON PARSER
	// =========================================================================
	cron: [
		{
			question: "What is a cron expression?",
			answer:
				"A cron expression defines a schedule for recurring tasks. Standard format has 5 fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6). Example: '0 9 * * 1-5' means 9:00 AM on weekdays.",
		},
		{
			question: "How do I read a cron expression?",
			answer:
				"Read left to right: minute, hour, day-of-month, month, day-of-week. * means 'any'. Example: '30 14 * * *' = 'At minute 30 of hour 14 (2:30 PM), every day of month, every month, every day of week' = daily at 2:30 PM.",
		},
		{
			question: "What does * mean in cron?",
			answer:
				"* (asterisk) means 'every' or 'any value'. In the minute field, * means every minute. Combined with other fields: '* * * * *' runs every minute; '0 * * * *' runs every hour at minute 0; '0 0 * * *' runs daily at midnight.",
		},
		{
			question: "How do I run a cron job every 5 minutes?",
			answer:
				"Use */5 in the minute field: '*/5 * * * *'. The /5 means 'every 5th'. This runs at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 of every hour. Alternative: '0,5,10,15,20,25,30,35,40,45,50,55 * * * *'.",
		},
		{
			question: "How do I schedule a job for specific days?",
			answer:
				"Use day fields: '0 9 * * 1-5' for weekdays (Mon-Fri) at 9 AM. '0 9 * * 0,6' for weekends. '0 9 1,15 * *' for 1st and 15th of each month. Combine with month field for specific dates: '0 0 25 12 *' for Christmas midnight.",
		},
		{
			question: "What is the difference between cron and crontab?",
			answer:
				"Cron is the daemon (service) that runs scheduled tasks. Crontab (cron table) is the file containing your scheduled jobs. Edit with 'crontab -e', list with 'crontab -l'. Each line in crontab is: schedule + command.",
		},
		{
			question: "How do I use ranges and lists in cron?",
			answer:
				"Ranges: 1-5 means 1,2,3,4,5. Lists: 1,3,5 means exactly those values. Combine: 1-5,15,30 means 1-5 and 15 and 30. Steps: 0-30/5 means 0,5,10,15,20,25,30. These work in any field.",
		},
		{
			question: "What are special cron strings?",
			answer:
				"Some systems support shortcuts: @yearly (0 0 1 1 *), @monthly (0 0 1 * *), @weekly (0 0 * * 0), @daily (0 0 * * *), @hourly (0 * * * *), @reboot (run once at startup). Not supported in all cron implementations.",
		},
		{
			question: "Why is my cron job not running?",
			answer:
				"Common issues: 1) Wrong timezone (cron uses system time), 2) Path issues (use absolute paths), 3) Permissions (check file and cron permissions), 4) Syntax errors (validate expression), 5) Output not captured (redirect to log file).",
		},
		{
			question: "How do I debug cron jobs?",
			answer:
				"Debugging steps: 1) Check cron logs (/var/log/cron or journalctl), 2) Redirect output: command >> /tmp/cron.log 2>&1, 3) Test command manually first, 4) Check environment variables (cron has minimal environment), 5) Use full paths for commands.",
		},
	],

	// =========================================================================
	// COLOR CONVERTER
	// =========================================================================
	color: [
		{
			question: "How do I convert HEX to RGB?",
			answer:
				"Enter a HEX color (e.g., #FF5733) and see the RGB values instantly. Manual conversion: split into pairs (FF, 57, 33), convert each from hexadecimal to decimal (255, 87, 51). Result: rgb(255, 87, 51).",
		},
		{
			question: "What is the difference between HEX and RGB?",
			answer:
				"HEX uses hexadecimal notation (#RRGGBB), compact for CSS. RGB uses decimal (rgb(R, G, B)), range 0-255 each. They represent the same colors differently. HEX is more common in design tools; RGB is used in programming and allows alpha channel (RGBA).",
		},
		{
			question: "What is HSL color format?",
			answer:
				"HSL stands for Hue, Saturation, Lightness. Hue is the color angle (0-360°), saturation is intensity (0-100%), lightness is brightness (0-100%). HSL is intuitive for color adjustments: changing hue shifts the color, saturation affects vibrancy, lightness affects darkness/brightness.",
		},
		{
			question: "How do I find complementary colors?",
			answer:
				"Complementary colors are opposite on the color wheel (180° apart in HSL). For any color, add 180 to its hue value. Example: blue (hue 240°) complements orange (hue 60°). Complementary colors create high contrast and visual interest.",
		},
		{
			question: "What is an alpha channel?",
			answer:
				"Alpha channel controls transparency, ranging from 0 (fully transparent) to 1 (fully opaque). RGBA adds alpha to RGB: rgba(255, 0, 0, 0.5) is 50% transparent red. HSLA adds it to HSL. HEX can use 8 digits: #RRGGBBAA.",
		},
		{
			question: "How do I pick accessible color combinations?",
			answer:
				"Ensure sufficient contrast ratio: WCAG AA requires 4.5:1 for normal text, 3:1 for large text. WCAG AAA requires 7:1 and 4.5:1. Use contrast checkers, avoid low-contrast combinations, and test with color blindness simulators.",
		},
		{
			question: "What are CSS color keywords?",
			answer:
				"CSS has 147 named colors: red, blue, coral, steelblue, etc. Special values: transparent (fully transparent), currentColor (inherits text color). Keywords are convenient but limited. Use HEX/RGB/HSL for precise colors.",
		},
		{
			question: "How do I convert RGB to HEX?",
			answer:
				"Convert each RGB value (0-255) to hexadecimal (00-FF). Example: rgb(255, 87, 51) → FF (255), 57 (87), 33 (51) → #FF5733. In JavaScript: '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('').",
		},
		{
			question: "What color format should I use for CSS?",
			answer:
				"HEX is most common and compact for solid colors. RGB/RGBA when you need transparency or programmatic manipulation. HSL when making color variations (easy to adjust lightness/saturation). All are widely supported in modern CSS.",
		},
		{
			question: "What is a color space?",
			answer:
				"A color space defines how colors are represented. sRGB is the web standard. Others include Adobe RGB (wider gamut), CMYK (printing), LAB (perceptually uniform). CSS Color Level 4 introduces display-p3 and other wide-gamut spaces with color() function.",
		},
	],

	// =========================================================================
	// MARKDOWN PREVIEW
	// =========================================================================
	markdown: [
		{
			question: "What is Markdown?",
			answer:
				"Markdown is a lightweight markup language for creating formatted text using plain text syntax. Created by John Gruber in 2004, it's widely used for documentation, README files, blogs, and messaging. It converts to HTML and is easy to read even without rendering.",
		},
		{
			question: "How do I preview Markdown?",
			answer:
				"Enter Markdown in the editor and see live rendered HTML preview. The tool supports GitHub Flavored Markdown (GFM) including tables, task lists, code blocks with syntax highlighting, and autolinks.",
		},
		{
			question: "How do I create headings in Markdown?",
			answer:
				"Use # for headings: # H1, ## H2, ### H3, #### H4, ##### H5, ###### H6. Alternative for H1/H2: underline with === or ---. Best practice: use one H1 per document, maintain hierarchy (don't skip levels).",
		},
		{
			question: "How do I format text in Markdown?",
			answer:
				"Bold: **text** or __text__. Italic: *text* or _text_. Bold+Italic: ***text***. Strikethrough: ~~text~~. Code: `inline code`. Combine as needed: **bold with *italic* inside**.",
		},
		{
			question: "How do I create links in Markdown?",
			answer:
				"Inline link: [text](url). With title: [text](url \"title\"). Reference link: [text][ref] then [ref]: url. Autolinks: <https://example.com> or bare URLs in GFM. Email: <email@example.com>.",
		},
		{
			question: "How do I add images in Markdown?",
			answer:
				"Similar to links with ! prefix: ![alt text](image-url). With title: ![alt](url \"title\"). Reference style: ![alt][ref] then [ref]: url. Always include descriptive alt text for accessibility.",
		},
		{
			question: "How do I create code blocks in Markdown?",
			answer:
				"Inline code: `code`. Fenced blocks: ``` on separate lines before and after code. Add language for syntax highlighting: ```javascript. Indent 4 spaces for plain code blocks. GFM supports language-specific highlighting.",
		},
		{
			question: "How do I create tables in Markdown?",
			answer:
				"Use pipes and hyphens: | Header | Header |, then |---|---|, then | Cell | Cell |. Alignment: :--- (left), :---: (center), ---: (right). Tables are a GFM extension, not original Markdown.",
		},
		{
			question: "What is GitHub Flavored Markdown (GFM)?",
			answer:
				"GFM extends standard Markdown with: tables, task lists (- [ ] and - [x]), strikethrough (~~text~~), autolinks, syntax highlighting in code blocks, and emoji shortcodes (:smile:). It's the de facto standard for README files and documentation.",
		},
		{
			question: "How do I create task lists in Markdown?",
			answer:
				"Use - [ ] for unchecked items and - [x] for checked items. Example: - [ ] Todo item, - [x] Completed item. This is a GFM extension. Task lists render as interactive checkboxes on GitHub.",
		},
	],

	// =========================================================================
	// LOREM IPSUM GENERATOR
	// =========================================================================
	lorem: [
		{
			question: "What is Lorem Ipsum?",
			answer:
				"Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It's derived from 'De Finibus Bonorum et Malorum' by Cicero (45 BC). It provides realistic-looking text for layouts without distracting with readable content.",
		},
		{
			question: "How do I generate Lorem Ipsum text?",
			answer:
				"Select the type (paragraphs, sentences, or words), enter the quantity, click Generate. Copy the text for use in your designs. The tool generates standard Lorem Ipsum text that's widely recognized as placeholder content.",
		},
		{
			question: "Why use Lorem Ipsum instead of real text?",
			answer:
				"Lorem Ipsum has natural letter distribution similar to English, making designs look realistic. Using 'Content here' repeatedly looks unnatural. Real text distracts reviewers from design. Lorem Ipsum is universally recognized as placeholder.",
		},
		{
			question: "How much Lorem Ipsum should I generate?",
			answer:
				"Match your actual content length. Typical uses: hero text (1-2 sentences), blog preview (1 paragraph), article (3-5 paragraphs). Using realistic amounts helps evaluate designs accurately.",
		},
		{
			question: "What does Lorem Ipsum mean?",
			answer:
				"Lorem Ipsum is scrambled Latin from Cicero's text about ethics. 'Lorem ipsum dolor sit amet' roughly means 'pain itself' (from 'dolorem ipsum'). The text is intentionally meaningless to focus attention on design, not content.",
		},
		{
			question: "Are there alternatives to Lorem Ipsum?",
			answer:
				"Yes: Hipster Ipsum (trendy words), Bacon Ipsum (meat-themed), Cupcake Ipsum (dessert-themed), Samuel L. Ipsum (movie quotes). For serious work, use Lorem Ipsum or actual draft content. Themed alternatives add humor but may distract.",
		},
		{
			question: "Can I use Lorem Ipsum in production?",
			answer:
				"Never ship Lorem Ipsum to production - it indicates incomplete content and looks unprofessional. Always replace with real content before launch. Use CMS checks or automated tests to catch placeholder text.",
		},
		{
			question: "How do I generate Lorem Ipsum in code?",
			answer:
				"Libraries: lorem-ipsum (npm), Faker.js, Python's lorem package. Many frameworks have built-in helpers. For quick generation, use online tools like this one and copy the result.",
		},
		{
			question: "Does Lorem Ipsum affect SEO?",
			answer:
				"Lorem Ipsum itself won't rank for searches, but publishing it can indicate low-quality content to search engines. Never publish placeholder text. If found on live sites, replace immediately with relevant content.",
		},
		{
			question: "What is the full Lorem Ipsum text?",
			answer:
				"The standard Lorem Ipsum passage starts: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' The full text is about 1.5 pages, derived from sections 1.10.32-33 of Cicero's work.",
		},
	],

	// =========================================================================
	// SQL FORMATTER
	// =========================================================================
	sql: [
		{
			question: "How do I format SQL queries?",
			answer:
				"Paste your SQL in the input field and click Format. The tool adds proper indentation, line breaks, and keyword capitalization. Copy the formatted result. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and complex queries.",
		},
		{
			question: "What SQL dialects are supported?",
			answer:
				"The formatter supports major SQL dialects: MySQL, PostgreSQL, SQL Server (T-SQL), Oracle, SQLite, and standard SQL. Most formatting rules apply across dialects. Dialect-specific syntax is preserved.",
		},
		{
			question: "Should SQL keywords be uppercase?",
			answer:
				"Uppercase keywords (SELECT, FROM, WHERE) is a common convention for readability, distinguishing keywords from identifiers. However, SQL is case-insensitive for keywords. Choose a style and be consistent. The formatter can enforce either style.",
		},
		{
			question: "How do I format complex JOINs?",
			answer:
				"The formatter places each JOIN on a new line with proper indentation. ON conditions align beneath. Complex joins with multiple conditions are formatted for readability. Nested subqueries are indented appropriately.",
		},
		{
			question: "How do I minify SQL?",
			answer:
				"Select 'Minify' mode to remove whitespace and newlines, producing compact SQL. Useful for logging, embedding in code, or reducing payload size. Note: minified SQL is harder to read and debug.",
		},
		{
			question: "What is SQL indentation best practice?",
			answer:
				"Common conventions: 2-4 space indentation, keywords on new lines, align columns in SELECT, indent JOIN/WHERE clauses. Rivers-style aligns keywords right. Choose a team standard and enforce with formatters.",
		},
		{
			question: "How do I format subqueries?",
			answer:
				"Subqueries are indented within their context (SELECT, FROM, WHERE). The formatter adds parentheses alignment and proper line breaks. Complex nested queries become readable with hierarchical indentation.",
		},
		{
			question: "Can I format stored procedures?",
			answer:
				"Yes, the formatter handles procedural SQL including CREATE PROCEDURE, BEGIN/END blocks, IF/ELSE, loops, and variable declarations. Control flow statements are properly indented.",
		},
		{
			question: "How do I format SQL comments?",
			answer:
				"Comments are preserved: -- for single line, /* */ for multi-line. The formatter maintains comment positioning relative to code. Comments help document complex queries and business logic.",
		},
		{
			question: "Why format SQL queries?",
			answer:
				"Formatted SQL is: easier to read and review, simpler to debug, more maintainable by teams, and helps spot errors. Consistent formatting reduces cognitive load and makes code reviews faster.",
		},
	],

	// =========================================================================
	// NUMBER BASE CONVERTER
	// =========================================================================
	base: [
		{
			question: "How do I convert decimal to binary?",
			answer:
				"Enter a decimal number, select 'Decimal' as input base. The binary equivalent appears instantly. Manual method: repeatedly divide by 2, read remainders bottom-up. Example: 13 → 1101 (13÷2=6r1, 6÷2=3r0, 3÷2=1r1, 1÷2=0r1).",
		},
		{
			question: "How do I convert binary to decimal?",
			answer:
				"Enter binary digits (0s and 1s), select 'Binary' as input base. Manual method: multiply each digit by its position power of 2, sum results. Example: 1101 = 1×8 + 1×4 + 0×2 + 1×1 = 13.",
		},
		{
			question: "What is hexadecimal?",
			answer:
				"Hexadecimal (hex) is base-16 using digits 0-9 and A-F (10-15). Compact representation of binary (4 bits = 1 hex digit). Common in: colors (#FF0000), memory addresses, MAC addresses, programming. Example: 255 = FF, 16 = 10.",
		},
		{
			question: "How do I convert hex to decimal?",
			answer:
				"Enter hex value (e.g., FF), select 'Hexadecimal' as input. Manual: multiply each digit by power of 16. Example: 2F = 2×16 + 15×1 = 47. Hex digits: A=10, B=11, C=12, D=13, E=14, F=15.",
		},
		{
			question: "What is octal numbering?",
			answer:
				"Octal is base-8 using digits 0-7. Historically used in computing (3 bits = 1 octal digit). Still seen in Unix file permissions: chmod 755 means rwxr-xr-x. Less common today than hex.",
		},
		{
			question: "Why do programmers use hexadecimal?",
			answer:
				"Hex is compact (2 hex digits = 1 byte) and aligns with binary (4 bits = 1 hex digit). Easy to read memory dumps, colors, and byte values. Converting hex↔binary is simpler than decimal↔binary.",
		},
		{
			question: "How do I convert between binary and hex?",
			answer:
				"Group binary into 4-bit chunks (right to left), convert each to hex. Example: 11111111 → 1111 1111 → F F → FF. Reverse for hex to binary: F → 1111. This direct conversion is why hex is popular in computing.",
		},
		{
			question: "What is the 0x prefix?",
			answer:
				"0x indicates hexadecimal in programming (0xFF = 255). Other prefixes: 0b for binary (0b1111 = 15), 0o for octal (0o17 = 15). Without prefix, numbers are assumed decimal. These prefixes prevent ambiguity.",
		},
		{
			question: "How do I handle negative numbers in different bases?",
			answer:
				"Computers use two's complement for negative binary numbers. The tool handles standard conversions. For signed interpretation: MSB (most significant bit) indicates sign. -1 in 8-bit is 11111111 (255 unsigned).",
		},
		{
			question: "What are common programming number bases?",
			answer:
				"Binary (base-2): computer's native language. Octal (base-8): Unix permissions. Decimal (base-10): human-readable. Hexadecimal (base-16): colors, memory, bytes. Base-64: encoding binary as text.",
		},
	],

	// =========================================================================
	// ENV CONVERTER
	// =========================================================================
	env: [
		{
			question: "What is an ENV file?",
			answer:
				"A .env file stores environment variables as KEY=value pairs, one per line. Used to configure applications without hardcoding values. Common for: API keys, database URLs, feature flags. Never commit secrets to version control.",
		},
		{
			question: "How do I convert ENV to JSON?",
			answer:
				"Paste your .env content in the input, select 'ENV to JSON'. Each KEY=value becomes a JSON property. Useful for: config management, programmatic access, API payloads. The tool handles quotes and special characters.",
		},
		{
			question: "How do I convert JSON to ENV?",
			answer:
				"Paste JSON object in input, select 'JSON to ENV'. Properties become KEY=value lines. Nested objects are flattened or serialized. Useful for generating .env files from config objects or API responses.",
		},
		{
			question: "How do I handle special characters in ENV values?",
			answer:
				"Wrap values with special characters in quotes: KEY=\"value with spaces\". For quotes within values, escape them: KEY=\"value with \\\"quotes\\\"\". Newlines: use \\n or multiline with quotes. The tool handles escaping automatically.",
		},
		{
			question: "Should I commit my .env file?",
			answer:
				"Never commit .env files with secrets. Add .env to .gitignore. Instead: 1) Provide .env.example with placeholder values, 2) Document required variables, 3) Use secret management (Vault, AWS Secrets) in production.",
		},
		{
			question: "How do I use ENV variables in Node.js?",
			answer:
				"Access with process.env.VARIABLE_NAME. Use dotenv package to load .env files: require('dotenv').config() at app start. For TypeScript, add types. Modern frameworks (Next.js, Vite) have built-in .env support.",
		},
		{
			question: "What is the difference between .env and .env.local?",
			answer:
				"Conventions vary by framework. Common pattern: .env (shared defaults), .env.local (local overrides, gitignored), .env.production (production values). Load order typically: .env → .env.local → .env.[environment].",
		},
		{
			question: "How do I validate ENV variables?",
			answer:
				"Use libraries like envalid (Node.js) or python-dotenv with validation. Check required variables exist at startup, validate formats (URLs, numbers), provide defaults where appropriate. Fail fast if critical vars are missing.",
		},
		{
			question: "Can ENV values be multiline?",
			answer:
				"Yes, use quotes: KEY=\"line1\\nline2\" or KEY=\"line1\nline2\" (actual newline within quotes). Support varies by parser. For complex multiline content, consider Base64 encoding or external config files.",
		},
		{
			question: "How do I manage ENV variables in production?",
			answer:
				"Options: 1) Platform environment settings (Vercel, Heroku), 2) Secret managers (AWS Secrets, HashiCorp Vault), 3) Kubernetes secrets/configmaps, 4) CI/CD variables. Never use .env files in production containers.",
		},
	],
};

// =============================================================================
// ARTICLE FAQs - Q&A for specific blog articles
// =============================================================================

export const articleFAQs: Record<string, FAQItem[]> = {
	// Base64 Articles
	"what-is-base64-encoding": [
		{
			question: "What characters does Base64 use?",
			answer:
				"Base64 uses 64 characters: uppercase letters A-Z (26), lowercase letters a-z (26), digits 0-9 (10), plus sign (+), and forward slash (/). The equals sign (=) is used for padding. Base64URL variant uses minus (-) and underscore (_) instead of + and /.",
		},
		{
			question: "Why is Base64 output 33% larger than the input?",
			answer:
				"Base64 converts every 3 bytes (24 bits) of binary data into 4 characters (6 bits each). This 3:4 ratio means the output is always 4/3 ≈ 1.33 times the input size, plus padding. This overhead is the cost of safely encoding binary as text.",
		},
		{
			question: "When should I NOT use Base64?",
			answer:
				"Avoid Base64 for: large files (33% overhead adds up), security purposes (it's encoding, not encryption), data that stays in binary systems, and performance-critical applications where the encoding/decoding overhead matters.",
		},
	],
	"base64-javascript-guide": [
		{
			question: "Why does btoa() fail with Unicode characters?",
			answer:
				"btoa() only accepts characters in the Latin1 range (0-255). Unicode characters like emoji or non-Latin scripts have code points above 255, causing 'InvalidCharacterError'. Use TextEncoder to convert to UTF-8 bytes first, then encode those bytes.",
		},
		{
			question: "What is the difference between btoa/atob and Buffer in Node.js?",
			answer:
				"btoa/atob are browser APIs that work with strings. Node.js Buffer is more versatile, handling various encodings and binary data directly. Use Buffer.from(string).toString('base64') in Node.js for better Unicode support and performance.",
		},
		{
			question: "How do I Base64 encode a file in JavaScript?",
			answer:
				"Use FileReader.readAsDataURL() for a complete data URL, or FileReader.readAsArrayBuffer() followed by btoa() on the byte string. For large files, consider streaming or chunked encoding to avoid memory issues.",
		},
	],
	"base64-not-encryption": [
		{
			question: "Can hackers decode my Base64 encoded passwords?",
			answer:
				"Yes, instantly. Base64 decoding is trivial - any online tool or one line of code can decode it. Base64 provides zero security. If you're encoding passwords with Base64, stop immediately and use proper password hashing like bcrypt or Argon2.",
		},
		{
			question: "Why do some APIs use Base64 for authentication then?",
			answer:
				"HTTP Basic Authentication uses Base64 only for encoding (not security). The security comes from HTTPS encrypting the entire request. Without HTTPS, credentials are easily intercepted. Base64 just makes binary-safe transmission possible.",
		},
		{
			question: "What should I use instead of Base64 for security?",
			answer:
				"For passwords: bcrypt, Argon2, or PBKDF2 (hashing). For sensitive data transmission: TLS/HTTPS. For data at rest: AES-256 encryption. For tokens: cryptographically signed JWTs. Base64 is for encoding, not security.",
		},
	],

	// JWT Articles
	"what-is-jwt": [
		{
			question: "Are JWTs secure?",
			answer:
				"JWTs are secure for their intended purpose: verifying data integrity and authenticity via signatures. However, the payload is NOT encrypted - anyone can read it. Don't store sensitive data in JWTs. Security depends on proper implementation: strong secrets, short expiration, HTTPS only.",
		},
		{
			question: "What happens when a JWT expires?",
			answer:
				"When the 'exp' claim timestamp is in the past, the token is invalid. Servers should reject expired tokens. Clients typically use refresh tokens to get new access tokens, or redirect users to re-authenticate. Never extend expiration on the client side.",
		},
		{
			question: "Can I decode a JWT without the secret key?",
			answer:
				"Yes, anyone can decode (read) a JWT - it's just Base64. The secret key is only needed to VERIFY the signature (prove it hasn't been tampered with) and to CREATE valid tokens. This is why you should never put sensitive data in JWT payloads.",
		},
	],
	"jwt-security-best-practices": [
		{
			question: "How long should a JWT access token last?",
			answer:
				"Access tokens should be short-lived: 15-60 minutes is common. Shorter is more secure but requires more frequent refresh. Use refresh tokens (stored securely, server-validated) for longer sessions. Balance security with user experience.",
		},
		{
			question: "Should I store JWTs in localStorage or cookies?",
			answer:
				"HttpOnly cookies are more secure (immune to XSS). localStorage is vulnerable to XSS attacks but easier to use with APIs. Best practice: HttpOnly cookie for refresh token, short-lived access token in memory. Never store tokens in regular cookies or sessionStorage.",
		},
		{
			question: "How do I revoke a JWT before it expires?",
			answer:
				"JWTs are stateless, so revocation requires extra mechanisms: 1) Token blacklist (check against database), 2) Short expiration + refresh tokens (revoke refresh token), 3) Token versioning (increment version on logout), 4) Change the signing secret (invalidates ALL tokens).",
		},
	],

	// URL Encoding Articles
	"url-encoding-explained": [
		{
			question: "Why are spaces sometimes + and sometimes %20?",
			answer:
				"Historical reasons: application/x-www-form-urlencoded (HTML forms) uses + for spaces, while RFC 3986 (URI standard) uses %20. In URL paths, use %20. In query strings, both work but %20 is more universal. The URL API uses + in query params.",
		},
		{
			question: "Do I need to encode entire URLs or just parts?",
			answer:
				"Encode only user-provided values, not the URL structure. Use encodeURIComponent() for query parameter values, path segments with special characters. Don't encode the entire URL - that would break the structure (://?&= have meaning).",
		},
		{
			question: "What is percent-encoding?",
			answer:
				"Percent-encoding (URL encoding) replaces unsafe characters with %XX where XX is the hexadecimal ASCII value. Example: space (ASCII 32) becomes %20, ampersand (ASCII 38) becomes %26. This ensures only safe ASCII characters appear in URLs.",
		},
	],

	// Hash Articles
	"cryptographic-hash-functions-explained": [
		{
			question: "What makes a hash function 'cryptographic'?",
			answer:
				"Cryptographic hash functions have specific security properties: pre-image resistance (can't find input from hash), second pre-image resistance (can't find different input with same hash), and collision resistance (can't find any two inputs with same hash). Regular hash functions (like for hash tables) don't need these properties.",
		},
		{
			question: "Is MD5 still safe to use?",
			answer:
				"MD5 is cryptographically broken - collisions can be generated quickly. Never use it for security (passwords, signatures, certificates). It's acceptable only for non-security checksums like detecting accidental corruption, but SHA-256 is preferred even for that.",
		},
		{
			question: "What is a hash collision?",
			answer:
				"A collision occurs when two different inputs produce the same hash output. Since hash outputs are fixed-size and inputs are unlimited, collisions must exist (pigeonhole principle). Cryptographic hashes make finding collisions computationally infeasible - but MD5 and SHA-1 have been broken.",
		},
	],
	"password-hashing-best-practices": [
		{
			question: "Why is bcrypt better than SHA-256 for passwords?",
			answer:
				"bcrypt is intentionally slow (configurable work factor) and includes automatic salting. SHA-256 is designed to be fast - attackers can try billions of guesses per second. bcrypt's slowness is a feature: it makes brute force attacks impractical while remaining acceptable for legitimate logins.",
		},
		{
			question: "What is a work factor/cost factor in password hashing?",
			answer:
				"The work factor controls how computationally expensive the hash is. Higher values = slower hashing = more secure but slower logins. Target ~250ms per hash. Increase the work factor over time as hardware gets faster. bcrypt uses 2^cost iterations.",
		},
		{
			question: "Should I use Argon2 or bcrypt?",
			answer:
				"Argon2 (specifically Argon2id) is the current recommendation - it won the Password Hashing Competition and is memory-hard (resists GPU attacks). bcrypt is still secure and more widely supported. Both are excellent choices. Avoid PBKDF2 unless required for compliance.",
		},
	],

	// QR Code Articles
	"how-qr-codes-work": [
		{
			question: "Why do QR codes have those three big squares?",
			answer:
				"The three finder patterns (large squares in corners) help scanners quickly locate and orient the QR code. Their unique pattern (black-white-black-white-black 1:1:3:1:1 ratio) doesn't appear elsewhere in valid QR codes, making detection reliable at any angle.",
		},
		{
			question: "How much damage can a QR code survive?",
			answer:
				"With the highest error correction level (H), QR codes can be read with up to 30% damage or obstruction. This is why logos can be placed in the center - as long as 70% of the code remains, it's readable. Lower error correction levels survive less damage but store more data.",
		},
		{
			question: "What is the minimum QR code size for reliable scanning?",
			answer:
				"Minimum module (square) size should be 2-4 pixels on screen, or 0.5mm in print. The overall code size depends on content and scanning distance. Rule of thumb: QR code should be 1/10th the scanning distance (10cm code for 1m distance). Always test with multiple devices.",
		},
	],

	// UUID Articles
	"uuid-versions-explained": [
		{
			question: "Which UUID version should I use in 2024?",
			answer:
				"UUID v7 for new projects - it's sortable (better database performance) while maintaining uniqueness. Use v4 if you need maximum randomness or wider library support. Use v5 for deterministic IDs from names/URLs. Avoid v1 (exposes MAC address) unless required.",
		},
		{
			question: "Can UUIDs ever collide?",
			answer:
				"Theoretically yes, but practically no. UUID v4 has 2^122 possible values. You'd need to generate 1 billion UUIDs per second for 100 years to have a 50% chance of one collision. The probability is so low it's considered impossible in practice.",
		},
		{
			question: "Why are some UUIDs uppercase and some lowercase?",
			answer:
				"UUIDs are case-insensitive - 'A1B2...' equals 'a1b2...'. RFC 4122 recommends lowercase for generation but requires accepting either case. Most tools output lowercase. When comparing, normalize to one case. Databases may be case-sensitive, so be consistent.",
		},
	],

	// Regex Articles
	"regex-beginners-guide": [
		{
			question: "Why do I need to escape special characters in regex?",
			answer:
				"Characters like . * + ? [ ] ( ) { } \\ ^ $ | have special meanings in regex. To match them literally, escape with backslash: \\. matches a period, \\* matches an asterisk. In JavaScript strings, double-escape: '\\\\.' because \\ is also a string escape character.",
		},
		{
			question: "What is the difference between .* and .*?",
			answer:
				".* is greedy - it matches as much as possible. .*? is lazy/non-greedy - it matches as little as possible. Example: /<.*>/ on '<a><b>' matches '<a><b>' (everything). /<.*?>/ matches '<a>' then '<b>' (minimum each time). Use lazy matching for nested structures.",
		},
		{
			question: "How do I make my regex case-insensitive?",
			answer:
				"Add the 'i' flag: /hello/i matches 'Hello', 'HELLO', 'hElLo'. In JavaScript: new RegExp('hello', 'i'). You can combine flags: /hello/gi for global case-insensitive matching. Some patterns need explicit alternatives: /[a-zA-Z]/ matches letters in either case without the flag.",
		},
	],

	// Timestamp Articles
	"unix-timestamp-guide": [
		{
			question: "Why do timestamps start from 1970?",
			answer:
				"January 1, 1970 (Unix epoch) was chosen when Unix was developed because it was recent enough to be useful but far enough back to handle past dates. It was a practical choice, not technically significant. Some systems use different epochs (Excel, Apple).",
		},
		{
			question: "How do I know if a timestamp is in seconds or milliseconds?",
			answer:
				"Count the digits: 10 digits (1234567890) = seconds, 13 digits (1234567890123) = milliseconds. Current timestamp in seconds is ~1.7 billion (2024). If the number is in trillions, it's milliseconds. Some APIs document which they use.",
		},
		{
			question: "Do timestamps account for leap seconds?",
			answer:
				"Unix timestamps ignore leap seconds - they count 86,400 seconds per day regardless of actual Earth rotation. This makes math simple but means UTC and Unix time can differ by up to ~27 seconds. Most applications don't need leap second precision.",
		},
	],

	// Cron Articles
	"cron-expression-syntax": [
		{
			question: "What is the difference between */5 and 0/5 in cron?",
			answer:
				"*/5 means 'every 5 units starting from 0' (0, 5, 10...). 0/5 explicitly starts from 0 with the same result. But 2/5 would start from 2 (2, 7, 12...). For most cases, */5 is clearer and preferred. Some cron implementations don't support starting offsets.",
		},
		{
			question: "Why isn't my cron job running?",
			answer:
				"Common issues: 1) Wrong timezone (cron uses system time, not UTC), 2) Path not set (use absolute paths), 3) Missing permissions, 4) Environment variables not loaded, 5) Syntax errors. Check cron logs: /var/log/cron or 'grep CRON /var/log/syslog'. Test your command manually first.",
		},
		{
			question: "Can I run a cron job every 45 minutes?",
			answer:
				"Not directly - cron can't express '45 minutes' cleanly. Options: 1) Two entries: '0 0,1,2... * * *' and '45 0,1,2... * * *', 2) Run every 15 minutes and check time in script, 3) Use a scheduler like systemd timers that support arbitrary intervals.",
		},
	],

	// Color Articles
	"color-formats-guide": [
		{
			question: "Which color format should I use for CSS?",
			answer:
				"HEX (#FF5733) for solid colors - it's compact and widely understood. RGB/RGBA when you need transparency or programmatic manipulation. HSL when creating color schemes (easy to adjust lightness/saturation). Modern browsers support all formats equally.",
		},
		{
			question: "Why do HSL colors look more 'natural' for variations?",
			answer:
				"HSL separates hue (the actual color) from saturation and lightness. To create lighter/darker versions, just change L. To create muted versions, reduce S. In RGB, creating variations requires changing all three values in non-intuitive ways.",
		},
		{
			question: "What is the difference between RGB and sRGB?",
			answer:
				"sRGB is a specific RGB color space - the standard for web and most displays. 'RGB' can refer to any RGB color space (Adobe RGB, Display P3). CSS colors are sRGB by default. CSS Color Level 4 adds support for wider gamuts with color() function.",
		},
	],

	// JSON Articles
	"json-complete-guide": [
		{
			question: "Why can't JSON have trailing commas?",
			answer:
				"JSON's strict syntax doesn't allow trailing commas for simplicity and unambiguous parsing. While JavaScript objects allow them, JSON was designed as a minimal data format. Many JSON parsers would fail on trailing commas. Use a linter or formatter to catch this.",
		},
		{
			question: "How do I include comments in JSON?",
			answer:
				"Standard JSON doesn't support comments. Workarounds: 1) Use JSONC (JSON with Comments) for config files - many tools support it, 2) Add a '_comment' key, 3) Use YAML instead if comments are important. Don't strip comments with preprocessing - it's fragile.",
		},
		{
			question: "What is the maximum size of a JSON file?",
			answer:
				"JSON has no theoretical size limit - it depends on your parser and memory. JavaScript can handle tens of megabytes. For very large data: stream parse instead of loading entire file, use newline-delimited JSON (NDJSON), or consider binary formats like Protocol Buffers.",
		},
	],

	// Password Articles
	"password-entropy-explained": [
		{
			question: "How is password entropy calculated?",
			answer:
				"Entropy (in bits) = log₂(possible_combinations) = length × log₂(character_set_size). Example: 12-character password with 62 chars (a-z, A-Z, 0-9) = 12 × 5.95 = 71.5 bits. More bits = stronger password. Each bit doubles the combinations.",
		},
		{
			question: "Is a 16-character password always stronger than 8 characters?",
			answer:
				"Usually yes, but it depends on randomness. A truly random 8-character password with full character set is stronger than '1234567812345678'. Length helps, but only with randomness. Dictionary words and patterns dramatically reduce effective entropy regardless of length.",
		},
		{
			question: "What password entropy is considered secure today?",
			answer:
				"Minimum 60 bits for important accounts, 80+ bits for high security, 128+ bits for cryptographic purposes. With current technology, 80 bits would take billions of years to brute force. But use bcrypt/Argon2 for hashing - they add significant time per guess.",
		},
	],

	// Diff Articles
	"diff-algorithms-explained": [
		{
			question: "Why does Git sometimes produce confusing diffs?",
			answer:
				"Git's default Myers algorithm optimizes for minimal edits, not human readability. When code is moved or refactored, it may match wrong lines. Try 'git diff --patience' or '--histogram' for clearer results on structural changes. Context matters for good diffs.",
		},
		{
			question: "What is the computational complexity of diff?",
			answer:
				"Myers algorithm: O((N+M)×D) where N,M are file lengths and D is edit distance. For similar files (small D), it's nearly linear. For completely different files, it approaches O(N×M). Patience diff has similar complexity but better average cases for code.",
		},
		{
			question: "Can I diff binary files?",
			answer:
				"Text diff shows binary files as 'binary files differ'. For meaningful binary diffs: use specialized tools (image diff, hex diff), convert to text representation first, or use binary diff tools that output patches. Git can diff some binary formats with proper configuration.",
		},
	],

	// YAML Articles
	"yaml-vs-json-comparison": [
		{
			question: "Is YAML a superset of JSON?",
			answer:
				"Yes, valid JSON is valid YAML (since YAML 1.2). You can paste JSON into YAML files. However, YAML has features JSON lacks: comments, anchors/aliases, multi-line strings, and more data types. YAML parsers accept JSON, but JSON parsers reject YAML-specific features.",
		},
		{
			question: "Why is YAML popular for configuration?",
			answer:
				"YAML's readability: minimal punctuation, significant whitespace (like Python), comment support, and multi-line strings make configs easy to read and document. JSON's braces and quotes add visual noise. YAML also supports anchors for DRY configurations.",
		},
		{
			question: "Which is faster to parse, JSON or YAML?",
			answer:
				"JSON is significantly faster - its simpler grammar allows faster parsing. YAML's flexibility (multiple ways to express the same data) makes parsing complex. For data interchange, especially in performance-critical systems, JSON is preferred. Use YAML for human-edited configs.",
		},
	],

	// Markdown Articles
	"markdown-syntax-reference": [
		{
			question: "What is GitHub Flavored Markdown (GFM)?",
			answer:
				"GFM extends standard Markdown with: tables, task lists (- [ ]), strikethrough (~~text~~), fenced code blocks with syntax highlighting, autolinks, and emoji shortcodes (:smile:). It's the de facto standard for README files. Most Markdown tools now support GFM.",
		},
		{
			question: "How do I create a table of contents in Markdown?",
			answer:
				"Manually link to headings: [Section](#section-name). GitHub auto-generates lowercase, hyphenated anchors from headings. Some tools add TOC automatically with [[toc]] or similar. Many Markdown editors can generate TOC. Check your platform's specific syntax.",
		},
		{
			question: "Can I use HTML inside Markdown?",
			answer:
				"Yes, most Markdown parsers pass HTML through unchanged. Useful for complex layouts, custom styling, or features Markdown lacks. However, some platforms (GitHub comments, Discord) restrict HTML for security. Raw HTML makes documents less portable.",
		},
	],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get FAQs for a specific tool
 */
export function getToolFAQs(toolId: string): FAQItem[] {
	return toolFAQs[toolId] || [];
}

/**
 * Get FAQs for a specific article by slug
 */
export function getArticleFAQs(slug: string): FAQItem[] {
	return articleFAQs[slug] || [];
}

/**
 * Get all tool IDs that have FAQs
 */
export function getToolsWithFAQs(): string[] {
	return Object.keys(toolFAQs);
}

/**
 * Generate JSON-LD FAQPage schema for SEO
 */
export function generateFAQJsonLd(faqs: FAQItem[]) {
	if (faqs.length === 0) return null;

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * Search FAQs across all tools
 */
export function searchFAQs(query: string): Array<FAQItem & { toolId: string }> {
	const lowerQuery = query.toLowerCase();
	const results: Array<FAQItem & { toolId: string }> = [];

	for (const [toolId, faqs] of Object.entries(toolFAQs)) {
		for (const faq of faqs) {
			if (
				faq.question.toLowerCase().includes(lowerQuery) ||
				faq.answer.toLowerCase().includes(lowerQuery)
			) {
				results.push({ ...faq, toolId });
			}
		}
	}

	return results;
}
