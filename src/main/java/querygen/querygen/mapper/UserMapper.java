package querygen.querygen.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import querygen.querygen.dto.UserDto;

@Mapper
public interface UserMapper {
	List<UserDto> showUser() throws Exception;
}
