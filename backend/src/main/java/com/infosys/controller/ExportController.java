package com.infosys.controller;

import com.infosys.service.ExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/export")
@Tag(name = "Export", description = "Data export endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @GetMapping("/pdf")
    @Operation(summary = "Export financial data to PDF")
    public ResponseEntity<byte[]> exportToPDF(Authentication auth) {
        String email = auth.getName();
        byte[] pdfData = exportService.exportToPDF(email);
        
        String filename = "financial_report_" + 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }

    @GetMapping("/csv")
    @Operation(summary = "Export financial data to CSV")
    public ResponseEntity<String> exportToCSV(Authentication auth) {
        String email = auth.getName();
        String csvData = exportService.exportToCSV(email);
        
        String filename = "financial_data_" + 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}