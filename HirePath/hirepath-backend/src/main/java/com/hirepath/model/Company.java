package com.hirepath.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "companies")
public class Company {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String industry;

    private Double minCgpa;          // eligibility
    private String branches;         // comma separated
    private String roles;            // comma separated
    private String packageLpa;
    private String companyProfileLink;
    private String formLink;

    // ===== Getters & Setters =====

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getBranches() { return branches; }
    public void setBranches(String branches) { this.branches = branches; }

    public String getRoles() { return roles; }
    public void setRoles(String roles) { this.roles = roles; }

    public String getPackageLpa() { return packageLpa; }
    public void setPackageLpa(String packageLpa) { this.packageLpa = packageLpa; }

    public String getCompanyProfileLink() { return companyProfileLink; }
    public void setCompanyProfileLink(String companyProfileLink) { this.companyProfileLink = companyProfileLink; }

    public String getFormLink() { return formLink; }
    public void setFormLink(String formLink) { this.formLink = formLink; }
}
