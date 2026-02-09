package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.AuthRequest;
import com.example.studentmanagement.dto.AuthResponse;
import com.example.studentmanagement.dto.RegisterRequest;
import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.security.JwtService;
import com.example.studentmanagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StudentService studentService;

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
