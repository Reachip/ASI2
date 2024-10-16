package fr.cpe.scoobygang.atelier3.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouteLocator routeLocator(RouteLocatorBuilder builder) {
		return builder
				.routes()
				.route("transaction-route", r -> r.path("/transaction/**").uri("lb://api-transaction-microservice"))
				.route("user-route", r -> r.path("/user/**").uri("lb://api-user-microservice"))
				.route("card-route", r -> r.path("/card/**").uri("lb://api-card-microservice"))
				.route("rooms-route", r -> r.path("/rooms/**").uri("lb://api-room-microservice/rooms"))
				.route("room-route", r -> r.path("/room/**").uri("lb://api-room-microservice"))
				.route("store-route", r -> r.path("/store/**").uri("lb://api-store-microservice"))
				.route("orchestrator-route", r -> r.path("/orchestrator/**").uri("lb://api-orchestrator-microservice"))
				.build();
	}

	@Bean
	public CorsWebFilter corsFilter() {
		CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
		corsConfig.setMaxAge(3600L);
		corsConfig.addAllowedHeader("*");

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);

		return new CorsWebFilter(source);
	}
}
