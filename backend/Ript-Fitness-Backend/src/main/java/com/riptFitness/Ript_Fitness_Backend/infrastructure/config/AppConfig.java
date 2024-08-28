package com.riptFitness.Ript_Fitness_Backend.infrastructure.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class AppConfig {
	
	private final Dotenv dotenv = Dotenv.load();
	
	@Bean
	public DriverManagerDataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
		dataSource.setUrl(dotenv.get("SPRING_DATASOURCE_URL"));
		dataSource.setUsername(dotenv.get("SPRING_DATASOURCE_USERNAME"));
		dataSource.setPassword(dotenv.get("SPRING_DATASOURCE_PASSWORD"));
		return dataSource;
	}
}
