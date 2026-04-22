package com.hirepath.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
	List<Experience> findByStatusIgnoreCase(String status);
    List<Experience> findByStudent_Id(Long studentId);
    java.util.Optional<Experience> findByIdAndStudent_Id(Long id, Long studentId);
}
