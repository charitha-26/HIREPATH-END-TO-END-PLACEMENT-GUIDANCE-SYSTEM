package com.hirepath.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hirepath.dto.PlacementStatsResponse;
import com.hirepath.model.Placement;
import com.hirepath.service.PlacementService;
import com.hirepath.repository.PlacementRepository;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:5173", "http://127.0.0.1:5173"})
public class PlacementController {

    private final PlacementService service;
    private final PlacementRepository placementRepository;  

    public PlacementController(PlacementService service, PlacementRepository placementRepository) {
        this.service = service;
        this.placementRepository = placementRepository;
    }

    // 📊 Batch Stats
    @GetMapping("/{batch}")
    public PlacementStatsResponse getBatchStats(@PathVariable String batch) {
        return service.getBatchStats(batch);
    }

    // 🏢 Company Stats
    @GetMapping("/{batch}/companies")
    public Map<String, Long> getCompanyStats(@PathVariable String batch) {
        return service.getCompanyStats(batch);
    }

    @GetMapping("/batches")
    public List<String> getAllBatches() {
        return service.getAllBatches();
    }

    @GetMapping("/{batch}/company/{company}")
public List<Placement> getByBatchAndCompany(
        @PathVariable String batch,
        @PathVariable String company) {

    return placementRepository.findByCompanyAndBatch(company, batch);
}

}
