# Student Management System - JWT Authentication Workflow

## Overview
This document explains the complete authentication and request workflow of the Student Management System application using:

- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Hibernate / JPA

---

# 🔐 1. Login Flow (`POST /auth/login`)

### Step 1: Request Enters Security Filter Chain
Spring Security intercepts the login request.

```
Securing POST /auth/login
```

---

### Step 2: Anonymous Authentication Context
Since the user is not authenticated yet, Spring sets an anonymous security context.

```
AnonymousAuthenticationFilter
```

---

### Step 3: Controller Receives Login Request
`AuthController` receives the username and password.

```
Login attempt for username=superadmin@test.com
```

---

### Step 4: UserDetailsService Loads User
`StudentUserDetailsService` loads user details from the database.

```
Load user details for username=superadmin@test.com
```

---

### Step 5: Authentication Provider Validates Credentials
`DaoAuthenticationProvider`:

- Compares raw password with encoded password
- Validates user credentials

```
Authenticated user
```

---

### Step 6: JWT Generation
After successful authentication:

- JWT token is generated
- Token is returned in response

```
Login success for username=superadmin@test.com
```

✅ Login Complete

---

# 🌐 2. Frontend Calls Protected APIs

After login, the frontend stores the JWT and attaches it in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

# ⚙️ 3. CORS Preflight Request (OPTIONS)

Before sending actual requests, the browser sends a preflight request:

```
OPTIONS /students
```

Purpose:
- Verify cross-origin permissions
- Confirm allowed headers and methods

This is normal browser behavior.

---

# 📘 4. Accessing Public Endpoint (`GET /schools`)

If the endpoint is configured as public:

- No JWT required
- Anonymous context allowed
- Controller executes normally

Flow:

```
SchoolController
   → SchoolService
       → Repository
           → Database
```

---

# 🔐 5. Accessing Protected Endpoint (`GET /students`)

When accessing a secured endpoint with JWT:

### Step 1: JWT Filter Intercepts Request
`JwtAuthenticationFilter`:

- Extracts token from header
- Validates signature
- Extracts username

```
JWT valid for username=superadmin@test.com
```

---

### Step 2: Load User Again
User details are loaded to build Authentication object.

---

### Step 3: Set Authentication in SecurityContext

```
SecurityContextHolder.setAuthentication(...)
```

Now Spring considers the user authenticated.

---

### Step 4: Controller Executes With Authenticated User

```
StudentController
   → StudentService
       → Role check (SUPERADMIN)
           → studentRepository.findAll()
```

Log example:

```
Get all students as SUPERADMIN currentUser=superadmin@test.com
```

---

# 🔁 Why Some Requests Appear Twice?

Possible reasons:

- React StrictMode (double rendering in development)
- UI refreshing automatically
- Multiple frontend calls

This is normal in development environments.

---

# 🧠 Complete Workflow Summary

```
1. POST /auth/login
2. UserDetailsService loads user
3. Password validated
4. JWT generated and returned
5. Frontend stores JWT
6. GET /students with Authorization header
7. JwtAuthenticationFilter validates token
8. SecurityContext populated
9. Controller executes based on role
10. Data returned
```

---

# 🏗 Components Involved

- FilterChainProxy
- JwtAuthenticationFilter
- StudentUserDetailsService
- DaoAuthenticationProvider
- AuthController
- StudentController
- StudentService
- JPA Repository
- Hibernate
- Database

---

# ✅ System Status

Based on the logs:

- JWT generation works
- JWT validation works
- Role-based access works
- SecurityContext population works
- Database access works

🎉 The authentication and authorization flow is functioning correctly.

---

# 🚀 Future Improvements (Production Best Practices)

- Use `@ConfigurationProperties` for JWT configuration
- Use refresh tokens
- Add exception handling for JWT errors
- Use Flyway/Liquibase for DB migrations
- Implement global exception handling
- Add audit logging

---

**Author:** Student Management System
**Technology Stack:** Spring Boot + Spring Security + JWT + JPA

