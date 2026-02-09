package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.School;
import com.example.studentmanagement.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @PostMapping
    public School createSchool(@RequestBody School school) {
        return schoolService.createSchool(school.getName());
    }
}
