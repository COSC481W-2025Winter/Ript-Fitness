package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.TestService;

@RestController
@RequestMapping("/")
public class TestController {
	
	TestService testService;
	
	public TestController(TestService testService) {
		this.testService = testService;
	}

	@GetMapping("/test")
	public ResponseEntity<String> testEndpoint(){
		String returnedString = testService.testEndpointService();
		return new ResponseEntity<>(returnedString, HttpStatus.OK);
	}
}
