package com.infosys.repository;

import com.infosys.model.SimpleUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimpleUserRepository extends JpaRepository<SimpleUser, Long> {
}