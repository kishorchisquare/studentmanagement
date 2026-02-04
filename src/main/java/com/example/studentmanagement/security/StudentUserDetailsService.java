package com.example.studentmanagement.security;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Role;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StudentUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    public StudentUserDetailsService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = studentRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Role role = student.getRole() != null ? student.getRole() : Role.USER;
        return User.withUsername(student.getEmail())
                .password(student.getPassword())
                .roles(role.name())
                .build();
    }
}
