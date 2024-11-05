package com.riptFitness.Ript_Fitness_Backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;

@ActiveProfiles("test")
@SpringBootTest
class RiptFitnessBackendApplicationTests {

	@MockBean
	private JwtUtil jwtUtil;

	@Test
	void contextLoads() {
	}

}
