package fr.cpe.scoobygang.atelier3.api_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jms.annotation.EnableJms;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@EnableJms
@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
        "fr.cpe.scoobygang.atelier3.api_backend",
        "fr.cpe.scoobygang.common.*",
})
@OpenAPIDefinition(info = @Info(title = "Card Market Rest Api", version = "1.0", description = "Information about the Card Market APi and how to interact with"))
// doc here localhost:8088/swagger-ui.html
public class ApiBackendMonolithicApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiBackendMonolithicApplication.class, args);
    }

}
