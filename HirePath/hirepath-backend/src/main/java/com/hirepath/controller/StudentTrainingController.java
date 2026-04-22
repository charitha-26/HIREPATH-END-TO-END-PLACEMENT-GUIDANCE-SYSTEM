package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.dto.FilterRequest;
import com.hirepath.model.StudentTraining;
import com.hirepath.repository.StudentTrainingRepository;
import com.hirepath.service.StudentTrainingService;

@RestController
@RequestMapping("/api/student-training")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class StudentTrainingController {

    private final StudentTrainingRepository studentTrainingRepository;
    private final StudentTrainingService studentTrainingService;

    public StudentTrainingController(
            StudentTrainingRepository studentTrainingRepository,
            StudentTrainingService studentTrainingService
    ) {
        this.studentTrainingRepository = studentTrainingRepository;
        this.studentTrainingService = studentTrainingService;
    }

    @GetMapping
    public List<StudentTraining> getAll() {
        return studentTrainingRepository.findAll();
    }

    @PostMapping("/filter")
    public List<StudentTraining> filter(@RequestBody FilterRequest request) {
        return studentTrainingRepository.filterStudents(
                request.getTrainingId(),
                request.getPhase(),
                request.getBranch(),
                request.getSection(),
                request.getSearch()
        );
    }

    @GetMapping("/student/{userId}")
    public List<StudentTraining> getByStudent(@PathVariable Long userId) {
        return studentTrainingRepository.findByStudent_Id(userId);
    }

    @PostMapping("/{studentTrainingId}/apply")
    public StudentTraining apply(
            @PathVariable Long studentTrainingId,
            @RequestParam Long studentId
    ) {
        return studentTrainingService.apply(studentTrainingId, studentId);
    }

    @GetMapping("/applied")
    public List<StudentTraining> getAppliedTrainings(@RequestParam(required = false) Long trainingId) {
        return studentTrainingService.getAppliedTrainings(trainingId);
    }
}
