package com.example.studentmanagement.service;

import com.example.studentmanagement.model.School;
import com.example.studentmanagement.repository.SchoolRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    private static final Logger log = LoggerFactory.getLogger(SchoolService.class);

    @Autowired
    private SchoolRepository schoolRepository;

    public List<School> getAllSchools() {
        try {
            log.info("Fetching all schools from repository");
            return schoolRepository.findAll();
        } catch (Exception ex) {
            log.error("Get all schools failed", ex);
            throw new RuntimeException("Failed to fetch schools", ex);
        }
    }

    public School createSchool(String name) {
        try {
            if (name == null || name.isBlank()) {
                log.warn("Create school failed: blank name");
                throw new IllegalArgumentException("School name is required");
            }
            String normalized = name.trim();
            School school = schoolRepository.findByName(normalized)
                    .orElseGet(() -> schoolRepository.save(new School(null, normalized)));
            log.info("Create school result name={} id={}", school.getName(), school.getId());
            return school;
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Create school failed name={}", name, ex);
            throw new RuntimeException("Failed to create school", ex);
        }
    }
}
