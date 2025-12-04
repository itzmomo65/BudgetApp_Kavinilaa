package com.infosys.controller;

import com.infosys.model.Budget;
import com.infosys.model.Expense;
import com.infosys.model.Income;
import com.infosys.model.SavingsGoal;
import com.infosys.repository.BudgetRepository;
import com.infosys.repository.ExpenseRepository;
import com.infosys.repository.IncomeRepository;
import com.infosys.repository.SavingsGoalRepository;
import com.infosys.repository.UserRepository;
import com.infosys.config.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Budget Sync", description = "Sync budget with existing expenses")
public class BudgetSyncController {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private IncomeRepository incomeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SavingsGoalRepository savingsGoalRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/sync")
    @Operation(summary = "Sync budget with expenses", description = "Recalculate budget spending from existing expenses")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> syncBudgetWithExpenses(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractEmail(jwt);
            Long userId = userRepository.findByEmail(email).get().getId();
            
            // Reset all budget spent amounts
            List<Budget> budgets = budgetRepository.findByUserId(userId);
            for (Budget budget : budgets) {
                budget.setSpentAmount(BigDecimal.ZERO);
            }
            budgetRepository.saveAll(budgets);
            
            // Recalculate from expenses
            List<Expense> expenses = expenseRepository.findByUserId(userId);
            System.out.println("Found " + expenses.size() + " expenses for user " + userId);
            
            for (Expense expense : expenses) {
                try {
                    LocalDate expenseDate = expense.getTransactionDate() != null ? 
                        LocalDate.parse(expense.getTransactionDate()) : LocalDate.now();
                    int month = expenseDate.getMonthValue();
                    int year = expenseDate.getYear();
                    
                    System.out.println("Processing expense: Category=" + expense.getCategory() + 
                        ", Amount=" + expense.getAmount() + ", Date=" + expenseDate);
                    
                    budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, expense.getCategory(), month, year)
                        .ifPresentOrElse(budget -> {
                            budget.setSpentAmount(budget.getSpentAmount().add(BigDecimal.valueOf(expense.getAmount())));
                            budgetRepository.save(budget);
                            System.out.println("Updated budget for " + expense.getCategory() + ": " + budget.getSpentAmount());
                        }, () -> {
                            System.out.println("No budget found for category: " + expense.getCategory() + 
                                ", month: " + month + ", year: " + year);
                        });
                } catch (Exception e) {
                    System.out.println("Error processing expense: " + e.getMessage());
                }
            }
            
            // Reset and recalculate savings goals from income
            List<SavingsGoal> goals = savingsGoalRepository.findByUserId(userId);
            for (SavingsGoal goal : goals) {
                goal.setCurrentAmount(BigDecimal.ZERO);
            }
            savingsGoalRepository.saveAll(goals);
            
            // Recalculate from income transactions
            List<Income> incomes = incomeRepository.findByUserId(userId);
            System.out.println("Found " + incomes.size() + " incomes for user " + userId);
            
            for (Income income : incomes) {
                for (SavingsGoal goal : goals) {
                    if (goal.getGoalName().toLowerCase().contains(income.getDescription().toLowerCase()) || 
                        income.getDescription().toLowerCase().contains(goal.getGoalName().toLowerCase())) {
                        
                        goal.setCurrentAmount(goal.getCurrentAmount().add(BigDecimal.valueOf(income.getAmount())));
                        savingsGoalRepository.save(goal);
                        System.out.println("Updated savings goal '" + goal.getGoalName() + "' with income: " + income.getDescription());
                    }
                }
            }
            
            return ResponseEntity.ok(new MessageResponse("Budget synced successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}