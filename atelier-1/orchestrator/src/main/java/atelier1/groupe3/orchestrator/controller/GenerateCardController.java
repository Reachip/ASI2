package atelier1.groupe3.orchestrator.controller;

import com.baeldung.openapi.model.Generation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GenerateCardController implements com.baeldung.openapi.api.GenerationsApi {
    @Override
    public ResponseEntity<List<com.baeldung.openapi.model.Generation>> generationsGet() {
        return com.baeldung.openapi.api.GenerationsApi.super.generationsGet();
    }

    @Override
    public ResponseEntity<Generation> generationsIdGet(Integer id) {
        return com.baeldung.openapi.api.GenerationsApi.super.generationsIdGet(id);
    }

    @Override
    public ResponseEntity<Generation> generationsPost(Generation generation) {
        return com.baeldung.openapi.api.GenerationsApi.super.generationsPost(generation);
    }
}
