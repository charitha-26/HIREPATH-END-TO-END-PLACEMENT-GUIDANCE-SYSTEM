package com.hirepath.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hirepath.model.Internship;
import com.hirepath.model.Placement;

public interface InternshipRepository extends JpaRepository<Internship, Long> {

    @Query("SELECT i FROM Internship i WHERE TRIM(i.batch) = TRIM(:batch)")
    List<Internship> findByBatch(String batch);
    Optional<Placement> findByRollNumber(String rollNumber);

    @Query("SELECT DISTINCT i.batch FROM Internship i ORDER BY i.batch DESC")
    List<String> findAllBatches();
    
}
