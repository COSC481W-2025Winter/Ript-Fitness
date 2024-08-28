package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class TestController {

	@GetMapping("/test")
	public ResponseEntity<String> testEndpoint(){
		return new ResponseEntity<>("The call to the endpoint was successful!", HttpStatus.OK);
	}
}
