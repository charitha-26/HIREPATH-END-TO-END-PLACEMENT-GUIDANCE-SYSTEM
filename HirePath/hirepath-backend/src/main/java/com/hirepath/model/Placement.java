package com.hirepath.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "placements")
public class Placement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String rollNumber;
    private String batch;
    private String company;
    private double packageAmount;
    private String status; // placed / unplaced

    // Constructors
    public Placement() {}

    public Placement(String studentName,String rollNumber, String batch, String company, double packageAmount, String status) {
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.batch = batch;
        this.company = company;
        this.packageAmount = packageAmount;
        this.status = status;
    }

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

    public double getPackageAmount() { return packageAmount; }
    public void setPackageAmount(double packageAmount) { this.packageAmount = packageAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

