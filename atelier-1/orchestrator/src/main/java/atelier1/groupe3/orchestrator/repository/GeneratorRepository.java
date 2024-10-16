package atelier1.groupe3.orchestrator.repository;

import atelier1.groupe3.orchestrator.model.common.Generation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratorRepository extends JpaRepository<Generation, Long> {
}
