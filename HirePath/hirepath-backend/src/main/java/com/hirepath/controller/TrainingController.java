package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Training;
import com.hirepath.repository.TrainingRepository;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class TrainingController {

	    private final TrainingRepository trainingRepository;

	    public TrainingController(TrainingRepository trainingRepository) {
	        this.trainingRepository = trainingRepository;
	    }

	    @GetMapping
	    public List<Training> getAllTrainings() {
	        return trainingRepository.findAll();
	    }

	    @PostMapping
	    public Training addTraining(@RequestBody Training training) {
	        return trainingRepository.save(training);
	    }
	
}
