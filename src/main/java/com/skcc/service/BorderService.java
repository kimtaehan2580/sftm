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
import org.springframework.transaction.annotation.Transactional;

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
	

	@Autowired
	private PushService pushService;
	
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
		
		Map responseMap = sqlSession.selectOne("BorderDAO.selectBorderDetail", reqMap.get("id"));
		Message.SetSuccesMsg(responseMap, "select");
		if(responseMap.get("imgkey") != null) {
			
			System.out.println("이미지 키 " + responseMap.get("imgkey"));
			int imgkey;
			try {
				long temp = (Long) responseMap.get("imgkey");
				imgkey = (int) temp;
			}
			catch(ClassCastException e) {
				String temp = (String) responseMap.get("imgkey");
				imgkey = Integer.parseInt(temp);
			}

			System.out.println("이미지 키 " + imgkey);
			if(!"-1".equals(imgkey)) {
				List<Object> imgList = sqlSession.selectList("ImgDAO.selectImgById", imgkey);
				if(imgList.size() != -1) {
					responseMap.put("imgList", imgList);
				}
			}
		}
		return responseMap;
	}
	
	/**
	 * 게시글 등록
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	@Transactional 
	public Map<String, Object> insertBorder( Map<String, Object> reqMap ) {	
			
		Map<String, Object> response = new HashMap<String, Object>();
		
		int id =  sqlSession.selectOne("BorderDAO.selectBorderId"); 
		reqMap.put("border_id", id);
		
		int result = sqlSession.insert("BorderDAO.insertBorder", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		
		String push_receive = (String) reqMap.get("push_receive");
		if( push_receive != null && !"NOT".equals(push_receive)) {
			pushService.sendPushMessage_border(id, (String) reqMap.get("cookieUserId"), push_receive);
		}
				

		Message.SetSuccesMsg(response, "insert");
		response.put("id", id);
		return response;
	}
	
	/**
	 * 게시글 수정
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	@Transactional 
	public Map<String, Object> updateBorder( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		int result = sqlSession.insert("BorderDAO.updateBorder", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		int border_id = Integer.parseInt((String) reqMap.get("border_id"));
		String push_receive = (String) reqMap.get("push_receive");
		if( push_receive != null && !"NOT".equals(push_receive)) {
			pushService.sendPushMessage_border(border_id, (String) reqMap.get("cookieUserId"), push_receive);
		}

		Message.SetSuccesMsg(response, "update");
//		response.put("id", id);
		response.put("id", border_id);
		return response;
	}
	
	
	
	/**
	 * 사이트맵 조회 (리스트)
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	public Map<String, Object> selectSitemapList( Map<String, Object> reqMap ) {	
		Map<String, Object> response = new HashMap<String, Object>();
		List<Object> list = sqlSession.selectList("BorderDAO.selectSitemapList", reqMap);
		
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	/**
	 * 사이트맵 등록
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	@Transactional 
	public Map<String, Object> insertSitemap( Map<String, Object> reqMap ) {	
			
		Map<String, Object> response = new HashMap<String, Object>();
		
		int result = sqlSession.insert("BorderDAO.insertSitemap", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}

		Message.SetSuccesMsg(response, "insert");
		return response;
	}
	
	/**
	 * 사이트맵 수정
	 * @param     Map<String, Object>  요청 Request
	 * @return    Map<String, Object>  응답 Response
	 */
	@Transactional 
	public Map<String, Object> updateSitemap( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		int result = sqlSession.update("BorderDAO.updateSitemap", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		Message.SetSuccesMsg(response, "update");
		return response;
	}
}
