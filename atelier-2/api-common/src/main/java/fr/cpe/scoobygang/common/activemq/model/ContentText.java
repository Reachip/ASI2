package fr.cpe.scoobygang.common.activemq.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentText extends Content {
    private String prompt;

    @Override
    public String toString() {
        return "ContentText{" +
                "prompt='" + prompt + '\'' +
                '}';
    }
}