package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.TestMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.TestModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.TestRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.TestDto;

@Service
public class TestService {
	
	public TestRepository testRepository;
	
	public TestService(TestRepository testRepository) {
		this.testRepository = testRepository;
	}

	public String testEndpointService() {
		return "The call to the endpoint was successful!";
	}
	
	// Below is for adding a object into the database(POST):
	public TestDto addTestDto(TestDto testDto) {
		TestModel testModel = TestMapper.INSTANCE.toTestModel(testDto);
		TestModel testObj = testRepository.save(testModel);
		return TestMapper.INSTANCE.toTestDto(testObj);
	}
	
	// Below is for getting a object from the database(GET):
	public TestDto getTestDto(Long id) {
		TestModel testModel = testRepository.getReferenceById(id);
		return TestMapper.INSTANCE.toTestDto(testModel);
	}
	
	// Below is for editing the first/last name of an object:
	public TestDto editFirstLast(TestDto testDto) {
		// Get the object via id:
		TestModel testModel = testRepository.getReferenceById(testDto.id);
		// Update (edit) the first and last name:
		testModel.setFirstName(testDto.getFirstName());
		testModel.setLastName(testDto.getLastName());
		// Save the edited object:
		TestModel editedObj = testRepository.save(testModel);
		// Return updated object as a DTO:
		return TestMapper.INSTANCE.toTestDto(editedObj);
	}
	
	// Below is a method for hard deletion of an object in the database:
	public TestDto deleteTestObjectById(Long id) {
		// Check if the object was deleted via id:
		boolean exists = testRepository.existsById(id);
		TestModel objectToBeDeleted = testRepository.getReferenceById(id);
		// If the object exists, delete it:
		if(exists) {
			testRepository.deleteById(id);
		}
		return TestMapper.INSTANCE.toTestDto(objectToBeDeleted);
	}
	
}



























