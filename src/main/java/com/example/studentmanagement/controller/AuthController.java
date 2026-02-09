package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.AuthRequest;
import com.example.studentmanagement.dto.AuthResponse;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final StudentService studentService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            StudentService studentService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.studentService = studentService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, "Bearer");
    }

    @PostMapping("/register")
    public Student register(@RequestBody RegisterRequest request) {
        StudentRequest studentRequest = new StudentRequest(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getSchoolId(),
                request.getSchoolName(),
                null);
        return studentService.addStudent(studentRequest);
    }

    @PostMapping("/register-admin")
    public Student registerAdmin(@RequestBody RegisterRequest request) {
        StudentRequest studentRequest = new StudentRequest(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getSchoolId(),
                request.getSchoolName(),
                null);
        return studentService.addAdmin(studentRequest);
    }
}

