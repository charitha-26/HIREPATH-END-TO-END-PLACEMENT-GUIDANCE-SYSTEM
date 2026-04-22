package com.hirepath.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "applications")

public class Application {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyName;
    private String role;
    private String status; // Applied, Shortlisted, Selected, Rejected

    private LocalDateTime appliedDate;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "drive_id")   
    private Drive drive;

    @PrePersist
    public void onCreate() {
        appliedDate = LocalDateTime.now();
        if (status == null) {
            status = "Applied";
        }
    }

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedDate() { return appliedDate; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Drive getDrive() { return drive; }
    public void setDrive(Drive drive) { this.drive = drive; }
}
