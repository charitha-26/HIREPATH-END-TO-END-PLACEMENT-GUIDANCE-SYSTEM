package com.hirepath.dto;

public class StudentTrainingResponse {

	private Long id;
    private String studentName;
    private String branch;
    private String section;
    private String trainingName;
    private Integer phase;
    private Double score;
    private Integer rank;

    // constructor
    public StudentTrainingResponse(Long id, String studentName, String branch,
                                   String section, String trainingName,
                                   Integer phase, Double score, Integer rank) {
        this.id = id;
        this.studentName = studentName;
        this.branch = branch;
        this.section = section;
        this.trainingName = trainingName;
        this.phase = phase;
        this.score = score;
        this.rank = rank;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	public String getTrainingName() {
		return trainingName;
	}

	public void setTrainingName(String trainingName) {
		this.trainingName = trainingName;
	}

	public Integer getPhase() {
		return phase;
	}

	public void setPhase(Integer phase) {
		this.phase = phase;
	}

	public Double getScore() {
		return score;
	}

	public void setScore(Double score) {
		this.score = score;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}

	
}
