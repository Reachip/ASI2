package fr.cpe.scoobygang.atelier3.api_backend.user.controller;

import java.util.List;

import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserModel, Integer> {
	
	List<UserModel> findByUsernameAndPwd(String username,String pwd);

}
