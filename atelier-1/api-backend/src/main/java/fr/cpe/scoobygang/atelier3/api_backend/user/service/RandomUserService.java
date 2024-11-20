package fr.cpe.scoobygang.atelier3.api_backend.user.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class RandomUserService {
    private final List<UserModel> userData;

    public RandomUserService() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("users.json");
            if (inputStream == null) {
                throw new RuntimeException("users.json file not found");
            }
            userData = mapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException e) {
            throw new RuntimeException("Error loading user data", e);
        }
    }

    public List<UserModel> getAllUsers() {
        return userData;
    }
}
