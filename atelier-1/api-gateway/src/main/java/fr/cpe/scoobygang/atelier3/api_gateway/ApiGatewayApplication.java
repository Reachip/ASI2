package fr.cpe.scoobygang.atelier3.api_gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Value("${app.uri.react-frontend}")
	private String reactFrontendUri;

	@Value("${app.uri.ai-service}")
	private String aiServiceUri;

	@Value("${app.uri.api-backend}")
	private String apiBackendUri;

	@Value("${app.uri.websocket-service}")
	private String websocketServiceUri;

	@Value("${app.uri.orchestrator}")
	private String orchestratorUri;

	@Bean
	public RouteLocator routeLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("react-app-route", r -> r.path("/**")
						.and()
						.path("/api/**", "/ai/**", "/ws/**", "/orchestrator/**").negate()
						.uri(reactFrontendUri))
				.route("ai-route", r -> r.path("/ai/**")
						.filters(f -> f.stripPrefix(1))
						.uri(aiServiceUri))
				.route("backend-route", r -> r.path("/api/**")
						.filters(f -> f.stripPrefix(1))
						.uri(apiBackendUri))
				.route("backend-node-route", r -> r.path("/ws/**")
						.filters(f -> f.stripPrefix(1))
						.uri(websocketServiceUri))
				.route("orchestrator-route", r -> r.path("/orchestrator/**")
						.uri(orchestratorUri))
				.build();
	}
}
