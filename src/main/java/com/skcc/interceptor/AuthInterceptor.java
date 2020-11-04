package com.skcc.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class AuthInterceptor extends HandlerInterceptorAdapter {

	private Logger log = LoggerFactory.getLogger(AuthInterceptor.class);
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
								Object handler) throws Exception {
		
		String urlPath = request.getServletPath();
		log.info("request.getServletPath(): {}", urlPath);
		
		/*
		 * session check
		 */
		HttpSession session = request.getSession();
		Map<String, String> authMap = (HashMap<String, String>)session.getAttribute("user");
		
		/*
		 * Login check 
		 */
		if(authMap == null) {
			log.error("login session info is null");
			// TODO: Project Exception 생성
//			throw new RuntimeException("Auth Exception");
			response.setStatus(999);
			return false;
		}
		/*
		 * TODO: User의 권한별 화면 접근제어
		 * User권한을 넘겨받고, 권한에 따라 urlPath가 접근가능한지 확인하는 로직
		 * Role & auth check
		 */
		else {
			log.info("userId: {}, userName: {}", authMap.get("userId"), authMap.get("userName"));
			return true;
		}
		
	}
}
