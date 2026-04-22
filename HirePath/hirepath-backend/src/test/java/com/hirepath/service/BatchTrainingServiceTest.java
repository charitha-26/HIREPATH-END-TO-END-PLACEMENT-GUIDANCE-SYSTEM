package com.hirepath.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

@ExtendWith(MockitoExtension.class)
class BatchTrainingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainingRepository trainingRepository;

    @Mock
    private StudentTrainingRepository studentTrainingRepository;

    @Mock
    private BatchTrainingAssignmentRepository batchTrainingAssignmentRepository;

    @InjectMocks
    private BatchTrainingService batchTrainingService;

    @Test
    void assignTrainingAddsStudentTrainingRowsForMatchedStudents() {
        BatchAssignRequest request = new BatchAssignRequest();
        request.setBranch(" CSE ");
        request.setSection(" A ");
        request.setBatch(" 2024 ");
        request.setTrainingId(7L);

        Training training = new Training();
        training.setId(7L);
        training.setPlatform("Aptitude");

        User student = new User();
        student.setId(11L);
        student.setRole("STUDENT");

        when(batchTrainingAssignmentRepository.findByBranchAndSectionAndBatchAndTraining_Id("CSE", "A", "2024", 7L))
                .thenReturn(Optional.empty());
        when(trainingRepository.findById(7L)).thenReturn(Optional.of(training));
        when(userRepository.findAll()).thenReturn(List.of(student));
        when(studentTrainingRepository.existsByStudent_IdAndTraining_Id(11L, 7L)).thenReturn(false);

        String result = batchTrainingService.assignTraining(request);

        assertEquals("Assigned to 1 students", result);

        ArgumentCaptor<StudentTraining> studentTrainingCaptor = ArgumentCaptor.forClass(StudentTraining.class);
        verify(studentTrainingRepository).save(studentTrainingCaptor.capture());

        StudentTraining savedStudentTraining = studentTrainingCaptor.getValue();
        assertEquals(11L, savedStudentTraining.getStudent().getId());
        assertEquals(7L, savedStudentTraining.getTraining().getId());
        assertEquals("ASSIGNED", savedStudentTraining.getApplicationStatus());
        assertEquals(1, savedStudentTraining.getPhase());
        assertEquals(0, savedStudentTraining.getRank());
    }

    @Test
    void assignTrainingFailsWhenNoStudentsMatchSelection() {
        BatchAssignRequest request = new BatchAssignRequest();
        request.setBranch("CSE");
        request.setSection("A");
        request.setBatch("2024");
        request.setTrainingId(7L);

        Training training = new Training();
        training.setId(7L);

        when(batchTrainingAssignmentRepository.findByBranchAndSectionAndBatchAndTraining_Id("CSE", "A", "2024", 7L))
                .thenReturn(Optional.empty());
        when(trainingRepository.findById(7L)).thenReturn(Optional.of(training));
        when(userRepository.findAll()).thenReturn(List.of());

        assertThrows(ResponseStatusException.class, () -> batchTrainingService.assignTraining(request));

        verify(studentTrainingRepository, never()).save(any(StudentTraining.class));
        verify(batchTrainingAssignmentRepository, never()).save(any(BatchTrainingAssignment.class));
    }

    @Test
    void deleteAssignmentRemovesAssignmentEvenWhenNoStudentsCurrentlyMatch() {
        Training training = new Training();
        training.setId(7L);

        BatchTrainingAssignment assignment = new BatchTrainingAssignment();
        assignment.setBranch("CSE");
        assignment.setSection("A");
        assignment.setBatch("2024");
        assignment.setTraining(training);

        when(batchTrainingAssignmentRepository.findById(5L)).thenReturn(Optional.of(assignment));

        String result = batchTrainingService.deleteAssignment(5L);

        assertEquals("Deleted successfully", result);
        verify(studentTrainingRepository).deleteByStudentBatchAndTrainingId("CSE", "A", "2024", 7L);
        verify(batchTrainingAssignmentRepository).delete(assignment);
    }
}
