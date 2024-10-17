package fr.cpe.scoobygang.common.activemq;

public class QueuesConstants {
    public static final String ACTIVEMQ_HOST = "localhost";
    public static final int ACTIVEMQ_PORT = 61613;
    public static final String USERNAME = "myuser";
    public static final String PASSWORD = "mypwd";

    public static final String QUEUE_GENERATION_TEXT = "/queue/generation/text";
    public static final String QUEUE_GENERATION_IMAGE = "/queue/generation/image";
    public static final String QUEUE_GENERATION_PROPERTY = "/queue/generation/property";

    private QueuesConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}