package fr.cpe.scoobygang.common.activemq;

public interface Publisher<T extends JsonConvertable> {
    void send(T toSend);
}
