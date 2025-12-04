package com.infosys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.infosys.model")
@EnableJpaRepositories("com.infosys.repository")
public class InfosysApplication {
    public static void main(String[] args) {
        SpringApplication.run(InfosysApplication.class, args);
        System.out.println("Backend is running");
    }
}