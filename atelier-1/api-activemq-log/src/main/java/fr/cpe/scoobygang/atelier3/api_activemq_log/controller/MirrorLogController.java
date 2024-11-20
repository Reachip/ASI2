package fr.cpe.scoobygang.atelier3.api_activemq_log.controller;


import fr.cpe.scoobygang.atelier3.api_activemq_log.model.LogEntry;
import fr.cpe.scoobygang.atelier3.api_activemq_log.service.MirrorLogService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/logs")
class MirrorLogController {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private final MirrorLogService logService;

    public MirrorLogController(MirrorLogService logService) {
        this.logService = logService;
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadLogs(
            @RequestParam(required = false) String queueName) {
        try {
            if (queueName != null) {
                // Si un nom de queue est spécifié, créer un fichier temporaire filtré
                List<LogEntry> filteredLogs = logService.readLogEntries(queueName);
                Path tempFile = Files.createTempFile("mirror-logs-filtered-", ".log");

                try (BufferedWriter writer = Files.newBufferedWriter(tempFile)) {
                    for (LogEntry entry : filteredLogs) {
                        writer.write(String.format("[%s] Queue: %s - Message: %s%n",
                                entry.getTimestamp().format(DATE_FORMATTER),
                                entry.getQueueName(),
                                entry.getMessage()));
                    }
                }

                Resource resource = new FileSystemResource(tempFile.toFile());
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"mirror-logs-" + queueName + ".log\"")
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(resource);
            } else {
                // Si pas de filtre, renvoyer le fichier complet
                Resource resource = logService.getLogFileAsResource();
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"mirror-logs.log\"")
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(resource);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}