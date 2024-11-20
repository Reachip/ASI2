package fr.cpe.scoobygang.atelier3.api_activemq_log.service;

import fr.cpe.scoobygang.atelier3.api_activemq_log.model.LogEntry;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class MirrorLogService {
    private static final String LOG_FILE_PATH = "mirror_messages.log";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public List<LogEntry> readLogEntries(String queueFilter) throws IOException {
        List<LogEntry> entries = new ArrayList<>();
        List<String> lines = Files.readAllLines(Paths.get(LOG_FILE_PATH));

        for (String line : lines) {
            LogEntry entry = parseLine(line);
            if (entry != null && (queueFilter == null || entry.getQueueName().equals(queueFilter))) {
                entries.add(entry);
            }
        }
        return entries;
    }

    private LogEntry parseLine(String line) {
        try {
            // Format attendu: [timestamp] Queue: queueName - Message: messageContent

            String timestampStr = line.substring(1, line.indexOf("]"));
            String remaining = line.substring(line.indexOf("]") + 1);

            String queueName = remaining.substring(
                    remaining.indexOf("Queue: ") + 7,
                    remaining.indexOf(" - Message:")
            ).trim();

            String message = remaining.substring(
                    remaining.indexOf("Message: ") + 9
            ).trim();

            return new LogEntry(
                    LocalDateTime.parse(timestampStr, DATE_FORMATTER),
                    queueName,
                    message
            );
        } catch (Exception e) {
            return null;
        }
    }

    public Resource getLogFileAsResource() throws IOException {
        Path path = Paths.get(LOG_FILE_PATH);
        return new FileSystemResource(path.toFile());
    }
}