package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.GraphService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.GraphDto;

@RestController
@RequestMapping("/graph")
public class GraphController {

	private GraphService graphService;
	
	public GraphController(GraphService graphService) {
		this.graphService = graphService;
	}
	
	@PostMapping("/addNewGraph")
	public ResponseEntity<GraphDto> addNewGraph(@RequestBody GraphDto graphDto){
		GraphDto savedGraphDto = graphService.addNewGraph(graphDto);
		return new ResponseEntity<>(savedGraphDto, HttpStatus.CREATED);
	}
	
	@GetMapping("/getGraphsOfCurrentlyLoggedInUser")
	public ResponseEntity<ArrayList<GraphDto>> getGraphsOfCurrentlyLoggedInUser(){
		ArrayList<GraphDto> listOfGraphsOfCurrentlyLoggedInUser = graphService.getGraphsOfCurrentlyLoggedInUser();
		return new ResponseEntity<>(listOfGraphsOfCurrentlyLoggedInUser, HttpStatus.OK);
	}
	
	@PutMapping("/addValue/{value}")
	public ResponseEntity<GraphDto> addValue(@PathVariable Double value, @RequestBody String graphTitle){
		GraphDto editedGraphDto = graphService.addValue(value, graphTitle);
		return new ResponseEntity<>(editedGraphDto, HttpStatus.OK);
	}
	
	@PutMapping("/deleteValue/{index}")
	public ResponseEntity<GraphDto> deleteValue(@PathVariable int index, @RequestBody String graphTitle){
		GraphDto editedGraphDto = graphService.deleteValue(index, graphTitle);
		return new ResponseEntity<>(editedGraphDto, HttpStatus.OK);
	}
	
	@DeleteMapping("/deleteGraph/{graphId}")
	public ResponseEntity<GraphDto> deleteGraph(@PathVariable Long graphId){
		GraphDto deletedGraphDto = graphService.deleteGraph(graphId);
		return new ResponseEntity<>(deletedGraphDto, HttpStatus.OK);
	}
}
