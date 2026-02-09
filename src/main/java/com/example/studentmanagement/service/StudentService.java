package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.School;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.Role;
import com.example.studentmanagement.repository.SchoolRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SchoolRepository schoolRepository;

    public Student addStudent(StudentRequest request) {
        log.info("Add student start email={}", request.getEmail());
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            log.warn("Add student failed: missing email");
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            log.warn("Add student failed: missing password");
            throw new IllegalArgumentException("Password is required");
        }
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Add student failed: email already registered email={}", request.getEmail());
            throw new IllegalArgumentException("Email already registered");
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        Role requestedRole = request.getRole() == null ? Role.USER : request.getRole();
        student.setRole(requestedRole);
        student.setSchool(resolveSchool(request.getSchoolId(), request.getSchoolName(), requestedRole));
        Student saved = studentRepository.save(student);
        log.info("Add student success id={} email={}", saved.getId(), saved.getEmail());
        return saved;
    }

    public Student addAdmin(StudentRequest request) {
        log.info("Add admin start email={}", request.getEmail());
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role != Role.SUPERADMIN) {
            log.warn("Add admin denied currentUser={} role={}", current.getEmail(), role);
            throw new AccessDeniedException("Only SUPERADMIN can create admins");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            log.warn("Add admin failed: missing email");
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            log.warn("Add admin failed: missing password");
            throw new IllegalArgumentException("Password is required");
        }
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Add admin failed: email already registered email={}", request.getEmail());
            throw new IllegalArgumentException("Email already registered");
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(Role.ADMIN);
        student.setSchool(resolveSchool(request.getSchoolId(), request.getSchoolName(), Role.ADMIN));
        Student saved = studentRepository.save(student);
        log.info("Add admin success id={} email={}", saved.getId(), saved.getEmail());
        return saved;
    }

    public List<Student> getAllStudents() {
        log.info("Get all students start");
        Student current = getCurrentStudent();
        Role role = current.getRole() != null ? current.getRole() : Role.USER;
        if (role == Role.SUPERADMIN) {
            log.info("Get all students as SUPERADMIN currentUser={}", current.getEmail());
            return studentRepository.findAll();
        }
        if (role == Role.ADMIN) {
            School school = current.getSchool();
            if (school == null || school.getId() == null) {
                log.info("Get all students as ADMIN with no school currentUser={}", current.getEmail());
                return List.of();
            }
            log.info("Get all students as ADMIN currentUser={} schoolId={}", current.getEmail(), school.getId());
            return studentRepository.findAllBySchoolId(school.getId());
        }
        log.info("Get all students as USER currentUser={}", current.getEmail());
        return List.of(current);
    }

    public Student getStudentById(Long id) {
        log.info("Get student by id={}", id);
        Student target = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        ensureAccess(target);
        return target;
    }

    public void deleteStudent(Long id) {
        log.info("Delete student id={}", id);
        Student target = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        ensureAccess(target);
        studentRepository.deleteById(id);
        log.info("Delete student completed id={}", id);
    }

    public Student updateStudent(Long id, StudentRequest request) {

        log.info("Update student start id={} email={}", id, request.getEmail());
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

        Student saved = studentRepository.save(existingStudent);
        log.info("Update student success id={} email={}", saved.getId(), saved.getEmail());
        return saved;
    }

    private Student getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            log.warn("Unauthenticated access attempt");
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
        log.warn("Access denied currentUser={} targetId={}", current.getEmail(), target.getId());
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
