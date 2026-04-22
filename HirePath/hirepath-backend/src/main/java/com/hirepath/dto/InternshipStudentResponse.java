package com.hirepath.dto;

import java.time.LocalDate;

public class InternshipStudentResponse {

        private String studentName;
    private String rollNumber;

    private String internshipCompany;
    private Double stipend;
    private String fteStatus;
    private String fteCompany;
    private Double ftePackage;

    private String internshipStatus;
private LocalDate startDate;
private LocalDate endDate;

    public InternshipStudentResponse(String studentName,
                                     String rollNumber,
                                     String internshipCompany,
                                     Double stipend,
                                     String fteStatus,
                                     String fteCompany,
                                     Double ftePackage,
                                     String internshipStatus,
                                     LocalDate startDate,
                                     LocalDate endDate) {

        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.internshipCompany = internshipCompany;
        this.stipend = stipend;
        this.fteStatus = fteStatus;
        this.fteCompany = fteCompany;
        this.ftePackage = ftePackage;
        this.internshipStatus = internshipStatus;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters
    public String getStudentName() { return studentName; }
    public String getRollNumber() { return rollNumber; }
    public String getInternshipCompany() { return internshipCompany; }
    public Double getStipend() { return stipend; }
    public String getFteStatus() { return fteStatus; }
    public String getFteCompany() { return fteCompany; }
    public Double getFtePackage() { return ftePackage; }
    public String getInternshipStatus() { return internshipStatus; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }

}
