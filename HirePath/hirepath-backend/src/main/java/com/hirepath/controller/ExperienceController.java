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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Experience;
import com.hirepath.model.User;
import com.hirepath.repository.ExperienceRepository;
import com.hirepath.repository.UserRepository;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class ExperienceController {
	
	private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;

    public ExperienceController(
            ExperienceRepository experienceRepository,
            UserRepository userRepository) {
        this.experienceRepository = experienceRepository;
        this.userRepository = userRepository;
    }

 // ✅ GET APPROVED EXPERIENCES (Student page)
    @GetMapping
    public List<Experience> getApprovedExperiences() {
        return experienceRepository.findByStatusIgnoreCase("APPROVED");
    }

    // ✅ GET PENDING EXPERIENCES (Admin page)
    @GetMapping("/pending")
    public List<Experience> getPendingExperiences() {
        return experienceRepository.findByStatusIgnoreCase("PENDING");
    }

    @GetMapping("/student/{studentId}")
    public List<Experience> getStudentExperiences(@PathVariable Long studentId) {
        return experienceRepository.findByStudent_Id(studentId);
    }

    // ✅ SUBMIT EXPERIENCE
    @PostMapping
    public Experience submitExperience(
            @RequestParam Long studentId,
            @RequestBody Experience experience) {

        User student = userRepository.findById(studentId).orElseThrow();
        experience.setStudent(student);
        experience.setStatus("PENDING");

        return experienceRepository.save(experience);
    }

    // ✅ ADMIN APPROVE EXPERIENCE
    @PutMapping("/{id}/approve")
    public Experience approveExperience(@PathVariable Long id) {
        Experience exp = experienceRepository.findById(id).orElseThrow();
        exp.setStatus("APPROVED");
        return experienceRepository.save(exp);
    }

    @PutMapping("/{id}")
    public Experience updateOwnExperience(
            @PathVariable Long id,
            @RequestParam Long studentId,
            @RequestBody Experience updatedExperience) {
        Experience exp = experienceRepository.findByIdAndStudent_Id(id, studentId).orElseThrow();
        exp.setCompanyName(updatedExperience.getCompanyName());
        exp.setRole(updatedExperience.getRole());
        exp.setStudentName(updatedExperience.getStudentName());
        exp.setYear(updatedExperience.getYear());
        exp.setRoundsJson(updatedExperience.getRoundsJson());
        exp.setTips(updatedExperience.getTips());
        // Any student edit should go through moderation again.
        exp.setStatus("PENDING");
        return experienceRepository.save(exp);
    }

    // ✅ ADMIN REJECT (DELETE EXPERIENCE)
    @DeleteMapping("/{id}")
    public void deleteExperience(@PathVariable Long id) {
        experienceRepository.deleteById(id);
    }
}
