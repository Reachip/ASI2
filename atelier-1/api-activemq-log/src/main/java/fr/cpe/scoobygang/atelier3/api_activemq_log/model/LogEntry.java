package fr.cpe.scoobygang.atelier3.api_activemq_log.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LogEntry {
    private LocalDateTime timestamp;
    private String queueName;
    private String message;
}