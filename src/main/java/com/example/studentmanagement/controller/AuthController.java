package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.AuthRequest;
import com.example.studentmanagement.dto.AuthResponse;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.security.JwtService;
import com.example.studentmanagement.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        try {
            if (request == null || request.getUsername() == null || request.getUsername().isBlank()) {
                throw new IllegalArgumentException("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                throw new IllegalArgumentException("Password is required");
            }
            log.info("Login attempt for username={}", request.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            log.info("Login success for username={}", userDetails.getUsername());
            return new AuthResponse(token, "Bearer");
        } catch (IllegalArgumentException ex) {
            log.warn("Login validation failed: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Login failed for username={}", request != null ? request.getUsername() : null, ex);
            throw new RuntimeException("Login failed", ex);
        }
    }

    @PostMapping("/register")
    public Student register(@RequestBody RegisterRequest request) {
        try {
            if (request == null) {
                throw new IllegalArgumentException("Request body is required");
            }
            log.info("Register request for email={}", request.getEmail());
            StudentRequest studentRequest = new StudentRequest(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getSchoolId(),
                    request.getSchoolName(),
                    null);
            return studentService.addStudent(studentRequest);
        } catch (IllegalArgumentException ex) {
            log.warn("Register validation failed: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Register failed for email={}", request != null ? request.getEmail() : null, ex);
            throw new RuntimeException("Registration failed", ex);
        }
    }

    @PostMapping("/register-admin")
    public Student registerAdmin(@RequestBody RegisterRequest request) {
        try {
            if (request == null) {
                throw new IllegalArgumentException("Request body is required");
            }
            log.info("Register-admin request for email={}", request.getEmail());
            StudentRequest studentRequest = new StudentRequest(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getSchoolId(),
                    request.getSchoolName(),
                    null);
            return studentService.addAdmin(studentRequest);
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Register-admin rejected: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Register-admin failed for email={}", request != null ? request.getEmail() : null, ex);
            throw new RuntimeException("Admin registration failed", ex);
        }
    }
}
