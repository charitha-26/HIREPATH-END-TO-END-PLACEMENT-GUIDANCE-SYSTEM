package com.hirepath.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "experiences")
public class Experience {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String role;
    private String studentName;
    private String year;

    @Column(length = 3000)
    private String roundsJson;

    @Column(length = 2000)
    private String tips;

    private String status;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

	public Experience() {
	}

	public Experience(Long id, String companyName, String role, String studentName, String year, String roundsJson,
			String tips, String status, User student) {
		this.id = id;
		this.companyName = companyName;
		this.role = role;
		this.studentName = studentName;
		this.year = year;
		this.roundsJson = roundsJson;
		this.tips = tips;
		this.status = status;
		this.student = student;
	}

    @PrePersist
    public void onCreate() {
        if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getRoundsJson() {
		return roundsJson;
	}

	public void setRoundsJson(String roundsJson) {
		this.roundsJson = roundsJson;
	}

	public String getTips() {
		return tips;
	}

	public void setTips(String tips) {
		this.tips = tips;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public User getStudent() {
		return student;
	}

	public void setStudent(User student) {
		this.student = student;
	}

    // getters & setters
	
}
