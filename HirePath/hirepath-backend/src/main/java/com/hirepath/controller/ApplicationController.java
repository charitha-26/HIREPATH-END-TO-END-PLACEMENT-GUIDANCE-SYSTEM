package com.hirepath.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Application;
import com.hirepath.model.Drive;
import com.hirepath.model.User;
import com.hirepath.repository.ApplicationRepository;
import com.hirepath.repository.DriveRepository;
import com.hirepath.repository.UserRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class ApplicationController {

	private final ApplicationRepository applicationRepository;
    private final DriveRepository driveRepository;
    private final UserRepository userRepository;
	
    public ApplicationController(
            ApplicationRepository applicationRepository,
            DriveRepository driveRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudent(@PathVariable Long studentId) {
        return applicationRepository.findByStudent_Id(studentId);
    }
    
    @GetMapping("/student/{studentId}/history")
    public List<Application> getApplicationHistory(@PathVariable Long studentId,
                                                   @RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return applicationRepository.findByStudent_IdAndStatusIgnoreCase(studentId, status);
        }
        return applicationRepository.findByStudent_Id(studentId);
    }
    
    @PostMapping("/apply")
    public Application applyToDrive(
            @RequestParam Long studentId,
            @RequestParam Long driveId) {

        // Check if already applied
        boolean alreadyApplied = applicationRepository
                .existsByStudent_IdAndDrive_Id(studentId, driveId);

        if (alreadyApplied) {
            throw new RuntimeException("Already applied");
        }

        Drive drive = driveRepository.findById(driveId).orElseThrow();
        User student = userRepository.findById(studentId).orElseThrow();
        LocalDate today = LocalDate.now();

        if (drive.getDeadline() != null && today.isAfter(drive.getDeadline())) {
            throw new RuntimeException("Deadline is over for this drive");
        }

        if ("completed".equalsIgnoreCase(drive.getStatus())) {
            throw new RuntimeException("Cannot apply to completed drive");
        }

        Application application = new Application();
        application.setCompanyName(drive.getCompanyName());
        application.setRole(drive.getRole());
        application.setStatus("Applied");
        application.setStudent(student);
        application.setDrive(drive);
        return applicationRepository.save(application);
    }
    
    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);
        return applicationRepository.save(app);
    }
	
}
