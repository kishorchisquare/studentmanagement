package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.School;
import com.example.studentmanagement.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        log.info("Fetching all schools");
        return schoolService.getAllSchools();
    }

    @PostMapping
    public School createSchool(@RequestBody School school) {
        log.info("Create school request name={}", school.getName());
        return schoolService.createSchool(school.getName());
    }
}
