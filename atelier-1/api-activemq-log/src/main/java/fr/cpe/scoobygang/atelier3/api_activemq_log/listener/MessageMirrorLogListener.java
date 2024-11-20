package fr.cpe.scoobygang.atelier3.api_activemq_log.listener;

import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.TextMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class MessageMirrorLogListener {
    private static final Pattern QUEUE_NAME_PATTERN = Pattern.compile("mirror\\.(.*?)\\.mirror");
    private static final String LOG_FILE_PATH = "mirror_messages.log";

    private void writeToLogFile(String logEntry) throws IOException {
        Files.write(
                Paths.get(LOG_FILE_PATH),
                logEntry.getBytes(),
                StandardOpenOption.CREATE,
                StandardOpenOption.APPEND
        );
    }

    private String extractQueueName(String destination) {
        Matcher matcher = QUEUE_NAME_PATTERN.matcher(destination);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return "unknown_queue";
    }

    @JmsListener(destination = "mirror.>.mirror", containerFactory = "topicConnectionFactory")
    public void receiveAndMirrorMessage(Message message) throws JMSException, IOException, ClassNotFoundException {
        String destination = message.getJMSDestination().toString();
        String queueName = extractQueueName(destination);

        // Récupérer le contenu du message
        String messageContent;
        if (message instanceof TextMessage) {
            messageContent = ((TextMessage) message).getText();
        } else {
            messageContent = message.toString();
        }

        // Créer l'entrée de log avec timestamp
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String logEntry = String.format("[%s] Queue: %s - Message: %s%n",
                timestamp,
                queueName,
                messageContent);

        // Logger dans le fichier et dans les logs applicatifs
        writeToLogFile(logEntry);
    }
}
