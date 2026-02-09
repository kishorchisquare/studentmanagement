package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.School;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Role;
import com.example.studentmanagement.repository.SchoolRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SchoolRepository schoolRepository;

    public Student addStudent(StudentRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        Role requestedRole = request.getRole() == null ? Role.USER : request.getRole();
        student.setRole(requestedRole);
        student.setSchool(resolveSchool(request.getSchoolId(), request.getSchoolName(), requestedRole));
        return studentRepository.save(student);
    }

    public Student addAdmin(StudentRequest request) {
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role != Role.SUPERADMIN) {
            throw new AccessDeniedException("Only SUPERADMIN can create admins");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(Role.ADMIN);
        student.setSchool(resolveSchool(request.getSchoolId(), request.getSchoolName(), Role.ADMIN));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role == Role.SUPERADMIN) {
            return studentRepository.findAll();
        }
        if (role == Role.ADMIN) {
            School school = current.getSchool();
            if (school == null || school.getId() == null) {
                return List.of();
            }
            return studentRepository.findAllBySchoolId(school.getId());
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

    public Student updateStudent(Long id, StudentRequest request) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        ensureAccess(existingStudent);

        existingStudent.setName(request.getName());
        existingStudent.setEmail(request.getEmail());
        if ((request.getSchoolId() != null)
                || (request.getSchoolName() != null && !request.getSchoolName().isBlank())) {
            Role targetRole = existingStudent.getRole() == null ? Role.USER : existingStudent.getRole();
            existingStudent.setSchool(resolveSchool(
                    request.getSchoolId(),
                    request.getSchoolName(),
                    targetRole));
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existingStudent.setPassword(passwordEncoder.encode(request.getPassword()));
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
            School currentSchool = current.getSchool();
            School targetSchool = target.getSchool();
            if (currentSchool != null
                    && targetSchool != null
                    && currentSchool.getId() != null
                    && currentSchool.getId().equals(targetSchool.getId())) {
                return;
            }
        }
        if (current.getEmail() != null && current.getEmail().equals(target.getEmail())) {
            return;
        }
        throw new AccessDeniedException("Not allowed");
    }

    private School resolveSchool(Long schoolId, String schoolName, Role role) {
        if (schoolId != null) {
            return schoolRepository.findById(schoolId)
                    .orElseThrow(() -> new IllegalArgumentException("School not found"));
        }
        if (schoolName != null && !schoolName.isBlank()) {
            String normalized = schoolName.trim();
            return schoolRepository.findByName(normalized)
                    .orElseGet(() -> schoolRepository.save(new School(null, normalized)));
        }
        if (role == Role.SUPERADMIN) {
            return null;
        }
        throw new IllegalArgumentException("School is required");
    }
}
