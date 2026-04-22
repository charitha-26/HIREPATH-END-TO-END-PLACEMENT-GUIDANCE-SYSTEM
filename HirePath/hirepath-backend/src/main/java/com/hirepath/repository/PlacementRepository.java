package com.hirepath.repository;

import com.hirepath.model.Placement;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface PlacementRepository extends JpaRepository<Placement, Long>{

    List<Placement> findByBatch(String batch);

    long countByBatch(String batch);

    long countByBatchAndStatus(String batch, String status);

    List<Placement> findByBatchAndStatus(String batch, String status);

    @Query("SELECT DISTINCT p.batch FROM Placement p ORDER BY p.batch DESC")
List<String> findAllBatches();

    Optional<Placement> findByRollNumber(String rollNumber);
    
    @Query("SELECT p FROM Placement p WHERE TRIM(p.batch) = TRIM(:batch) AND LOWER(p.company) LIKE LOWER(CONCAT('%', :company, '%'))")
    List<Placement> findByCompanyAndBatch(String company, String batch);
}
