package com.example.studentmanagement.dto;

import com.example.studentmanagement.model.Role;

public class StudentRequest {

    private String name;
    private String email;
    private String password;
    private Long schoolId;
    private String schoolName;
    private Role role;

    public StudentRequest() {
    }

    public StudentRequest(String name, String email, String password, Long schoolId, String schoolName, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
