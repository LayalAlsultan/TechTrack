
package com.techtrack.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

import com.techtrack.backend.model.Computer;
import com.techtrack.backend.model.ComputerRepository;

class ComputerControllerTest {

	private ComputerRepository repository;
	private ComputerController controller;
	private Computer computer;

	@BeforeEach
	void setUp() {
		repository = mock(ComputerRepository.class);
		controller = new ComputerController(repository);

		computer = new Computer(1L, "TT001", "Dell Laptop", "Laptop", "Areen", "Available");
	}

	@Test
	void testGetAllComputers() {
		Pageable pageable = PageRequest.of(0, 10);
		Pageable expectedPage = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id"));

		when(repository.findAll(expectedPage)).thenReturn(new PageImpl<>(List.of(computer)));

		ResponseEntity<List<Computer>> response = controller.getAllComputers(pageable);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(1, response.getBody().size());
		assertEquals(computer, response.getBody().get(0));

		verify(repository).findAll(expectedPage);
	}

	@Test
	void testGetComputerByIdFound() {
		when(repository.findById(1L)).thenReturn(Optional.of(computer));

		ResponseEntity<Computer> response = controller.getComputerById(1L);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(computer, response.getBody());
	}

	@Test
	void testGetComputerByIdNotFound() {
		when(repository.findById(99L)).thenReturn(Optional.empty());

		ResponseEntity<Computer> response = controller.getComputerById(99L);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
	}

	@Test
	void testCreateComputerSuccess() {
		Computer newComputer = new Computer(null, "TT002", "HP Laptop", "Laptop", "Layal", "Available");

		when(repository.save(newComputer))
				.thenReturn(new Computer(2L, "TT002", "HP Laptop", "Laptop", "Layal", "Available"));

		ResponseEntity<Void> response = controller.createComputer(newComputer, UriComponentsBuilder.newInstance());

		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals("/api/computers/2", response.getHeaders().getLocation().toString());

		verify(repository).save(newComputer);
	}

	@Test
	void testCreateComputerInvalidId() {
		ResponseEntity<Void> response = controller.createComputer(computer, UriComponentsBuilder.newInstance());

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

		verify(repository, never()).save(any(Computer.class));
	}

	@Test
	void testUpdateComputerSuccess() {
		Computer update = new Computer(null, "TT001", "Updated Laptop", "Laptop", "Areen", "In Use");

		when(repository.findById(1L)).thenReturn(Optional.of(computer));

		ResponseEntity<Void> response = controller.putComputer(1L, update);

		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

		Computer expected = new Computer(1L, "TT001", "Updated Laptop", "Laptop", "Areen", "In Use");

		verify(repository).save(expected);
	}

	@Test
	void testUpdateComputerNotFound() {
		when(repository.findById(99L)).thenReturn(Optional.empty());

		ResponseEntity<Void> response = controller.putComputer(99L, computer);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

		verify(repository, never()).save(any(Computer.class));
	}

	@Test
	void testDeleteComputerSuccess() {
		when(repository.findById(1L)).thenReturn(Optional.of(computer));

		ResponseEntity<Void> response = controller.deleteComputer(1L);

		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

		verify(repository).delete(computer);
	}

	@Test
	void testDeleteComputerNotFound() {
		when(repository.findById(99L)).thenReturn(Optional.empty());

		ResponseEntity<Void> response = controller.deleteComputer(99L);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

		verify(repository, never()).delete(any(Computer.class));
	}
}

