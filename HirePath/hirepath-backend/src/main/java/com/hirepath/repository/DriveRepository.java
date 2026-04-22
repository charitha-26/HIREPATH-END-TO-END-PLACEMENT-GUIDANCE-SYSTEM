package com.hirepath.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.Drive;

public interface DriveRepository extends JpaRepository<Drive, Long> {

}
