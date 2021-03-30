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
public class BorderService {
	
	
	private Logger log = LoggerFactory.getLogger(BorderService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	/**
	 * 게시글 조회 (리스트)
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectBorderList( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();
		List<Object> list = sqlSession.selectList("BorderDAO.selectBorderList", reqMap);
		
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	/**
	 * 게시글 조회 (상세)
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectBorderDetail( Map<String, Object> reqMap ) {	
		
//		List<Object> list = sqlSession.selectList("BorderDAO.selectBorderList", reqMap);
		Map responseMap = sqlSession.selectOne("BorderDAO.selectBorderDetail", reqMap.get("id"));
		
		Message.SetSuccesMsg(responseMap, "select");
		return responseMap;
	}
//	
	
}
