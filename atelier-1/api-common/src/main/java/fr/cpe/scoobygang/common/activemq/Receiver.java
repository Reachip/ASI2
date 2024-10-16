package fr.cpe.scoobygang.common.activemq;

public interface Receiver<T extends JsonConvertable> {
    T receive(String received);
}