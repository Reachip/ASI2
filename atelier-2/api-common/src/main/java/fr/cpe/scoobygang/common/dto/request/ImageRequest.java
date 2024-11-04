package fr.cpe.scoobygang.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ImageRequest {
    private String promptTxt;

    private String negativePromptTxt;
}
