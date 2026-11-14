package com.techtrack.backend.controller;

import java.net.URI;
import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.util.UriComponentsBuilder;

import com.techtrack.backend.model.Computer;
import com.techtrack.backend.model.ComputerRepository;



@RestController
@RequestMapping("/api/computers")
@CrossOrigin(origins = "http://localhost:5173")
public class ComputerController {

	
	private final ComputerRepository computerRepository;

	public ComputerController(ComputerRepository computerRepository) {
		this.computerRepository = computerRepository;
	}
	
	@GetMapping()
	public ResponseEntity<List<Computer>> getAllComputers(Pageable pageable) {
		Page<Computer> page = computerRepository.findAll(
				PageRequest.of(
						pageable.getPageNumber(),
						pageable.getPageSize(),
						pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))));
		return ResponseEntity.ok(page.getContent());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Computer> getComputerById(@PathVariable Long id) {
	    Optional<Computer> computer = computerRepository.findById(id);

	    if (computer.isPresent()) {
	        return ResponseEntity.ok(computer.get());
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	
	@PostMapping()
	public ResponseEntity<Void> createComputer(@RequestBody Computer computer,
	        UriComponentsBuilder ucb) {

	    if (computer.id() != null) {
	        return ResponseEntity.badRequest().build();
	    }

	    Computer createdComputer = computerRepository.save(computer);

	    URI uri = ucb.path("/api/computers/{id}")
	            .buildAndExpand(createdComputer.id())
	            .toUri();

	    return ResponseEntity.created(uri).build();
	}
	

	@PutMapping("/{id}")
	public ResponseEntity<Void> putComputer(@PathVariable Long id, @RequestBody Computer computerUpdate) {
		Optional<Computer> computer = computerRepository.findById(id);
		if (computer.isPresent()) {
			Computer updatedComputer = new Computer(computer.get().id(), computerUpdate.assetTag(),
					computerUpdate.name(), computerUpdate.category(), computerUpdate.assignedTo(),
					computerUpdate.status());
			computerRepository.save(updatedComputer);
		} else {
			return ResponseEntity.notFound().build(); //404
		}
		return ResponseEntity.noContent().build(); //204
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteComputer(@PathVariable Long id) {
		Optional<Computer> computer = computerRepository.findById(id);
		if (computer.isPresent()) {
			computerRepository.delete(computer.get());
		} else {
			return ResponseEntity.notFound().build(); //404
		}
		return ResponseEntity.noContent().build(); //204
	}
	
	
}
