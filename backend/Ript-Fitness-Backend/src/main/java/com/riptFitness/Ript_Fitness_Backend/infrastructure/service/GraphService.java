package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.GraphMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Graph;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.GraphRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.GraphDto;

@Service
public class GraphService {

	private GraphRepository graphRepository;
	
	private AccountsService accountsService;
	
	private AccountsRepository accountsRepository;
	
	public GraphService(GraphRepository graphRepository, AccountsService accountsService, AccountsRepository accountsRepository) {
		this.graphRepository = graphRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
	}
	
	public GraphDto addNewGraph(GraphDto graphDto) {
		if(graphDto.xAxisName == null || graphDto.yAxisName == null || graphDto.title == null)
			throw new RuntimeException("The graphDto object passed into the addNewGraph endpoint should not have a null xAxisName, null yAxisName, or a null title variable. Please check that these three variables are included and try again.");
		
		Graph graphToBeAdded = GraphMapper.INSTANCE.toGraph(graphDto);
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		graphToBeAdded.account = accountsRepository.findById(currentlyLoggedInUserId).get();
		graphToBeAdded = graphRepository.save(graphToBeAdded);
		return GraphMapper.INSTANCE.toGraphDto(graphToBeAdded);
	}
	
	public ArrayList<GraphDto> getGraphsOfCurrentlyLoggedInUser(){
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		Optional<ArrayList<Graph>> optionalGraphsOfCurrentlyLoggedInUser = graphRepository.getGraphsFromCurrentlyLoggedInUser(currentlyLoggedInUserId);
		
		if(optionalGraphsOfCurrentlyLoggedInUser.isEmpty())
			return new ArrayList<GraphDto>();
		
		ArrayList<Graph> graphsOfCurrentlyLoggedInUser = optionalGraphsOfCurrentlyLoggedInUser.get();
		
		ArrayList<GraphDto> returnedListOfGraphDtos = new ArrayList<>();
		
		for(Graph graph : graphsOfCurrentlyLoggedInUser) {
			returnedListOfGraphDtos.add(GraphMapper.INSTANCE.toGraphDto(graph));
		}
		
		return returnedListOfGraphDtos;
	}
	
	public GraphDto addValue(Double value, String graphTitle) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		
		Optional<Graph> optionalGraphToBeEdited = graphRepository.findByTitle(graphTitle, currentlyLoggedInUserId);
		
		if(optionalGraphToBeEdited.isEmpty())
			throw new RuntimeException("A graph with title = " + graphTitle + " does not exist in the Graph database table under the currently logged in user's account. Please check the graph title and try again.");
		
		Graph graphToBeEdited = optionalGraphToBeEdited.get();
		
		graphToBeEdited.xAxis.add(LocalDateTime.now());
		graphToBeEdited.yAxis.add(value);
		
		graphToBeEdited = graphRepository.save(graphToBeEdited);
		
		return GraphMapper.INSTANCE.toGraphDto(graphToBeEdited);
	}
	
	public GraphDto deleteValue(int index, String graphTitle) {		
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		
		Optional<Graph> optionalGraphToBeEdited = graphRepository.findByTitle(graphTitle, currentlyLoggedInUserId);
		
		if(optionalGraphToBeEdited.isEmpty())
			throw new RuntimeException("A graph with title = " + graphTitle + " does not exist in the Graph database table under the currently logged in user's account. Please check the graph title and try again.");
		
		Graph graphToBeEdited = optionalGraphToBeEdited.get();
		
		if(index < 0 || index >= graphToBeEdited.xAxis.size())
			throw new RuntimeException("The index provided in the path variable, " + index + ", is not a valid index. It is either less than 0 or greater than or equal to the size of the Lists of axis'. Size of each axis = " + graphToBeEdited.xAxis.size());
		
		graphToBeEdited.xAxis.remove(index);
		graphToBeEdited.yAxis.remove(index);
		
		graphToBeEdited = graphRepository.save(graphToBeEdited);
		
		return GraphMapper.INSTANCE.toGraphDto(graphToBeEdited);
	}
	
	public GraphDto deleteGraph(Long graphId) {
		Graph graphToBeDeleted = graphRepository.findById(graphId).orElseThrow(() -> new RuntimeException("There is no row in the Graph database table with ID = " + graphId));
		
		if(graphToBeDeleted.account.getId() != accountsService.getLoggedInUserId())
			throw new RuntimeException("The Graph with ID = " + graphId + " does not belong to the currently logged in user. Please check the ID of the graph and try again.");
		
		graphToBeDeleted.isDeleted = true;
		
		graphToBeDeleted = graphRepository.save(graphToBeDeleted);
		
		return GraphMapper.INSTANCE.toGraphDto(graphToBeDeleted);
	}
}
