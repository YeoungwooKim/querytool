package querygen.querygen.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import querygen.querygen.dto.UserDto;
import querygen.querygen.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserMapper userMapper;

	@Override
	public List<UserDto> showUser() throws Exception {
		return userMapper.showUser();
	}
}
