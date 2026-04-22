package com.hirepath.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

	List<Application> findByStudent_Id(Long studentId);
	List<Application> findByStudent_IdAndStatusIgnoreCase(Long studentId, String status);
    List<Application> findByCompanyNameIgnoreCase(String companyName);
    List<Application> findByStatusIgnoreCase(String status);
    List<Application> findByCompanyNameIgnoreCaseAndStatusIgnoreCase(String companyName, String status);
    Optional<Application> findByStudent_IdAndDrive_Id(Long studentId, Long driveId);
	boolean existsByStudent_IdAndDrive_Id(Long studentId, Long driveId);
	
}
