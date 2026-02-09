package com.example.studentmanagement.service;

import com.example.studentmanagement.model.School;
import com.example.studentmanagement.repository.SchoolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School createSchool(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("School name is required");
        }
        String normalized = name.trim();
        return schoolRepository.findByName(normalized)
                .orElseGet(() -> schoolRepository.save(new School(null, normalized)));
    }
}
