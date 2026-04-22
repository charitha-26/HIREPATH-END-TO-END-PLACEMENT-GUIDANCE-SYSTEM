package com.hirepath.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "batch_training_assignment")
public class BatchTrainingAssignment {


	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String branch;
	    private String section;
	    private String batch;

	    @ManyToOne
	    @JoinColumn(name = "training_id")
	    private Training training;

	    // getters & setters
	    public Long getId() { return id; }

	    public String getBranch() { return branch; }
	    public void setBranch(String branch) { this.branch = branch; }

	    public String getSection() { return section; }
	    public void setSection(String section) { this.section = section; }

	    public String getBatch() { return batch; }
	    public void setBatch(String batch) { this.batch = batch; }

	    public Training getTraining() { return training; }
	    public void setTraining(Training training) { this.training = training; }
}
