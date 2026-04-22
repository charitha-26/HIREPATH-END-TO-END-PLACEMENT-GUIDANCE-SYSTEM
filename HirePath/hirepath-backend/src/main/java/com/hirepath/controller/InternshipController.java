package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.dto.InternshipStudentResponse;
import com.hirepath.service.InternshipService;


@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class InternshipController {

    private final InternshipService service;

    public InternshipController(InternshipService service) {
        this.service = service;
    }

    @GetMapping("/{batch}")
    public List<InternshipStudentResponse> getInternships(@PathVariable String batch) {
        return service.getInternshipStudents(batch);
    }

    @GetMapping("/batches")
    public List<String> getAllBatches() {
        return service.getAllBatches();
    }
}
