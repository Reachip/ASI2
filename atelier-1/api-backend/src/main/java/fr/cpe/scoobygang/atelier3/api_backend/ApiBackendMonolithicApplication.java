package fr.cpe.scoobygang.atelier3.api_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.EnableJms;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@EnableJms
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Card Market Rest Api", version = "1.0", description = "Information about the Card Market APi and how to interact with"))
// doc here localhost:8080/swagger-ui.html
public class ApiBackendMonolithicApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiBackendMonolithicApplication.class, args);
	}

}
