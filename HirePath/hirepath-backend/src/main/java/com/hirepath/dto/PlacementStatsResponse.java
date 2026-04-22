package com.hirepath.dto;

public class PlacementStatsResponse {

    private String batch;
    private long totalStudents;
    private long placed;
    private long unplaced;
    private double placementRate;
    private double highestPackage;
    private String highestCompany; // ✅ NEW
    private String topCompany;

    public PlacementStatsResponse(String batch2, long totalStudents, long placed, long unplaced,
                                  double placementRate, double highestPackage, String highestCompany, String topCompany) {
        this.batch = batch2;
        this.totalStudents = totalStudents;
        this.placed = placed;
        this.unplaced = unplaced;
        this.placementRate = placementRate;
        this.highestPackage = highestPackage;
        this.highestCompany = highestCompany; // ✅ NEW
        this.topCompany = topCompany;
    }

    // Getters
    public String getBatch() { return batch; }
    public long getTotalStudents() { return totalStudents; }
    public long getPlaced() { return placed; }
    public long getUnplaced() { return unplaced; }
    public double getPlacementRate() { return placementRate; }
    public double getHighestPackage() { return highestPackage; }
    public String getHighestCompany() { return highestCompany; } // ✅ NEW
    public String getTopCompany() { return topCompany; }
}
