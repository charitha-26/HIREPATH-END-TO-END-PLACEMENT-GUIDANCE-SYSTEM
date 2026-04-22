package com.hirepath.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hirepath.model.StudentTraining;

public interface StudentTrainingRepository extends JpaRepository<StudentTraining, Long> {

    List<StudentTraining> findByTraining_Id(Long trainingId);

    boolean existsByStudent_IdAndTraining_Id(Long studentId, Long trainingId);

    List<StudentTraining> findByStudent_Id(Long studentId);

    Optional<StudentTraining> findByIdAndStudent_Id(Long id, Long studentId);

    Optional<StudentTraining> findByStudent_IdAndTraining_Id(Long studentId, Long trainingId);

    List<StudentTraining> findByApplicationStatusIgnoreCase(String applicationStatus);

    List<StudentTraining> findByTraining_IdAndApplicationStatusIgnoreCase(Long trainingId, String applicationStatus);

    void deleteByStudent_IdInAndTraining_Id(List<Long> studentIds, Long trainingId);

    @Modifying
    @Query("""
            DELETE FROM StudentTraining st
            WHERE st.training.id = :trainingId
            AND LOWER(TRIM(st.student.branch)) = LOWER(TRIM(:branch))
            AND LOWER(TRIM(st.student.section)) = LOWER(TRIM(:section))
            AND LOWER(TRIM(st.student.batch)) = LOWER(TRIM(:batch))
            """)
    void deleteByStudentBatchAndTrainingId(
            @Param("branch") String branch,
            @Param("section") String section,
            @Param("batch") String batch,
            @Param("trainingId") Long trainingId
    );

    @Query("""
            SELECT st FROM StudentTraining st
            JOIN st.student s
            WHERE (:trainingId IS NULL OR st.training.id = :trainingId)
            AND (:phase IS NULL OR st.phase = :phase)
            AND (:branch IS NULL OR s.branch = :branch)
            AND (:section IS NULL OR s.section = :section)
            AND (:search IS NULL OR LOWER(s.collegeId) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY st.score DESC
            """)
    List<StudentTraining> filterStudents(
            Long trainingId,
            Integer phase,
            String branch,
            String section,
            String search
    );
}
