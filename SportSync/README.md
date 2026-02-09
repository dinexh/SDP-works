# SportSync

Course: 23CS06EF - MERN STACK WEB DEVELOPMENT

SportSync is a modern sports event management and scheduling platform that helps organize and coordinate sports activities, matches, and tournaments.

## Features

- User authentication and authorization
- Event scheduling and management
- Team creation and management
- Real-time notifications
- Tournament brackets
- Score tracking

## Authentication Flow

### JWT (JSON Web Token) Implementation

#### 1. Login Flow

1. **Authentication Process**:
   - User submits credentials (email/password)
   - Server validates against MongoDB database
   - On successful validation:
     ```javascript
     // JWT Generation
     const token = jwt.sign(
       {
         userId: user._id,
         role: user.role,
         iat: Date.now(),
         exp: Date.now() + 3600000 // 1 hour
       },
       process.env.JWT_SECRET
     );
     ```

2. **Token Storage**:
   - Access Token: Memory (React Context/State)
   - Refresh Token: HTTP-only cookie

#### 2. Token Structure and Management
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "123456",
    "role": "admin",
    "iat": 1714239022,
    "exp": 1714242622
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

#### 3. Request Flow
- Client includes JWT in Authorization header
- Server validation process:
  ```javascript
  // Middleware example
  const validateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  ```

#### 4. Token Lifecycle
- Access Token: 1 hour expiration
- Refresh Token: 7 days validity
- Refresh Flow:
  ```javascript
  // Refresh token endpoint
  app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });
    
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const newAccessToken = generateAccessToken(decoded.userId);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  });
  ```

### Session Management

#### 1. MongoDB Session Storage
```javascript
// Session Schema
const sessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  ipAddress: String,
  lastActive: Date,
  expiresAt: Date,
  deviceInfo: String
});
```

#### 2. Session Operations
```javascript
// Session creation
const createSession = async (userId, req) => {
  const session = new Session({
    sessionId: `sess_${crypto.randomBytes(16).toString('hex')}`,
    userId,
    ipAddress: req.ip,
    lastActive: new Date(),
    expiresAt: new Date(Date.now() + 86400000), // 24 hours
    deviceInfo: req.headers['user-agent']
  });
  await session.save();
  return session;
};
```

### Cookie Management

#### 1. Cookie Configuration
```javascript
const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  domain: '.sportsync.com',
  path: '/',
  maxAge: 604800000 // 7 days
};

// Setting refresh token cookie
res.cookie('refreshToken', token, cookieConfig);
```

#### 2. Security Implementation
```javascript
// CSRF Protection
app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Error Handling

```javascript
// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid token',
      details: err.message
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      details: 'Please refresh your token'
    });
  }
  
  next(err);
});
```

## Installation

## Rubric 2: Detailed Authentication & Session Management

### 2.1 JWT (JSON Web Token) Deep Dive

#### 2.1.1 Token Generation
```javascript
// Example JWT structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "123456",
    "role": "admin",
    "iat": 1516239022,
    "exp": 1516242622
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

#### 2.1.2 JWT Implementation Details
- **Token Lifetime**: 1 hour default expiration
- **Refresh Token**: 7 days validity
- **Token Storage**: 
  - Access token: Memory (React Context)
  - Refresh token: HTTP-only cookie

#### 2.1.3 Security Measures
- Payload encryption for sensitive data
- Token blacklisting for logged-out tokens
- Rate limiting on token generation
- JTI (JWT ID) for token revocation

### 2.2 Session Management Architecture

#### 2.2.1 Server-Side Sessions
```javascript
// Example session structure
{
  "sessionId": "sess:12345",
  "userData": {
    "userId": "user123",
    "lastActive": "2024-03-20T10:00:00Z",
    "deviceInfo": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  },
  "expiresAt": "2024-03-21T10:00:00Z"
}
```

#### 2.2.2 Session Storage
- **Primary Storage**: Redis
- **Backup Storage**: PostgreSQL
- **Session Duration**: 24 hours
- **Cleanup Policy**: Automatic purge after 48 hours

#### 2.2.3 Session Security
- Session rotation on privilege change
- Absolute timeout: 24 hours
- Idle timeout: 30 minutes
- Geographic location validation

### 2.3 Cookie Management System

#### 2.3.1 Cookie Configuration
```javascript
// Cookie settings
{
  "httpOnly": true,
  "secure": true,
  "sameSite": "strict",
  "domain": ".sportsync.com",
  "path": "/",
  "maxAge": 86400000
}
```

#### 2.3.2 Cookie Types and Usage
1. **Authentication Cookies**
   - RefreshToken cookie (HTTP-only)
   - Session identifier
   - CSRF token

2. **Preference Cookies**
   - User settings
   - Theme preferences
   - Language selection

3. **State Management Cookies**
   - Shopping cart data
   - Last visited page
   - Temporary form data

#### 2.3.3 Security Implementation
- **CSRF Protection**:
  ```javascript
  // CSRF token generation
  const csrfToken = crypto.randomBytes(32).toString('hex');
  // Token verification middleware
  app.use(csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  }));
  ```

- **Cookie Security Headers**:
  ```javascript
  // Security headers configuration
  {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block"
  }
  ```

### 2.4 Authentication Flow Sequence

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Redis
    participant Database

    Client->>Server: Login Request
    Server->>Database: Validate Credentials
    Database-->>Server: User Data
    Server->>Redis: Create Session
    Server->>Server: Generate JWT
    Server-->>Client: Send Tokens & Cookies
    Note right of Client: Store Access Token in Memory
    Note right of Client: Store Refresh Token in HTTP-only Cookie
```

### 2.5 Error Handling and Recovery

#### 2.5.1 Token Errors
- Invalid signature handling
- Expired token refresh process
- Malformed token detection

#### 2.5.2 Session Errors
- Session timeout recovery
- Concurrent session conflict resolution
- Session synchronization across devices

#### 2.5.3 Cookie Errors
- Missing cookie recovery
- Corrupted cookie handling
- Cross-domain cookie issues

### 2.6 Performance Considerations

- JWT size optimization
- Session storage scaling
- Cookie payload minimization
- Caching strategies
- Database query optimization

// Rest of the README content continues...
