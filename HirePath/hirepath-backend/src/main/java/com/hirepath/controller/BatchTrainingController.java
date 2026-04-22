package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.dto.BatchAssignRequest;
import com.hirepath.model.BatchTrainingAssignment;
import com.hirepath.repository.BatchTrainingAssignmentRepository;
import com.hirepath.service.BatchTrainingService;

@RestController
@RequestMapping("/api/batch-training")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class BatchTrainingController {

    private final BatchTrainingAssignmentRepository batchTrainingAssignmentRepository;
    private final BatchTrainingService batchTrainingService;

    public BatchTrainingController(
            BatchTrainingAssignmentRepository batchTrainingAssignmentRepository,
            BatchTrainingService batchTrainingService
    ) {
        this.batchTrainingAssignmentRepository = batchTrainingAssignmentRepository;
        this.batchTrainingService = batchTrainingService;
    }

    @PostMapping("/assign")
    public String assignTraining(@RequestBody BatchAssignRequest request) {
        return batchTrainingService.assignTraining(request);
    }

    @GetMapping("/all")
    public List<BatchTrainingAssignment> getAll() {
        return batchTrainingAssignmentRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        return batchTrainingService.deleteAssignment(id);
    }

    @PutMapping("/update/{id}")
    public String update(@PathVariable Long id, @RequestBody BatchAssignRequest request) {
        return batchTrainingService.updateAssignment(id, request);
    }
}
