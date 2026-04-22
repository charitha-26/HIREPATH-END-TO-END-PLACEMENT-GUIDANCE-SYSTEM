package com.hirepath.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hirepath.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Long>{

}
