package fr.cpe.scoobygang.common.activemq;

public class QueuesConstants {
    public static final String QUEUE_GENERATION_TEXT = "queue.generation.text";
    public static final String QUEUE_GENERATION_IMAGE = "queue.generation.image";
    public static final String QUEUE_GENERATION_PROPERTY = "queue.generation.property";
    public static final String QUEUE_GENERATION_CARD = "queue.generation.card";
    public static final String QUEUE_NOTIFY = "queue.notify";
    public static final String QUEUE_GAME_TRANSACTION = "queue.game.transaction";
    public static final String QUEUE_GAME_HISTORY = "queue.game.history";
    public static final String QUEUE_SAVE_MESSAGE = "queue.save.message";

    private QueuesConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}