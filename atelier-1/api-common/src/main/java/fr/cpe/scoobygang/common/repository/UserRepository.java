package fr.cpe.scoobygang.common.repository;

import fr.cpe.scoobygang.common.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    @Query("SELECT count(c) FROM User c")
    long count();

    User findByUsername(String username);
}
