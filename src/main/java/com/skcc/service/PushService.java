package com.skcc.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class PushService {

	private Logger log = LoggerFactory.getLogger(PushService.class);
	
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	

	/*
	 * 사번으로 PUSH 수신건 확인
	 */
	public Map<String, Object> selectPushListById( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("PushDAO.selectPushListById", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			sqlSession.update("PushDAO.updatePushListById", reqMap);
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	/**
	 * 메인화면에서 사용자 아이디로 Push 이력을 조회
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> selectPushListByUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		List<Object> list = sqlSession.selectList("PushDAO.selectPushListByUser", reqMap);
		
		if(list.size() != -1) {
			
//			sqlSession.update("PushDAO.updatePushListById", reqMap);
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		
		return response;
	}
	
	
	
	/**
	 * UI 테스트 화면 녹화등록시 개발자에게 PUSH 발송하는 서비스
	 *
	 * @param 	int (결함아이디)
	 * 			String (등록자)
	 * @return boolean (성공/실패)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public boolean insertPushDefectAutoTest( int defect_id, String temp ) {
		
		
		Map responseMap = sqlSession.selectOne("PushDAO.selectDefectInfoForPush", defect_id);
		String title = (String) responseMap.get("title");
		String reg_user_name = (String) responseMap.get("reg_user_name"); 					//결함등록자
		String reg_user_name2 = (String) responseMap.get("reg_user_name2"); 	//결함방금 수정자
		
		
		String reg_user = (String) responseMap.get("reg_user");		//최초 등록자 테스터 
		String reg_user2 = (String) responseMap.get("reg_user2");   //상태변경한 사람

		String defect_user = (String) responseMap.get("defect_user");
//		log.debug("김태한 테스트 : " + responseMap.get("reader_id"));
		
		String defect_code = (String) responseMap.get("defect_code");
		
		Map<String, Object> queryMap = new HashMap<String, Object>();
		
		queryMap.put("push_code", "P001_08");
//		queryMap.put("title", "[결함배정안내] " +  title);
		queryMap.put("title", title);
		queryMap.put("msg", "테스트자동화 녹화건이 등록되엇습니다.\n"
				+ "결함명 : " + title + "\n"
				+ "등록자 : " + temp + "\n");
		queryMap.put("recv_user", defect_user); //개발자
		queryMap.put("reg_user", temp);   //등록자
		
		int result = sqlSession.insert("PushDAO.insertPush", queryMap);
		
		if(result != 1) {
			return false;
		}
		return true;
	}
	
	
	/**
	 * 결함지연건에 대한 PUSH 발송 서비스
	 *
	 * @param 	int (결함아이디)
	 * 			String (등록자)
	 * @return boolean (성공/실패)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public boolean insertDelayDefect( int defect_id) {
		log.debug("insertDelayDefect insertDelayDefect insertDelayDefect");
		Map responseMap = sqlSession.selectOne("PushDAO.selectDefectInfoForPush", defect_id);
		
		String title = (String) responseMap.get("title");
		
		
		String reg_user = (String) responseMap.get("reg_user");		//최초 등록자 테스터 
		String defect_user = (String) responseMap.get("defect_user");
		String defect_code = (String) responseMap.get("defect_code");
		String msg = "";
		
		Map<String, Object> queryMap = new HashMap<String, Object>();

		queryMap.put("push_code", "P001_07");	
		queryMap.put("title", title);
		if("B001_02".equals(defect_code) || "B001_07".equals(defect_code)) {
			queryMap.put("recv_user", defect_user); //개발자
			msg = "결함 처리가 지연되고 있습니다 \n(개발자확인필요).";
			
			
		}
		//조치완료/미개발건은 테스터에서 전달해야지
		else if("B001_03".equals(defect_code) || "B001_04".equals(defect_code)) {
			queryMap.put("recv_user", reg_user); //개발자
			msg = "결함 처리가 지연되고 있습니다 \n(테스터확인필요).";
			
		}
		
		queryMap.put("reg_user", "admin");   //등록자
		
		
		
		queryMap.put("msg",msg);
		
		int result = sqlSession.insert("PushDAO.insertPush", queryMap);
		
		if(result != 1) {
			return false;
		}
		return true;
	}
	
	/**
	 * Defect 신규등록 상태변경시 호출하도록 하였습니다. 
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public boolean insertPushDefect( int defect_id ) {
		
		Map responseMap = sqlSession.selectOne("PushDAO.selectDefectInfoForPush", defect_id);
		String title = (String) responseMap.get("title");
		String reg_user_name = (String) responseMap.get("reg_user_name"); 					//결함등록자
		String reg_user_name2 = (String) responseMap.get("reg_user_name2"); 	//결함방금 수정자
		
		
		String reg_user = (String) responseMap.get("reg_user");		//최초 등록자 테스터 
		String reg_user2 = (String) responseMap.get("reg_user2");   //상태변경한 사람

		String defect_user = (String) responseMap.get("defect_user");
//		log.debug("김태한 테스트 : " + responseMap.get("reader_id"));
		
		String defect_code = (String) responseMap.get("defect_code");
		Map<String, Object> queryMap = new HashMap<String, Object>();
		String msg = "";
//		B001_03	조치완료	Y	20	admin	2020-08-11
//		B001_04	미조치건	Y	30	admin	2020-08-11
//		B001_05	개발지연	Y	40	admin	2020-08-11
//		B001_07	결함반려	Y	60	admin	2020-08-11
		
//		P001_01	결함배정안내	Y	0	admin	2020-08-27
//		P001_02	결함배정요청	Y	10	admin	2020-08-27
//		P001_03	결함상태변경	Y	20	admin	2020-08-27
//		P001_04	결함종료안내	Y	30	admin	2020-08-27
		
		//B001_01	결함등록	Y	0	admin	2020-08-11
		if("B001_01".equals(defect_code)) {

			String reader_id = (String) responseMap.get("reader_id");
			
			//배정되지 않은 건으로 팀 리더에게 PUSH 발송함
			//P001_02	결함배정요청	Y	10	admin	2020-08-27
			queryMap.put("push_code", "P001_02");
//			queryMap.put("title", "[결함배정요청] " +  title);
			queryMap.put("title", title);
			msg = "신규결함이 배정대기중입니다.\n"
					+ "결함명 : " + title + "\n"
					+ "등록자 : " + reg_user_name + "\n";
			queryMap.put("recv_user", reader_id); //수신자 팀리더
			queryMap.put("reg_user", reg_user2);   //등록자
			
		}
		//B001_02	배정완료	Y	10	admin	2020-08-11
		else if("B001_02".equals(defect_code)) {
			
			//P001_01	결함배정안내	Y	0	admin	2020-08-27
			queryMap.put("push_code", "P001_01");
//			queryMap.put("title", "[결함배정안내] " +  title);
			queryMap.put("title", title);
			msg = "결함이 배정되었습니다.\n"
					+ "결함명 : " + title + "\n"
					+ "등록자 : " + reg_user_name + "\n";
			queryMap.put("recv_user", defect_user); //개발자
			queryMap.put("reg_user", reg_user);   //등록자
			
		}
		//B001_06	결함종료	Y	50	admin	2020-08-11
		else if("B001_06".equals(defect_code)) {
			//P001_04	결함종료안내	Y	30	admin	2020-08-27
			queryMap.put("push_code", "P001_04");
			
//			queryMap.put("title", "[결함종료안내] " +  title);
			queryMap.put("title", title);
			msg = "결함이 종료되었습니다.\n"
					+ "결함명 : " + title + "\n"
					+ "등록자 : " + reg_user_name + "\n";
			queryMap.put("recv_user", defect_user); //개발자
			queryMap.put("reg_user", reg_user);   //등록자
		}
		
//		B001_03	조치완료	Y	20	admin	2020-08-11
//		B001_04	미조치건	Y	30	admin	2020-08-11
//		B001_05	개발지연	Y	40	admin	2020-08-11
//		B001_07	결함반려	Y	60	admin	2020-08-11
		else {
			String defect_code_name = (String)responseMap.get("defect_code_name");
			
			//P001_03	결함상태변경	Y	20	admin	2020-08-27
			queryMap.put("push_code", "P001_03");
//			queryMap.put("title", "[결함상태변경] " +  title);
			queryMap.put("title", title);
			msg = "결함상태가 [" + defect_code_name + "]로 변경되었습니다.\n"
					+ "결함명 : " + title + "\n"
					+ "등록자 : " + reg_user_name2 + "\n";
			
			//조치완료, 미조치건은 현업에게 보냅니다.
			if("B001_03".equals(defect_code) || "B001_04".equals(defect_code)) {
				queryMap.put("recv_user", reg_user); //개발자
			}

			//조치완료, 미조치건이 아닌경우 개발자에게 보냅니다.
			else {
				queryMap.put("recv_user", defect_user); //개발자
			}
			queryMap.put("reg_user", reg_user2);   //등록자
		}
		
		
		SimpleDateFormat format1 = new SimpleDateFormat ( "yyyy-MM-dd HH:mm");
		Date time = new Date();
		String time1 = format1.format(time);
		
		
		msg+="보낸시각 : " + time1;
		queryMap.put("msg", msg);
		
		int result = sqlSession.insert("PushDAO.insertPush", queryMap);
		
		if(result != 1) {
			return false;
		}
		return true;
		
	}

	
	
	public boolean insertPushmsg( String code, String msg, String user) {
		
		log.debug("푸쉬 등록 요청>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		log.debug("title : " + code);
		log.debug("msg : " + msg);
		log.debug("user : " + user);
		log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>푸쉬 등록 요청");
		
		try {
			//PUSH로 사용자에게 알려줌
			Map<String, Object> pushMap = new HashMap<String, Object>();
			pushMap.put("title", 	code);
			pushMap.put("msg", 		msg);
			pushMap.put("user", 	user);
			
			int result = sqlSession.insert("PushDAO.insertPush", pushMap);
			
			if(result != 1) {
				return false;
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	

	
	
}
