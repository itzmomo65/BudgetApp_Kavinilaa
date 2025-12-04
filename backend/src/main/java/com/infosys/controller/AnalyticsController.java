package com.infosys.controller;

import com.infosys.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics", description = "Financial analytics and visualization endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/monthly-spending")
    @Operation(summary = "Get monthly spending comparison data")
    public ResponseEntity<Map<String, Object>> getMonthlySpending(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(analyticsService.getMonthlySpendingData(email));
    }

    @GetMapping("/category-breakdown")
    @Operation(summary = "Get category-wise spending breakdown")
    public ResponseEntity<Map<String, Object>> getCategoryBreakdown(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(analyticsService.getCategoryBreakdownData(email));
    }

    @GetMapping("/income-vs-expenses")
    @Operation(summary = "Get income vs expenses comparison")
    public ResponseEntity<Map<String, Object>> getIncomeVsExpenses(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(analyticsService.getIncomeVsExpensesData(email));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get financial summary statistics")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(analyticsService.getSummaryData(email));
    }
}