package fr.cpe.scoobygang.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TextRequest {
    private String model;
    private String prompt;
    private boolean stream;
}
