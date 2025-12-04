package com.infosys.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incomes")
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "amount", nullable = false)
    private Double amount;
    
    @Column(name = "description", nullable = false)
    private String description;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "transaction_date")
    private String transactionDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Income() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getTransactionDate() { return transactionDate; }
    public void setTransactionDate(String transactionDate) { this.transactionDate = transactionDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}