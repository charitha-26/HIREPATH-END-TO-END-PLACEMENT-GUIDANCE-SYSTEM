package com.hirepath.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hirepath.dto.InternshipStudentResponse;
import com.hirepath.model.Internship;
import com.hirepath.model.Placement;
import com.hirepath.repository.InternshipRepository;
import com.hirepath.repository.PlacementRepository;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final PlacementRepository placementRepository;

    public InternshipService(InternshipRepository internshipRepository,
                             PlacementRepository placementRepository) {
        this.internshipRepository = internshipRepository;
        this.placementRepository = placementRepository;
    }

    public List<String> getAllBatches() {
        return internshipRepository.findAllBatches();
    }

    public List<InternshipStudentResponse> getInternshipStudents(String batch) {

        List<Internship> internships = internshipRepository.findByBatch(batch);

        List<InternshipStudentResponse> response = new ArrayList<>();

        for (Internship i : internships) {

            Optional<Placement> placementOpt =
                    placementRepository.findByRollNumber(i.getRollNumber());

            String fteStatus = "Not Placed";
            String fteCompany = null;
            Double ftePackage = null;

            if (placementOpt.isPresent()) {
                Placement p = placementOpt.get();

                if (p.getStatus().equalsIgnoreCase("placed")) {
                    fteStatus = "Placed";
                    fteCompany = p.getCompany();
                    ftePackage = p.getPackageAmount();
                }
            }

            response.add(new InternshipStudentResponse(
                    i.getStudentName(),
                    i.getRollNumber(),
                    i.getCompany(),
                    i.getStipend(),
                    fteStatus,
                    fteCompany,
                    ftePackage,
                    i.getInternshipStatus(),
                    i.getStartDate(),
                    i.getEndDate()
            ));
        }

        return response;
    }

}
