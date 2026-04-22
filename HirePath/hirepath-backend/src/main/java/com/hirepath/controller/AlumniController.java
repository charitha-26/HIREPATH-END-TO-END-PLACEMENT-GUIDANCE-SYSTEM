package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Alumni;
import com.hirepath.repository.AlumniRepository;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class AlumniController {

    private final AlumniRepository alumniRepository;

    public AlumniController(AlumniRepository alumniRepository) {
        this.alumniRepository = alumniRepository;
    }

    @GetMapping
    public List<Alumni> getAllAlumni(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String company) {
        if (search != null && !search.isBlank()) {
            return alumniRepository.findByNameContainingIgnoreCase(search);
        }
        if (company != null && !company.isBlank()) {
            return alumniRepository.findByCompanyNameContainingIgnoreCase(company);
        }
        return alumniRepository.findAll();
    }

    @PostMapping
    public Alumni addAlumni(@RequestBody Alumni alumni) {
        Alumni sanitizedAlumni = new Alumni();
        sanitizedAlumni.setName(alumni.getName());
        sanitizedAlumni.setGraduationYear(alumni.getGraduationYear());
        sanitizedAlumni.setCompanyName(alumni.getCompanyName());
        sanitizedAlumni.setLinkedinUrl(alumni.getLinkedinUrl());
        return alumniRepository.save(sanitizedAlumni);
    }

    @DeleteMapping("/{id}")
    public void deleteAlumni(@PathVariable Long id) {
        alumniRepository.deleteById(id);
    }
}
