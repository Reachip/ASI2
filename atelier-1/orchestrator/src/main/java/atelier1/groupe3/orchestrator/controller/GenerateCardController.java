package atelier1.groupe3.orchestrator.controller;

import com.baeldung.openapi.api.GenerationsApi;
import com.baeldung.openapi.model.Generation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GenerateCardController implements GenerationsApi {
    @Override
    public ResponseEntity<List<Generation>> generationsGet() {
        return GenerationsApi.super.generationsGet();
    }

    @Override
    public ResponseEntity<Generation> generationsIdGet(Integer id) {
        return GenerationsApi.super.generationsIdGet(id);
    }

    @Override
    public ResponseEntity<Generation> generationsPost(Generation generation) {
        return GenerationsApi.super.generationsPost(generation);
    }
}
