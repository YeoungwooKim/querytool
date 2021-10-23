package querygen.querygen.service;

import java.util.List;

import querygen.querygen.dto.UserDto;

public interface UserService {
	
	 List<UserDto> showUser() throws Exception;
}
