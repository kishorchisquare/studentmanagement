package com.example.studentmanagement.service;

import com.example.studentmanagement.exception.StudentNotFoundException;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Role;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection (BEST PRACTICE)
    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Student addStudent(Student student) {
        if (student.getEmail() == null || student.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (student.getSchoolName() == null || student.getSchoolName().isBlank()) {
            throw new IllegalArgumentException("School name is required");
        }
        if (student.getPassword() == null || student.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (student.getRole() == null) {
            student.setRole(Role.USER);
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role == Role.SUPERADMIN) {
            return studentRepository.findAll();
        }
        if (role == Role.ADMIN) {
            return studentRepository.findAllBySchoolName(current.getSchoolName());
        }
        return List.of(current);
    }

    public Student getStudentById(Long id) {
        Student target = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        ensureAccess(target);
        return target;
    }

    public void deleteStudent(Long id) {
        Student target = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        ensureAccess(target);
        studentRepository.deleteById(id);
    }

    public Student updateStudent(Long id, Student updatedStudent) {

    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(id));
    ensureAccess(existingStudent);

    existingStudent.setName(updatedStudent.getName());
    existingStudent.setEmail(updatedStudent.getEmail());
    if (updatedStudent.getSchoolName() != null && !updatedStudent.getSchoolName().isBlank()) {
        existingStudent.setSchoolName(updatedStudent.getSchoolName());
    }
    if (updatedStudent.getPassword() != null && !updatedStudent.getPassword().isBlank()) {
        existingStudent.setPassword(passwordEncoder.encode(updatedStudent.getPassword()));
    }

    return studentRepository.save(existingStudent);
}

    private Student getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return studentRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    private void ensureAccess(Student target) {
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role == Role.SUPERADMIN) {
            return;
        }
        if (role == Role.ADMIN) {
            if (current.getSchoolName() != null
                    && current.getSchoolName().equals(target.getSchoolName())) {
                return;
            }
        }
        if (current.getEmail() != null && current.getEmail().equals(target.getEmail())) {
            return;
        }
        throw new AccessDeniedException("Not allowed");
    }

}
