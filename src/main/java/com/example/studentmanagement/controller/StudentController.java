package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student addStudent(@RequestBody StudentRequest request) {
        try {
            log.info("Add student request email={}", request != null ? request.getEmail() : null);
            return studentService.addStudent(request);
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Add student rejected: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Add student failed for email={}", request != null ? request.getEmail() : null, ex);
            throw new RuntimeException("Unable to add student", ex);
        }
    }

    @GetMapping
    public List<Student> getAllStudents() {
        try {
            log.info("Fetch students list");
            return studentService.getAllStudents();
        } catch (AccessDeniedException ex) {
            log.warn("Fetch students denied: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Fetch students failed", ex);
            throw new RuntimeException("Unable to fetch students", ex);
        }
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        try {
            log.info("Fetch student by id={}", id);
            return studentService.getStudentById(id);
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Fetch student rejected id={} message={}", id, ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Fetch student failed id={}", id, ex);
            throw new RuntimeException("Unable to fetch student", ex);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        try {
            log.info("Delete student id={}", id);
            studentService.deleteStudent(id);
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Delete student rejected id={} message={}", id, ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Delete student failed id={}", id, ex);
            throw new RuntimeException("Unable to delete student", ex);
        }
    }

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest request) {
        try {
            log.info("Update student id={} email={}", id, request != null ? request.getEmail() : null);
            return studentService.updateStudent(id, request);
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Update student rejected id={} message={}", id, ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Update student failed id={}", id, ex);
            throw new RuntimeException("Unable to update student", ex);
        }
    }
}
