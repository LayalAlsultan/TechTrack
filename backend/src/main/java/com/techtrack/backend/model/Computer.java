package com.techtrack.backend.model;

import org.springframework.data.annotation.Id;

public record Computer(
    @Id Long id,
    String assetTag,
    String name,
    String category,
    String assignedTo,
    String status
) {}