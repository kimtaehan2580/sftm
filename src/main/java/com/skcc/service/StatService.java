package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class StatService {

	private Logger log = LoggerFactory.getLogger(StatService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	public Map<String, Object> selectStatUserList( Map<String, Object> reqMap ) {	
		
		List<Object> list =null;
		
		String project_id = (String) reqMap.get("project_id");
		if(project_id== null || "".equals(project_id)) {
			list = sqlSession.selectList("StatDAO.selectStatUserListSum", reqMap);
		}
		else {
			list = sqlSession.selectList("StatDAO.selectStatUserList", reqMap);
		}
		
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	public Map<String, Object> selectStatTeamList( Map<String, Object> reqMap ) {	
		
		
		List<Object> list =null;
		
		String project_id = (String) reqMap.get("project_id");
		if(project_id== null || "".equals(project_id)) {
			list = sqlSession.selectList("StatDAO.selectStatTeamList", reqMap);
		}
		else {
			list = sqlSession.selectList("StatDAO.selectStatTeamList", reqMap);
		}
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	/**
	 * 메인화면 테스트를 데이터 조회
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectMainDataForTester( Map<String, Object> reqMap ) {	
		
//		List<Object> list = sqlSession.selectList("StatDAO.selectStatTeamList", reqMap);
		List<Map<String, Object>>  listSc = sqlSession.selectList("StatDAO.selectMainDataForTesterTc", reqMap);
		List<Map<String, Object>>  listDf = sqlSession.selectList("StatDAO.selectMainDataForTesterDf", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
			Message.SetSuccesMsg(response, "select");
			response.put("listSc", listSc);
			response.put("listDf", listDf);
//		}
		return response;
	}
	
	
	/**
	 * 메인화면 개발자를 데이터 조회
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectMainDataForDeveloper( Map<String, Object> reqMap ) {	
		
//		List<Object> list = sqlSession.selectList("StatDAO.selectStatTeamList", reqMap);
//		List<Map<String, Object>>  listSc = sqlSession.selectList("StatDAO.selectMainDataForTesterTc", reqMap);
		List<Map<String, Object>>  listDf = sqlSession.selectList("StatDAO.selectMainDataForTesterDf", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
			Message.SetSuccesMsg(response, "select");
//			response.put("listSc", listSc);
			response.put("listDf", listDf);
//		}
		return response;
	}
	
	/**
	 * 메인화면 개발자를 데이터 조회
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectMainDataForAdmin( Map<String, Object> reqMap ) {	
		
		List<Map<String, Object>>  listDf = null;
				
		
		listDf = sqlSession.selectList("StatDAO.selectStatUserList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
			Message.SetSuccesMsg(response, "select");
			response.put("listDf", listDf);
//		}
		return response;
	}
	
//	
	
}
