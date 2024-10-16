package fr.cpe.scoobygang.common.dto.mapper;

import fr.cpe.scoobygang.common.dto.request.*;
import fr.cpe.scoobygang.common.dto.response.*;
import fr.cpe.scoobygang.common.model.*;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper( UserMapper.class );
    User userRequestToUser(UserRequest car);
    User userPutRequestToUser(UserPutRequest userPutRequest);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "surname", source = "surname")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "balance", source = "balance")
    void userApply(@MappingTarget User userToUpdate, User user);
    UserRequest userToUserRequest(User car);
    UserResponse userToUserResponse(User user);
    UserMinimalResponse userToUserMinimalResponse(User user);
    List<UserResponse> usersToUserResponses(List<User> users);
}
