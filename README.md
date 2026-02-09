# Student Management (Spring Boot)

## Overview
This is a Spring Boot backend for managing students and schools with role-based access control and JWT authentication. It uses SQLite for persistence, Spring Data JPA for data access, and Spring Security for auth. The API supports:
1. Student CRUD with role-based visibility.
2. School listing and creation.
3. Auth endpoints for login and registration.

## Tech Stack
1. Java 17
2. Spring Boot 4.0.2
3. Spring Web MVC
4. Spring Data JPA
5. Spring Security
6. JWT (jjwt 0.12.5)
7. SQLite (org.xerial)
8. SpringDoc OpenAPI UI
9. Actuator

## Project Structure
```
src/main/java/com/example/studentmanagement
+-- StudentmanagementApplication.java
+-- config
¦   +-- CorsConfig.java
+-- controller
¦   +-- AuthController.java
¦   +-- SchoolController.java
¦   +-- StudentController.java
+-- dto
¦   +-- AuthRequest.java
¦   +-- AuthResponse.java
¦   +-- RegisterRequest.java
¦   +-- StudentRequest.java
+-- exception
¦   +-- GlobalExceptionHandler.java
¦   +-- StudentNotFoundException.java
+-- model
¦   +-- Role.java
¦   +-- School.java
¦   +-- Student.java
+-- repository
¦   +-- SchoolRepository.java
¦   +-- StudentRepository.java
+-- security
¦   +-- JwtAuthenticationFilter.java
¦   +-- JwtService.java
¦   +-- SecurityConfig.java
¦   +-- StudentUserDetailsService.java
+-- service
    +-- SchoolService.java
    +-- StudentService.java
```

## Configuration (application.properties)
Location: `src/main/resources/application.properties`

```
spring.application.name=studentmanagement

# SQLite Database config
spring.datasource.url=jdbc:sqlite:./data/studentmanagement.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.datasource.username=
spring.datasource.password=

# JPA config
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT config
app.jwt.secret=8f3b7e6d9a2c4e1f7c0b5a9d3e6f2a8c1d4b9e7a5f0c6d2e8b1a4c9f7e3
app.jwt.expiration-ms=3600000
```

Key points:
1. Database is SQLite at `./data/studentmanagement.db`.
2. Hibernate `ddl-auto=update` auto-creates and updates tables.
3. JWT secret must be at least 32 chars. Tokens expire after `app.jwt.expiration-ms` milliseconds.

## Core Concepts and How They Are Implemented

### 1) Spring Boot Auto-Configuration
`StudentmanagementApplication.java` uses `@SpringBootApplication` to:
1. Scan components in `com.example.studentmanagement`.
2. Configure Spring MVC, Data JPA, Security automatically based on dependencies.

### 2) Dependency Injection
All service/controller dependencies use field injection with `@Autowired`.
Examples:
1. `StudentController` injects `StudentService`.
2. `StudentService` injects `StudentRepository`, `PasswordEncoder`, and `SchoolRepository`.
3. `SecurityConfig` injects `JwtAuthenticationFilter`.

### 3) Domain Model (JPA Entities)
#### Student
File: `src/main/java/com/example/studentmanagement/model/Student.java`
1. `@Entity` maps to a `student` table.
2. Fields: `id`, `name`, `email`, `password`, `school`, `role`.
3. `password` is `@JsonIgnore` so it is not returned in API responses.
4. `school` is `@ManyToOne` to `School`.
5. `role` is `@Enumerated(EnumType.STRING)`.

#### School
File: `src/main/java/com/example/studentmanagement/model/School.java`
1. `@Entity` with unique `name`.
2. Used for grouping students.

#### Role
File: `src/main/java/com/example/studentmanagement/model/Role.java`
1. Enum values: `SUPERADMIN`, `ADMIN`, `USER`.

### 4) Repositories (Spring Data JPA)
#### StudentRepository
File: `src/main/java/com/example/studentmanagement/repository/StudentRepository.java`
1. Extends `JpaRepository<Student, Long>`.
2. Custom methods:
   - `findByEmail(String email)`
   - `findAllBySchoolId(Long schoolId)`

#### SchoolRepository
File: `src/main/java/com/example/studentmanagement/repository/SchoolRepository.java`
1. Extends `JpaRepository<School, Long>`.
2. Custom method: `findByName(String name)`.

### 5) Service Layer (Business Rules)
#### SchoolService
File: `src/main/java/com/example/studentmanagement/service/SchoolService.java`
1. Returns all schools.
2. Creates a school if not present, normalizes the name.

#### StudentService
File: `src/main/java/com/example/studentmanagement/service/StudentService.java`
Key rules:
1. Email and password are required for creation.
2. Duplicate email registration is rejected.
3. Passwords are encoded with BCrypt.
4. Role-based data visibility:
   - `SUPERADMIN` sees all students.
   - `ADMIN` sees students only in their school.
   - `USER` sees only their own record.
5. `addAdmin` is restricted to current `SUPERADMIN`.
6. Access checks are done before view/update/delete.

### 6) Controllers (REST API)
#### StudentController
Base path: `/students`
1. `POST /students` create student.
2. `GET /students` list students (filtered by role).
3. `GET /students/{id}` get by id (access-checked).
4. `PUT /students/{id}` update student (access-checked).
5. `DELETE /students/{id}` delete student (access-checked).

#### SchoolController
Base path: `/schools`
1. `GET /schools` list schools.
2. `POST /schools` create school.

#### AuthController
Base path: `/auth`
1. `POST /auth/login` authenticate and return JWT.
2. `POST /auth/register` create a normal user.
3. `POST /auth/register-admin` create an admin (requires SUPERADMIN via service layer).

### 7) Security and JWT
#### SecurityConfig
File: `src/main/java/com/example/studentmanagement/security/SecurityConfig.java`
1. Stateless security configuration.
2. Permits:
   - `POST /auth/login`
   - `POST /auth/register`
   - Swagger docs
   - Actuator endpoints
   - `GET /schools/**`
3. All other endpoints require a valid JWT.
4. Adds `JwtAuthenticationFilter` before username/password filter.

#### JwtAuthenticationFilter
File: `src/main/java/com/example/studentmanagement/security/JwtAuthenticationFilter.java`
1. Reads `Authorization: Bearer <token>`.
2. Parses token and loads user details.
3. Sets Spring Security context when token is valid.

#### JwtService
File: `src/main/java/com/example/studentmanagement/security/JwtService.java`
1. Reads `app.jwt.secret` and `app.jwt.expiration-ms`.
2. Generates and validates JWT tokens.

#### StudentUserDetailsService
File: `src/main/java/com/example/studentmanagement/security/StudentUserDetailsService.java`
1. Loads `Student` by email.
2. Converts `Student` to Spring `UserDetails` with role.

### 8) Exception Handling
`GlobalExceptionHandler` provides consistent error JSON:
1. `StudentNotFoundException` ? HTTP 404
2. `IllegalArgumentException` ? HTTP 400
3. `AccessDeniedException` ? HTTP 403

### 9) CORS Configuration
`CorsConfig` allows requests from `http://localhost:3000` with common HTTP methods.

## API Usage Examples

### Register a user
```
POST /auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret",
  "schoolId": 1,
  "schoolName": null
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "alice@example.com",
  "password": "secret"
}
```

Response:
```
{
  "token": "<jwt>",
  "tokenType": "Bearer"
}
```

### Authenticated request
```
GET /students
Authorization: Bearer <jwt>
```

## Swagger / OpenAPI
The project includes SpringDoc OpenAPI UI.
1. Swagger UI path is typically `/swagger-ui/index.html`.
2. OpenAPI spec is at `/v3/api-docs`.

## Running the Project
1. Ensure Java 17 is installed.
2. Run with Maven:
```
./mvnw spring-boot:run
```
3. The API will be available at `http://localhost:8080`.

## Database Notes
1. SQLite file lives at `./data/studentmanagement.db`.
2. JPA `ddl-auto=update` creates tables if missing.
3. If you change entities, schema will update automatically on startup.

## Testing
Currently basic Spring Boot test dependencies are included. You can run:
```
./mvnw test
```

## Common Pitfalls
1. JWT secret must be at least 32 characters.
2. Ensure SQLite file location is writable.
3. To create admins, you must first login as a SUPERADMIN user.

## Next Steps (Optional)
1. Add validation annotations on DTOs (e.g., `@NotBlank`).
2. Add refresh tokens or token revocation.
3. Add pagination for `/students`.
4. Add integration tests for security and repository layers.

