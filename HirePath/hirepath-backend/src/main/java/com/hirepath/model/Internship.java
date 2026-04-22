package com.hirepath.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

import jakarta.persistence.Entity;
@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String rollNumber;
    private String batch;
    private String company; // multiple allowed (comma separated)
    private Double stipend;
    private String status; // selected / not_selected
    private LocalDate startDate;
private LocalDate endDate;
private String internshipStatus;

    // Getters & Setters

    public Long getId() { return id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Double getStipend() { return stipend; }
    public void setStipend(Double stipend) { this.stipend = stipend; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() {
    return startDate;
}
// 🔹 Setters
public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
}



public LocalDate getEndDate() {
    return endDate;
}
public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
}

public void setInternshipStatus(String internshipStatus) {
    this.internshipStatus = internshipStatus;
}

public String getInternshipStatus() {
    return internshipStatus;
}
}

