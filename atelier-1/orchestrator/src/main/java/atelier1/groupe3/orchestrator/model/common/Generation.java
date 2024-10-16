package atelier1.groupe3.orchestrator.model.common;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Generation {
    @Id
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    protected Transaction transaction;

    protected String image;
}
