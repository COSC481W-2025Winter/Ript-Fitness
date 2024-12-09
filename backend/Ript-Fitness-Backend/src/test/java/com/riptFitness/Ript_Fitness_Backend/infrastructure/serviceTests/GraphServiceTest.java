package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.GraphMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Graph;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.GraphRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.GraphService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.GraphDto;

public class GraphServiceTest {

	@Mock
	private GraphRepository graphRepository;
	
	@Mock
	private AccountsService accountsService;
	
	@Mock
	private AccountsRepository accountsRepository;
	
	@InjectMocks
	private GraphService graphService;
	
	private GraphDto graphDto;
	private GraphDto graphDtoNullFields;
	private AccountsModel account;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		
		graphDto = new GraphDto();
		graphDto.id = 1L;
		graphDto.xAxisName = "Dates";
		graphDto.yAxisName = "Body Weight";
		graphDto.title = "Body Weight Graph";
		graphDto.xAxis = new ArrayList<>(List.of(LocalDateTime.of(2024, 12, 4, 11, 30)));
		graphDto.yAxis = new ArrayList<>(List.of(190.1));	
		
		graphDtoNullFields = new GraphDto();
		
		account = new AccountsModel();
		account.setId(1L);
	}
	
	@Test
	void testAddNewGraphValid() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
		when(graphRepository.save(any(Graph.class))).thenReturn(GraphMapper.INSTANCE.toGraph(graphDto));
		
		GraphDto result = graphService.addNewGraph(graphDto);
		
		assertNotNull(result);
		assertEquals(result.id, 1L);
		assertEquals(result.xAxisName, "Dates");
		assertEquals(result.yAxisName, "Body Weight");
		assertEquals(result.title, "Body Weight Graph");
		assertEquals(result.yAxis.get(0), 190.1);
	}
	
	@Test 
	void testAddNewGraphInvalidNullXAxisName() {
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.addNewGraph(graphDtoNullFields);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The graphDto object passed into the addNewGraph endpoint should not have a null xAxisName, null yAxisName, or a null title variable. Please check that these three variables are included and try again.");
	}
	
	@Test 
	void testAddNewGraphInvalidNullYAxisName() {
		graphDtoNullFields.xAxisName = "Dates";
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.addNewGraph(graphDtoNullFields);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The graphDto object passed into the addNewGraph endpoint should not have a null xAxisName, null yAxisName, or a null title variable. Please check that these three variables are included and try again.");
	}
	
	@Test 
	void testAddNewGraphInvalidNullTitle() {
		graphDtoNullFields.xAxisName = "Dates";
		graphDtoNullFields.yAxisName = "Body Weight";
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.addNewGraph(graphDtoNullFields);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The graphDto object passed into the addNewGraph endpoint should not have a null xAxisName, null yAxisName, or a null title variable. Please check that these three variables are included and try again.");
	}
	
	@Test
	void testGetGraphsOfCurrentlyLoggedInUserValid() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.getGraphsFromCurrentlyLoggedInUser(1L)).thenReturn(Optional.of(new ArrayList<>(List.of(GraphMapper.INSTANCE.toGraph(graphDto)))));
		
		ArrayList<GraphDto> result = graphService.getGraphsOfCurrentlyLoggedInUser();
		
		assertNotNull(result);
		assertEquals(result.get(0).id, 1L);
		assertEquals(result.get(0).xAxisName, "Dates");
		assertEquals(result.get(0).yAxisName, "Body Weight");
		assertEquals(result.get(0).title, "Body Weight Graph");
		assertEquals(result.get(0).yAxis.get(0), 190.1);
	}

	@Test
	void testGetGraphsOfCurrentlyLoggedInUserValidUserHasNoGraphsInAccount() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.getGraphsFromCurrentlyLoggedInUser(1L)).thenReturn(Optional.empty());
		
		ArrayList<GraphDto> result = graphService.getGraphsOfCurrentlyLoggedInUser();

		assertNotNull(result);
		assertEquals(result.size(), 0);
	}
	
	@Test
	void testAddValudValid() {
		graphDto.xAxis.add(LocalDateTime.now());
		graphDto.yAxis.add(190.0);
		
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.of(GraphMapper.INSTANCE.toGraph(graphDto)));
		when(graphRepository.save(any(Graph.class))).thenReturn(GraphMapper.INSTANCE.toGraph(graphDto));

		GraphDto result = graphService.addValue(190.0, "Body Weight Graph");
		
		assertNotNull(result);
		assertEquals(result.id, 1L);
		assertEquals(result.xAxisName, "Dates");
		assertEquals(result.yAxisName, "Body Weight");
		assertEquals(result.title, "Body Weight Graph");
		assertEquals(result.yAxis.get(0), 190.1);
		assertEquals(result.yAxis.get(1), 190.0);
	}
	
	@Test
	void testAddValueInvalidUserHasNoGraphsInAccountWithSpecifiedTitle() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.empty());
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.addValue(190.0, "Body Weight Graph");
		});
		
		assertEquals(exceptionThrown.getMessage(), "A graph with title = Body Weight Graph does not exist in the Graph database table under the currently logged in user's account. Please check the graph title and try again.");
	}
	
	@Test
	void testDeleteValueValid() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.of(GraphMapper.INSTANCE.toGraph(graphDto)));
		when(graphRepository.save(any(Graph.class))).thenReturn(GraphMapper.INSTANCE.toGraph(graphDto));

		GraphDto result = graphService.deleteValue(0, "Body Weight Graph");
		
		assertNotNull(result);
		assertEquals(result.id, 1L);
		assertEquals(result.xAxisName, "Dates");
		assertEquals(result.yAxisName, "Body Weight");
		assertEquals(result.title, "Body Weight Graph");
	}
	
	@Test
	void testDeleteValueInvalidUserHasNoGraphsInAccountWithSpecifiedTitle() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.empty());

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.deleteValue(0, "Body Weight Graph");
		});
		
		assertEquals(exceptionThrown.getMessage(), "A graph with title = Body Weight Graph does not exist in the Graph database table under the currently logged in user's account. Please check the graph title and try again.");
	}
	
	@Test
	void testDeleteValueInvalidIndexIsLessThanZero() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.of(GraphMapper.INSTANCE.toGraph(graphDto)));

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.deleteValue(-1, "Body Weight Graph");
		});
		
		assertEquals(exceptionThrown.getMessage(), "The index provided in the path variable, -1, is not a valid index. It is either less than 0 or greater than or equal to the size of the Lists of axis'. Size of each axis = 1.");
	}
	
	@Test
	void testDeleteValueInvalidIndexIsGreaterThanSizeOfAxisLists() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.findByTitle("Body Weight Graph", 1L)).thenReturn(Optional.of(GraphMapper.INSTANCE.toGraph(graphDto)));

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.deleteValue(5, "Body Weight Graph");
		});
		
		assertEquals(exceptionThrown.getMessage(), "The index provided in the path variable, 5, is not a valid index. It is either less than 0 or greater than or equal to the size of the Lists of axis'. Size of each axis = 1.");
	}
	
	@Test
	void testDeleteGraphValid() {
		Graph graphModel = GraphMapper.INSTANCE.toGraph(graphDto);
		graphModel.account = account;
		graphDto.isDeleted = true;
		
		when(graphRepository.findById(1L)).thenReturn(Optional.of(graphModel));
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(graphRepository.save(any(Graph.class))).thenReturn(GraphMapper.INSTANCE.toGraph(graphDto));
		
		GraphDto result = graphService.deleteGraph(1L);
		
		assertNotNull(result);
		assertEquals(result.isDeleted, true);
	}
	
	@Test
	void testDeleteGraphInvalidGraphWithIdOfParameterDoesNotExistInDatabase() {
		when(graphRepository.findById(1L)).thenReturn(Optional.empty());
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.deleteGraph(1L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "There is no row in the Graph database table with ID = 1.");
	}
	
	@Test
	void testDeleteGraphInvalidGraphToBeDeletedDoesNotBelongToCurrentlyLoggedInUser() {
		Graph graphModel = GraphMapper.INSTANCE.toGraph(graphDto);
		graphModel.account = account;
		
		when(graphRepository.findById(1L)).thenReturn(Optional.of(graphModel));
		when(accountsService.getLoggedInUserId()).thenReturn(2L);

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			graphService.deleteGraph(1L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The Graph with ID = 1 does not belong to the currently logged in user. Please check the ID of the graph and try again.");
	}
}


















