package fr.cpe.scoobygang.atelier3.api_activemq_log;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
		"fr.cpe.scoobygang.common.*",
		"fr.cpe.scoobygang.atelier3.api_activemq_log.*"
})
public class ApiActiveMqLogApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiActiveMqLogApplication.class, args);
	}
}


