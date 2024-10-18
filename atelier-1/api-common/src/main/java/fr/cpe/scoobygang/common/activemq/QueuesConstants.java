package fr.cpe.scoobygang.common.activemq;

public class QueuesConstants {
    public static final String QUEUE_GENERATION_TEXT = "queue.generation.text";
    public static final String QUEUE_GENERATION_IMAGE = "queue.generation.image";
    public static final String QUEUE_GENERATION_PROPERTY = "queue.generation.property";

    private QueuesConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}