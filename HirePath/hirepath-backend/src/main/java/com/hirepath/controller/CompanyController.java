package com.hirepath.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.model.Company;
import com.hirepath.repository.CompanyRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class CompanyController {

	private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // ✅ GET ALL COMPANIES
    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @GetMapping("/companies/{id}")
    public Company getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id).orElseThrow();
    }

    // ✅ ADD COMPANY (Admin)
    @PostMapping("/admin/company")
    public Company addCompany(@RequestBody Company company) {
        return companyRepository.save(company);
    }

    // ✅ UPDATE COMPANY
    @PutMapping("/admin/company/{id}")
    public Company updateCompany(@PathVariable Long id, @RequestBody Company updated) {
        Company company = companyRepository.findById(id).orElseThrow();

        company.setName(updated.getName());
        company.setIndustry(updated.getIndustry());
        company.setMinCgpa(updated.getMinCgpa());
        company.setBranches(updated.getBranches());
        company.setRoles(updated.getRoles());
        company.setPackageLpa(updated.getPackageLpa());
        company.setCompanyProfileLink(updated.getCompanyProfileLink());
        company.setFormLink(updated.getFormLink());

        return companyRepository.save(company);
    }

    // ✅ DELETE COMPANY
    @DeleteMapping("/admin/company/{id}")
    public void deleteCompany(@PathVariable Long id) {
        companyRepository.deleteById(id);
    }
    
    
	
}
