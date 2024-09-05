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
}














