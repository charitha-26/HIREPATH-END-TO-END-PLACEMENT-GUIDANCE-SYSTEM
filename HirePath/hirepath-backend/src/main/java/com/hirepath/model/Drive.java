package com.hirepath.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "drives")
public class Drive {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;   // We keep it simple (no foreign key now)
    private String role;
    private Double packageOffered;
    private String eligibilityCriteria;

    private LocalDate date;
    private LocalDate deadline;

    private Double minCgpa;
    private String branches;      // comma separated

    private String status;        // upcoming / ongoing / completed
    private String applicationFormLink;
    private String registrationLink;
    private String applicationInstructions;

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getPackageOffered() { return packageOffered; }
    public void setPackageOffered(Double packageOffered) { this.packageOffered = packageOffered; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getBranches() { return branches; }
    public void setBranches(String branches) { this.branches = branches; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApplicationFormLink() { return applicationFormLink; }
    public void setApplicationFormLink(String applicationFormLink) { this.applicationFormLink = applicationFormLink; }

    public String getRegistrationLink() { return registrationLink; }
    public void setRegistrationLink(String registrationLink) { this.registrationLink = registrationLink; }

    public String getApplicationInstructions() { return applicationInstructions; }
    public void setApplicationInstructions(String applicationInstructions) { this.applicationInstructions = applicationInstructions; }
}
