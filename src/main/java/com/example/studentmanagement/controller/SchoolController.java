package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.School;
import com.example.studentmanagement.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
public class SchoolController {

    private static final Logger log = LoggerFactory.getLogger(SchoolController.class);

    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public List<School> getAllSchools() {
        try {
            log.info("Fetching all schools");
            return schoolService.getAllSchools();
        } catch (AccessDeniedException ex) {
            log.warn("Fetch schools denied: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Fetch schools failed", ex);
            throw new RuntimeException("Unable to fetch schools", ex);
        }
    }

    @PostMapping
    public School createSchool(@RequestBody School school) {
        try {
            if (school == null) {
                throw new IllegalArgumentException("School body is required");
            }
            log.info("Create school request name={}", school.getName());
            return schoolService.createSchool(school.getName());
        } catch (IllegalArgumentException | AccessDeniedException ex) {
            log.warn("Create school rejected: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Create school failed name={}", school != null ? school.getName() : null, ex);
            throw new RuntimeException("Unable to create school", ex);
        }
    }
}
