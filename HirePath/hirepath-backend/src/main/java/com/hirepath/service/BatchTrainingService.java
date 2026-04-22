package com.hirepath.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hirepath.dto.BatchAssignRequest;
import com.hirepath.model.BatchTrainingAssignment;
import com.hirepath.model.StudentTraining;
import com.hirepath.model.Training;
import com.hirepath.model.User;
import com.hirepath.repository.BatchTrainingAssignmentRepository;
import com.hirepath.repository.StudentTrainingRepository;
import com.hirepath.repository.TrainingRepository;
import com.hirepath.repository.UserRepository;

@Service
public class BatchTrainingService {

    private final UserRepository userRepository;
    private final TrainingRepository trainingRepository;
    private final StudentTrainingRepository studentTrainingRepository;
    private final BatchTrainingAssignmentRepository batchTrainingAssignmentRepository;

    public BatchTrainingService(
            UserRepository userRepository,
            TrainingRepository trainingRepository,
            StudentTrainingRepository studentTrainingRepository,
            BatchTrainingAssignmentRepository batchTrainingAssignmentRepository
    ) {
        this.userRepository = userRepository;
        this.trainingRepository = trainingRepository;
        this.studentTrainingRepository = studentTrainingRepository;
        this.batchTrainingAssignmentRepository = batchTrainingAssignmentRepository;
    }

    @Transactional
    public String assignTraining(BatchAssignRequest request) {
        validateRequest(request);
        normalizeRequest(request);

        if (batchTrainingAssignmentRepository.findByBranchAndSectionAndBatchAndTraining_Id(
                request.getBranch(),
                request.getSection(),
                request.getBatch(),
                request.getTrainingId()
        ).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Training already assigned to this batch");
        }

        Training training = getTraining(request.getTrainingId());
        List<User> students = getStudents(request);

        BatchTrainingAssignment assignment = new BatchTrainingAssignment();
        assignment.setBranch(request.getBranch());
        assignment.setSection(request.getSection());
        assignment.setBatch(request.getBatch());
        assignment.setTraining(training);
        batchTrainingAssignmentRepository.save(assignment);

        addTrainingToStudents(students, training);
        return "Assigned to " + students.size() + " students";
    }

    @Transactional
    public String updateAssignment(Long id, BatchAssignRequest request) {
        validateRequest(request);
        normalizeRequest(request);

        BatchTrainingAssignment existing = batchTrainingAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        Long previousTrainingId = existing.getTraining().getId();
        removeTrainingFromStudents(existing.getBranch(), existing.getSection(), existing.getBatch(), previousTrainingId);

        Training newTraining = getTraining(request.getTrainingId());
        List<User> newStudents = getStudents(request);

        existing.setBranch(request.getBranch());
        existing.setSection(request.getSection());
        existing.setBatch(request.getBatch());
        existing.setTraining(newTraining);
        batchTrainingAssignmentRepository.save(existing);

        addTrainingToStudents(newStudents, newTraining);
        return "Updated successfully";
    }

    @Transactional
    public String deleteAssignment(Long id) {
        BatchTrainingAssignment existing = batchTrainingAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found"));

        removeTrainingFromStudents(
                existing.getBranch(),
                existing.getSection(),
                existing.getBatch(),
                existing.getTraining().getId()
        );
        batchTrainingAssignmentRepository.delete(existing);
        return "Deleted successfully";
    }

    private void validateRequest(BatchAssignRequest request) {
        if (request.getBranch() == null || request.getBranch().isBlank()
                || request.getSection() == null || request.getSection().isBlank()
                || request.getBatch() == null || request.getBatch().isBlank()
                || request.getTrainingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Branch, section, batch and training are required");
        }
    }

    private void normalizeRequest(BatchAssignRequest request) {
        request.setBranch(normalizeValue(request.getBranch()));
        request.setSection(normalizeValue(request.getSection()));
        request.setBatch(normalizeValue(request.getBatch()));
    }

    private Training getTraining(Long trainingId) {
        return trainingRepository.findById(trainingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Training not found"));
    }

    private List<User> getStudents(BatchAssignRequest request) {
        return getStudents(request.getBranch(), request.getSection(), request.getBatch());
    }

    private List<User> getStudents(String branch, String section, String batch) {
        String normalizedBranch = normalizeValue(branch);
        String normalizedSection = normalizeValue(section);
        String normalizedBatch = normalizeValue(batch);

        List<User> allStudents = userRepository.findAll().stream()
                .filter(user -> matchesValue(user.getRole(), "STUDENT"))
                .toList();

        List<User> students = allStudents.stream()
                .filter(user -> matchesValue(user.getRole(), "STUDENT"))
                .filter(user -> matchesValue(user.getBranch(), normalizedBranch))
                .filter(user -> matchesValue(user.getSection(), normalizedSection))
                .filter(user -> matchesValue(user.getBatch(), normalizedBatch))
                .toList();

        if (students.isEmpty()) {
            students = allStudents.stream()
                    .filter(user -> matchesValue(user.getBranch(), normalizedBranch))
                    .filter(user -> matchesValue(user.getBatch(), normalizedBatch))
                    .filter(user -> isBlank(user.getSection()) || matchesValue(user.getSection(), normalizedSection))
                    .toList();
        }

        if (students.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No students found for the selected batch");
        }
        return students;
    }

    private String normalizeValue(String value) {
        return value == null ? null : value.trim();
    }

    private boolean matchesValue(String actual, String expected) {
        if (actual == null || expected == null) {
            return false;
        }
        return actual.trim().equalsIgnoreCase(expected);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void addTrainingToStudents(List<User> students, Training training) {
        for (User student : students) {
            boolean exists = studentTrainingRepository.existsByStudent_IdAndTraining_Id(student.getId(), training.getId());
            if (exists) {
                continue;
            }

            StudentTraining studentTraining = new StudentTraining();
            studentTraining.setStudent(student);
            studentTraining.setTraining(training);
            studentTraining.setPhase(1);
            studentTraining.setRank(0);
            studentTraining.setScore(0.0);
            studentTraining.setApplicationStatus("ASSIGNED");
            studentTrainingRepository.save(studentTraining);
        }
    }

    private void removeTrainingFromStudents(String branch, String section, String batch, Long trainingId) {
        studentTrainingRepository.deleteByStudentBatchAndTrainingId(
                normalizeValue(branch),
                normalizeValue(section),
                normalizeValue(batch),
                trainingId
        );
    }
}
