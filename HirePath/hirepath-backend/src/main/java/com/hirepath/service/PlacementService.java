package com.hirepath.service;



import org.springframework.stereotype.Service;

import com.hirepath.dto.PlacementStatsResponse;
import com.hirepath.model.Placement;
import com.hirepath.repository.PlacementRepository;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Service
public class PlacementService {

        private final PlacementRepository repository;

    public PlacementService(PlacementRepository repository) {
        this.repository = repository;
    }

    public PlacementStatsResponse getBatchStats(String batch) {

        List<Placement> placements = repository.findByBatch(batch);

        long total = placements.size();
        long placed = placements.stream()
                .filter(p -> p.getStatus().equalsIgnoreCase("placed"))
                .count();

        long unplaced = total - placed;

        double placementRate = total == 0 ? 0 : (placed * 100.0) / total;

        double highestPackage = 0.0;
Set<String> highestCompanies = new HashSet<>();

for (Placement p : placements) {

    if (p.getStatus().equalsIgnoreCase("placed")) {

        double pkg = p.getPackageAmount();

        // New highest found
        if (pkg > highestPackage) {
            highestPackage = pkg;
            highestCompanies.clear();

            String cleaned = p.getCompany()
                    .replaceAll("\\(.*?\\)", "")
                    .replaceAll("\\s+", "");

            String[] companies = cleaned.split(",");

            for (String c : companies) {
                if (!c.isEmpty()) {
                    highestCompanies.add(c);
                }
            }
        }

        // Same highest → add companies
        else if (pkg == highestPackage) {
            String cleaned = p.getCompany()
                    .replaceAll("\\(.*?\\)", "")
                    .replaceAll("\\s+", "");

            String[] companies = cleaned.split(",");

            for (String c : companies) {
                if (!c.isEmpty()) {
                    highestCompanies.add(c);
                }
            }
        }
    }
}

// convert to string
String highestCompany = highestCompanies.isEmpty()
        ? "N/A"
        : String.join(", ", highestCompanies);

        Map<String, Long> companyCount = new HashMap<>();

for (Placement p : placements) {
    if (p.getCompany() != null && p.getStatus().equalsIgnoreCase("placed")) {
        String[] companies = p.getCompany().split(",");

        for (String c : companies) {
            String company = c.trim();
            companyCount.put(company, companyCount.getOrDefault(company, 0L) + 1);
        }
    }
}

String topCompany = companyCount.entrySet()
    .stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElse("N/A");

        return new PlacementStatsResponse(
                batch,
        total,
        placed,
        unplaced,
        placementRate,
        highestPackage,
        highestCompany, // ✅ NEW
        topCompany
        );
    }

    public Map<String, Long> getCompanyStats(String batch) {
    List<Placement> placements = repository.findByBatchAndStatus(batch, "placed");

    Map<String, Long> companyCount = new HashMap<>();

    for (Placement p : placements) {
        if (p.getCompany() != null) {

            // Normalize string
            String cleaned = p.getCompany()
                    .replaceAll("\\(.*?\\)", "") // remove (HWI)
                    .replaceAll("\\s+", "");     // remove all spaces

            String[] companies = cleaned.split(",");

            for (String c : companies) {
                if (!c.isEmpty()) {
                    companyCount.put(
                        c,
                        companyCount.getOrDefault(c, 0L) + 1
                    );
                }
            }
        }
    }

    return companyCount;
}

                public List<String> getAllBatches() {
    return repository.findAllBatches();
}

}
