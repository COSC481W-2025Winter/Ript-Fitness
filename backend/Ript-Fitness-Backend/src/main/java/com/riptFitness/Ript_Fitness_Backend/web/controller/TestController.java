package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.TestService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.TestDto;

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
	
	// Below is a POST test for adding something to a database
	@PostMapping("/addTestObject")
	public ResponseEntity<TestDto> addObjectTest(@RequestBody TestDto testDto) {
		TestDto savedTestDto = testService.addTestDto(testDto);
		return new ResponseEntity<>(savedTestDto, HttpStatus.CREATED);
	}
}


//Java Spring Boot annotation relevant to the backend:
//Controller annotations:
//@RestController - Put this at the top of your Controller class above the "public class ___" line
//
//@RequestMapping("some String") - Put underneath "@RestController" in the Controller class
//
//@PostMapping("some String") - Put above any HTTP POST method (adding something to the database)
//
//@PutMapping("some String") - Put above any HTTP PUT method (editing something)
//
//@GetMapping("some String") - Put above any HTTP GET method (get something)
//
//@DeleteMapping("some String") - Put above any HTTP DELETE method (delete something)
//
//@RequestBody - Put in parameter list of an HTTP endpoint when the body of the HTTP request contains an object relevant to the request
//
//@PathVariable - Put in paramter list of an HTTP endpoint when the URL of the HTTP requests should contain a variable relevant to the reqest



//
//Service annotations:
//@Service - Put this above "public class ___"  line
//
//Repository annotations (only Tina cares about this):
//@Query("insert query here") - Defines a SQL query to be made to the database
//
//@Param("some variable") - Defines a parameter set by the call to the specific query method 
//
//Model annotations:
//@Entity - Put above "public class ___" line, this tells Spring Boot to create a database table with that name with columns equal to the variables in that object class
//
//@Id - Tells Spring Boot that this variable is a primary key in the database
//
//@GeneratedValue(strategy = GenerationType.IDENTITY) - Put this underneath "@Id"








