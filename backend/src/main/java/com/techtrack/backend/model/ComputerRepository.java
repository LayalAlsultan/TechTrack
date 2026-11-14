package com.techtrack.backend.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ComputerRepository extends
        CrudRepository<Computer, Long>,
        PagingAndSortingRepository<Computer, Long> {
}