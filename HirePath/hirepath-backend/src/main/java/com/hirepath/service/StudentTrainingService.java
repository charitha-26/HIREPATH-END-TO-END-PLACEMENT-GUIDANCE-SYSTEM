package com.hirepath.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hirepath.model.StudentTraining;
import com.hirepath.repository.StudentTrainingRepository;

@Service
public class StudentTrainingService {

    private final StudentTrainingRepository studentTrainingRepository;

    public StudentTrainingService(StudentTrainingRepository studentTrainingRepository) {
        this.studentTrainingRepository = studentTrainingRepository;
    }

    public StudentTraining apply(Long studentTrainingId, Long studentId) {
        StudentTraining studentTraining = studentTrainingRepository.findByIdAndStudent_Id(studentTrainingId, studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assigned training not found"));

        if ("APPLIED".equalsIgnoreCase(studentTraining.getApplicationStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Training already applied");
        }

        studentTraining.setApplicationStatus("APPLIED");
        studentTraining.setAppliedAt(LocalDateTime.now());
        return studentTrainingRepository.save(studentTraining);
    }

    public List<StudentTraining> getAppliedTrainings(Long trainingId) {
        if (trainingId != null) {
            return studentTrainingRepository.findByTraining_IdAndApplicationStatusIgnoreCase(trainingId, "APPLIED");
        }
        return studentTrainingRepository.findByApplicationStatusIgnoreCase("APPLIED");
    }
}
