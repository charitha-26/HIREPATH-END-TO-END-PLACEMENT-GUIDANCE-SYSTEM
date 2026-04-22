package com.hirepath.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hirepath.model.User;
import com.hirepath.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {
    private static final Path RESUME_UPLOAD_DIR = Paths.get("uploads");

	private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow();
    }
	
 // UPDATE PROFILE
    @PutMapping("/{id}")
    public User updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {

        User user = userRepository.findById(id).orElseThrow();

        user.setName(updatedUser.getName());
        user.setCollegeId(updatedUser.getCollegeId());
        user.setBranch(updatedUser.getBranch());
        user.setSection(updatedUser.getSection());
        user.setBatch(updatedUser.getBatch());
        user.setCgpa(updatedUser.getCgpa());

        return userRepository.save(user);
    }

    @PostMapping(value = "/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(id).orElseThrow();
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Resume file is required");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size must be <= 5MB");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        boolean validType = originalName.endsWith(".pdf") || originalName.endsWith(".doc") || originalName.endsWith(".docx");
        if (!validType) {
            return ResponseEntity.badRequest().body("Only PDF, DOC, or DOCX files are allowed");
        }

        try {
            Files.createDirectories(RESUME_UPLOAD_DIR);
            String extension = originalName.substring(originalName.lastIndexOf('.'));
            String safeFileName = "student_" + id + "_" + System.currentTimeMillis() + extension;
            Path destination = RESUME_UPLOAD_DIR.resolve(safeFileName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            user.setResumePath(destination.toString().replace("\\", "/"));
            userRepository.save(user);
            return ResponseEntity.ok(user.getResumePath());
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to store resume");
        }
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> getResume(@PathVariable Long id) throws IOException {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getResumePath() == null || user.getResumePath().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        Path path = Paths.get(user.getResumePath()).toAbsolutePath().normalize();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/{id}/resume")
    public ResponseEntity<String> deleteResume(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getResumePath() == null || user.getResumePath().isBlank()) {
            return ResponseEntity.badRequest().body("No resume found");
        }
        try {
            Files.deleteIfExists(Paths.get(user.getResumePath()));
            user.setResumePath(null);
            userRepository.save(user);
            return ResponseEntity.ok("Resume deleted");
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete resume");
        }
    }
    
}
