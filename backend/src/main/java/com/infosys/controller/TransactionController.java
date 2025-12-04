package com.infosys.controller;

import com.infosys.dto.TransactionRequest;
import com.infosys.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Transactions", description = "Income and expense transaction management")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Add transaction", description = "Add new income or expense transaction")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> addTransaction(
            @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7); // Remove "Bearer " prefix
            String message = transactionService.addTransaction(request, jwt);
            return ResponseEntity.ok().body(new TransactionResponse(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionResponse(e.getMessage()));
        }
    }

    @GetMapping("/incomes")
    @Operation(summary = "Get incomes", description = "Retrieve all user income transactions")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getIncomes(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            return ResponseEntity.ok(transactionService.getIncomes(jwt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionResponse(e.getMessage()));
        }
    }

    @GetMapping("/expenses")
    @Operation(summary = "Get expenses", description = "Retrieve all user expense transactions")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getExpenses(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            return ResponseEntity.ok(transactionService.getExpenses(jwt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionResponse(e.getMessage()));
        }
    }

    @PutMapping("/{type}/{id}")
    @Operation(summary = "Update transaction", description = "Update existing income or expense transaction")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> updateTransaction(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String message = transactionService.updateTransaction(type, id, request, jwt);
            return ResponseEntity.ok().body(new TransactionResponse(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{type}/{id}")
    @Operation(summary = "Delete transaction", description = "Delete income or expense transaction")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String message = transactionService.deleteTransaction(type, id, jwt);
            return ResponseEntity.ok().body(new TransactionResponse(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TransactionResponse(e.getMessage()));
        }
    }
    
    static class TransactionResponse {
        private String message;
        
        public TransactionResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
    }
}