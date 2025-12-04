package com.infosys.repository;

import com.infosys.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Income> findByUserId(Long userId);
}