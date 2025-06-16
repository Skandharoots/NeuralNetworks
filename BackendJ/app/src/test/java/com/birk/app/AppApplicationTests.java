package com.birk.app;

import static org.junit.Assert.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.birk.app.controller.UserController;
import com.birk.app.service.AzureService;
import com.birk.app.service.JwtService;
import com.birk.app.service.LoginService;
import com.birk.app.service.UserService;

@SpringBootTest
@RunWith(SpringRunner.class)
class AppApplicationTests {

	@Mock
	private JwtService jwt;

	@Mock
	private AzureService azure;

	@Mock
	private LoginService login;

	@Mock
	private UserService userService;

	@InjectMocks
	private UserController userController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

}
