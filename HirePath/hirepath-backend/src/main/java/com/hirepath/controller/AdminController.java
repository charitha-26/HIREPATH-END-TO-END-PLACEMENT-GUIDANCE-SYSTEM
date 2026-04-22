package com.hirepath.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Application;
import com.hirepath.model.Experience;
import com.hirepath.model.User;
import com.hirepath.repository.ApplicationRepository;
import com.hirepath.repository.ExperienceRepository;
import com.hirepath.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class AdminController {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
	private ApplicationRepository applicationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;
	

    // Get all students
    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findAll()
                .stream()
                .filter(user -> "STUDENT".equals(user.getRole()))
                .collect(Collectors.toList());
    }
    

    @GetMapping("/applications")
    public List<Application> getAllApplications(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String status) {
        if (company != null && !company.isBlank() && status != null && !status.isBlank()) {
            return applicationRepository.findByCompanyNameIgnoreCaseAndStatusIgnoreCase(company, status);
        }
        if (company != null && !company.isBlank()) {
            return applicationRepository.findByCompanyNameIgnoreCase(company);
        }
        if (status != null && !status.isBlank()) {
            return applicationRepository.findByStatusIgnoreCase(status);
        }
        return applicationRepository.findAll();
    }

    @PutMapping("/applications/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestParam String status) {
        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);
        return applicationRepository.save(app);
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {

        long totalStudents = userRepository.findAll()
                .stream()
                .filter(u -> "STUDENT".equals(u.getRole()))
                .count();

        long totalApplications = applicationRepository.count();

        long studentsPlaced = applicationRepository.findAll()
                .stream()
                .filter(app -> "Selected".equals(app.getStatus()))
                .map(app -> app.getStudent().getId())
                .distinct()
                .count();

        double placementRate = totalStudents == 0 ? 0 :
                (studentsPlaced * 100.0) / totalStudents;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalApplications", totalApplications);
        stats.put("studentsPlaced", studentsPlaced);
        stats.put("placementRate", Math.round(placementRate * 10.0) / 10.0);
        stats.put("selectedCount", applicationRepository.findByStatusIgnoreCase("Selected").size());

        return stats;
    }
    
    @GetMapping("/branch-stats")
    public List<Map<String, Object>> getBranchStats() {

        List<User> students = userRepository.findAll()
                .stream()
                .filter(u -> "STUDENT".equals(u.getRole()))
                .toList();

        Map<String, Long> totalByBranch =
                students.stream()
                        .collect(Collectors.groupingBy(
                                User::getBranch,
                                Collectors.counting()
                        ));

        Map<String, Long> placedByBranch =
                applicationRepository.findAll().stream()
                        .filter(app -> "Selected".equals(app.getStatus()))
                        .collect(Collectors.groupingBy(
                                app -> app.getStudent().getBranch(),
                                Collectors.mapping(
                                        app -> app.getStudent().getId(),
                                        Collectors.toSet()
                                )
                        ))
                        .entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                e -> (long) e.getValue().size()
                        ));

        List<Map<String, Object>> result = new ArrayList<>();

        for (String branch : totalByBranch.keySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("branch", branch);
            map.put("total", totalByBranch.get(branch));
            map.put("placed", placedByBranch.getOrDefault(branch, 0L));
            result.add(map);
        }

        return result;
    }
    
    @GetMapping("/status-stats")
    public Map<String, Long> getStatusStats() {
        return applicationRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        app -> app.getStatus(),
                        Collectors.counting()
                ));
    }
    
    @GetMapping("/top-performers")
    public List<Map<String, Object>> getTopPerformers(@RequestParam(defaultValue = "5") int limit) {
        Map<User, Long> selectedByStudent = applicationRepository.findAll().stream()
                .filter(app -> "Selected".equalsIgnoreCase(app.getStatus()))
                .collect(Collectors.groupingBy(Application::getStudent, Collectors.counting()));

        return selectedByStudent.entrySet().stream()
                .sorted(Map.Entry.<User, Long>comparingByValue(Comparator.reverseOrder()))
                .limit(limit)
                .map(entry -> {
                    User student = entry.getKey();
                    Map<String, Object> row = new HashMap<>();
                    row.put("studentId", student.getId());
                    row.put("name", student.getName());
                    row.put("branch", student.getBranch());
                    row.put("cgpa", student.getCgpa());
                    row.put("selectedCount", entry.getValue());
                    row.put("resumePath", student.getResumePath());
                    return row;
                })
                .toList();
    }
    
    @GetMapping("/students/{studentId}/resume-path")
    public Map<String, String> getResumePath(@PathVariable Long studentId) {
        User user = userRepository.findById(studentId).orElseThrow();
        Map<String, String> payload = new HashMap<>();
        payload.put("resumePath", user.getResumePath());
        return payload;
    }

    @GetMapping("/students/{studentId}")
    public User getStudentProfile(@PathVariable Long studentId) {
        return userRepository.findById(studentId).orElseThrow();
    }

    @GetMapping("/experiences")
    public List<Experience> getExperiencesByStatus(@RequestParam String status) {
        return experienceRepository.findByStatusIgnoreCase(status);
    }

    @DeleteMapping("/experiences/{id}")
    public void deleteExperience(@PathVariable Long id) {
        experienceRepository.deleteById(id);
    }
	
}
