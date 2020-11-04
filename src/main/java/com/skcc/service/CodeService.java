package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class CodeService {
	
	
	private Logger log = LoggerFactory.getLogger(CodeService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	public Map<String, Object> selectCodeGroupList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectCodeGroupList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	 
	public Map<String, Object> selectCodeList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectCodeList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			
			response.put("code_group", reqMap.get("code_group"));
			response.put("list", list);
		}
		return response;
	}
	
	/*
	 * 코드그룹 신규등록
	 */
	public Map<String, Object> insertCodeGroup( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertCodeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/*
	 * 코드그룹 수정
	 */
	public Map<String, Object> updateCodeGroup( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateCodeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	
	/*
	 * 코드그룹 신규등록
	 */
	public Map<String, Object> insertCode( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertCode", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/*
	 * 코드그룹 수정
	 */
	public Map<String, Object> updateCode( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateCode", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	
	/**
	 * 테스트케이스 그룹 리스트 조회 
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectTypeGroupList( Map<String, Object> reqMap ) {	
		String is_batch = (String) reqMap.get("is_batch");
		
		if("Y".equals(is_batch)) {
			reqMap.put("use_type", "B");
		}
		else if("N".equals(is_batch)) {
			reqMap.put("use_type", "O");
		}
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectTypeGroupList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	/**
	 * 테스트케이스 그룹 추가
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> insertTypeGroup( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertTypeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}

	/**
	 * 테스트케이스 그룹 수정
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> updateTypeGroup( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateTypeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/**
	 * 테스트케이스 그룹 삭제
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> deleteTypeGroup( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.deleteTypeGroup", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "delete");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/**
	 * 테스트케이스 유형상세 리스트 조회 
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectTypeList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectTypeList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	/**
	 * 테스트케이스 유형상세 추가
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> insertType( Map<String, Object> reqMap ) {	
	
		
		Map<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("CodeDAO.insertType", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}

	/**
	 * 테스트케이스 유형상세 수정
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> updateType( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.updateType", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	/**
	 * 테스트케이스 그룹 삭제
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> deleteType( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.deleteType", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "delete");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	
	/**
	 * 단위/통합테스트 리스트 조회
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectProjectList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("CodeDAO.selectProjectList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	/**
	 * 단위/통합테스트 신규건 저장
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> insertProject( Map<String, Object> reqMap ) {	
		
		/*
			cookieUserId: "T001"
			end_date: "2020-08-25"
			id: ""
			project_name: "ㅇ"
			start_date: "2020-08-25"
			use_yn: "Y"
		 */
		Map<String, Object> response = new HashMap<String, Object>();
		

		String start_date 	= (String) reqMap.get("start_date");
		String end_date 	= (String) reqMap.get("end_date");

		reqMap.put("start_date", 	start_date.replaceAll("-", ""));
		reqMap.put("end_date", 		end_date.replaceAll("-", ""));
		
		int result = sqlSession.insert("CodeDAO.insertProject", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "insert");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	/**
	 * 단위/통합테스트 수정
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> updateProject( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();
		
		
		String start_date 	= (String) reqMap.get("start_date");
		String end_date 	= (String) reqMap.get("end_date");

		reqMap.put("start_date", 	start_date.replaceAll("-", ""));
		reqMap.put("end_date", 		end_date.replaceAll("-", ""));
		
		
		int result = sqlSession.update("CodeDAO.updateProject", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
	
	/**
	 * 테스트케이스 그룹 삭제
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> deleteProject( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();

		int result = sqlSession.update("CodeDAO.deleteProject", reqMap);
		if(result == 1) { 
			Message.SetSuccesMsg(response, "delete");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
		
	}
	
}
