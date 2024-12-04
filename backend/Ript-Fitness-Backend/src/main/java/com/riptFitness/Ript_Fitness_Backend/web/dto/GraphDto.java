package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GraphDto {

	public Long id;
	public String xAxisName;
	public String yAxisName;
	public String title;
	public List<LocalDateTime> xAxis;
	public List<Double> yAxis;
}
