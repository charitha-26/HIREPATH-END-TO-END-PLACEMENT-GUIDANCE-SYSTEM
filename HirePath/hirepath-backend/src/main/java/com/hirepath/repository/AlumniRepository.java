package com.hirepath.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.Alumni;

public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    List<Alumni> findByNameContainingIgnoreCase(String name);
    List<Alumni> findByCompanyNameContainingIgnoreCase(String companyName);
}
