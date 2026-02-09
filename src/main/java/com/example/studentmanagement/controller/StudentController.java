package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        log.info("Add student request email={}", request.getEmail());
        return studentService.addStudent(request);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        log.info("Fetch students list");
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        log.info("Fetch student by id={}", id);
        return studentService.getStudentById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        log.info("Delete student id={}", id);
        studentService.deleteStudent(id);
    }

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest request) {
        log.info("Update student id={} email={}", id, request.getEmail());
        return studentService.updateStudent(id, request);
    }
}
