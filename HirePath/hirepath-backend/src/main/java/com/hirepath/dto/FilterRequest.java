package com.hirepath.dto;

public class FilterRequest {

	private Long trainingId;
    private Integer phase;
    private String branch;
    private String section;
    private String search;
	public String getSearch() {
		return search;
	}
	public void setSearch(String search) {
		this.search = search;
	}
	public Integer getPhase() {
		return phase;
	}
	public void setPhase(Integer phase) {
		this.phase = phase;
	}
	public Long getTrainingId() {
		return trainingId;
	}
	public void setTrainingId(Long trainingId) {
		this.trainingId = trainingId;
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
	
}
