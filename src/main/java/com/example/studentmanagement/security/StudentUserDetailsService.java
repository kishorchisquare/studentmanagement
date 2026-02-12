package com.example.studentmanagement.security;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Role;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StudentUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(StudentUserDetailsService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            log.info("Load user details for username={}", username);
            Student student = studentRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            Role role = student.getRole() != null ? student.getRole() : Role.USER;
            return User.withUsername(student.getEmail())
                    .password(student.getPassword())
                    .roles(role.name())
                    .build();
        } catch (UsernameNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed loading user details for username={}", username, ex);
            throw new RuntimeException("Failed to load user details", ex);
        }
    }
}
