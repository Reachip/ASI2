package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
		"fr.cpe.scoobygang.atelier3.api_orchestrator_microservice",
		"fr.cpe.scoobygang.common.*",
})
@EnableJpaRepositories(basePackages = "fr.cpe.scoobygang.common.repository")
@EntityScan("fr.cpe.scoobygang.common.activemq.model")
public class ApiOrchestratorMicroserviceApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiOrchestratorMicroserviceApplication.class, args);
	}
}

