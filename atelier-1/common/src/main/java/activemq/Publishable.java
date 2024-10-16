package activemq;

public interface Publishable<T> {
    void publish(T publishble);
}
