package atelier1.groupe3.orchestrator.publisher;

import activemq.Publishable;
import org.springframework.stereotype.Service;

@Service
public class DescriptionPublisher implements Publishable<com.baeldung.openapi.model.Description> {
    @Override
    public void publish(com.baeldung.openapi.model.Description publishble) {

    }
}
