package com.hirepath.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Drive;
import com.hirepath.model.User;
import com.hirepath.repository.DriveRepository;
import com.hirepath.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class DriveController {

	private final DriveRepository driveRepository;
    private final UserRepository userRepository;

    public DriveController(DriveRepository driveRepository, UserRepository userRepository) {
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
    }

    // ✅ GET ALL DRIVES
    //@GetMapping("/drives")
    //public List<Drive> getAllDrives() {
    //    return driveRepository.findAll();
    //}

    @GetMapping("/drives")
    public List<Drive> getAllDrives() {

        List<Drive> drives = driveRepository.findAll();

        drives.forEach(drive -> {
            updateStatusByDates(drive);

            driveRepository.save(drive); // update DB
        });

        return drives;
    }
    
    @GetMapping("/drives/filter")
    public List<Drive> filterDrives(
            @RequestParam Long studentId,
            @RequestParam(required = false) String branch) {
        User student = userRepository.findById(studentId).orElseThrow();
        String effectiveBranch = branch != null && !branch.isBlank() ? branch : student.getBranch();
        Double cgpa = student.getCgpa() != null ? student.getCgpa() : 0.0;

        return driveRepository.findAll().stream()
                .filter(drive -> drive.getMinCgpa() == null || drive.getMinCgpa() <= cgpa)
                .filter(drive -> {
                    if (drive.getBranches() == null || drive.getBranches().isBlank()) {
                        return true;
                    }
                    String[] branches = drive.getBranches().toLowerCase().split(",");
                    String target = effectiveBranch == null ? "" : effectiveBranch.toLowerCase().trim();
                    for (String allowed : branches) {
                        if (allowed.trim().equals(target)) {
                            return true;
                        }
                    }
                    return false;
                })
                .peek(this::updateStatusByDates)
                .toList();
    }
    
 // ✅ GET DRIVE BY ID  🔥 ADD THIS
    @GetMapping("/drives/{id}")
    public Drive getDriveById(@PathVariable Long id) {
        return driveRepository.findById(id).orElseThrow();
    }
    
    // ✅ ADD DRIVE
    @PostMapping("/admin/drive")
    public Drive addDrive(@RequestBody Drive drive) {
        updateStatusByDates(drive);
        return driveRepository.save(drive);
    }

    // ✅ UPDATE DRIVE
    @PutMapping("/admin/drive/{id}")
    public Drive updateDrive(@PathVariable Long id, @RequestBody Drive updated) {

        Drive drive = driveRepository.findById(id).orElseThrow();

        drive.setCompanyName(updated.getCompanyName());
        drive.setRole(updated.getRole());
        drive.setPackageOffered(updated.getPackageOffered());
        drive.setEligibilityCriteria(updated.getEligibilityCriteria());
        drive.setDate(updated.getDate());
        drive.setDeadline(updated.getDeadline());
        drive.setMinCgpa(updated.getMinCgpa());
        drive.setBranches(updated.getBranches());
        updateStatusByDates(drive);
        drive.setApplicationFormLink(updated.getApplicationFormLink());
        drive.setRegistrationLink(updated.getRegistrationLink());
        drive.setApplicationInstructions(updated.getApplicationInstructions());

        return driveRepository.save(drive);
    }

    // ✅ DELETE DRIVE
    @DeleteMapping("/admin/drive/{id}")
    public void deleteDrive(@PathVariable Long id) {
        driveRepository.deleteById(id);
    }

    private void updateStatusByDates(Drive drive) {
        LocalDate today = LocalDate.now();
        if (drive.getDate() == null || drive.getDeadline() == null) {
            drive.setStatus("upcoming");
            return;
        }
        if (today.isBefore(drive.getDate())) {
            drive.setStatus("upcoming");
        } else if (!today.isAfter(drive.getDeadline())) {
            drive.setStatus("ongoing");
        } else {
            drive.setStatus("completed");
        }
    }
}
