package fr.cpe.scoobygang.atelier3.api_generation_property_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
        "fr.cpe.scoobygang.common.*",
        "fr.cpe.scoobygang.atelier3.api_generation_property_microservice.*",
})
public class ApiGenerationPropertyMicroserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGenerationPropertyMicroserviceApplication.class, args);
    }

}
