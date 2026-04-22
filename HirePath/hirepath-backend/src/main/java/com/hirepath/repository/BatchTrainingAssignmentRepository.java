package com.hirepath.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.BatchTrainingAssignment;

public interface BatchTrainingAssignmentRepository extends JpaRepository<BatchTrainingAssignment, Long> {

    Optional<BatchTrainingAssignment> findByBranchAndSectionAndBatchAndTraining_Id(
            String branch,
            String section,
            String batch,
            Long trainingId
    );
}
