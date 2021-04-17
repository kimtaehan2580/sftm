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
	 * 결함상태에 따른 PUSH 메시지 설정
	 *
	 * @param defect_id : 결함 id
	 * @param sender_id : 발송자 명
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public boolean sendPushMessage_defect( int defect_id, String sender_id ) {

		Map defectMap = sqlSession.selectOne("PushDAO.selectDefectInfoForPush", defect_id);
		
		if(defectMap != null) {
			
			String defectTitle  = (String) defectMap.get("title");
			String defect_code 	= (String) defectMap.get("defect_code");
			String reader_id 	= (String) defectMap.get("reader_id");
			String dev_id 		= (String) defectMap.get("dev_id");
			String test_id 		= (String) defectMap.get("test_id");
			long team_id 		= Long.parseLong((String) defectMap.get("team_id"));
			
			
			
			Map<String, String> pushMap = new HashMap<String, String>();
			StringBuffer sbEvent = new StringBuffer();
			pushMap.put("push_code", "P001_01"); //push 코드 (결함)
			sbEvent.append("path=defect/defect");
			
			// test_id/dev_id/defect_id
			// &test_id=lance.m&defect_id=13
			// &dev_id=lance.m&defect_id=13
			//B001_01 결함등록시 담당업무 PL에서 PUSH 전송 
			if("B001_01".equals(defect_code)) {
				pushMap.put("title", "담당 개발자 없는 결함이 등록되었습니다.."); //Title
				pushMap.put("recv_user", reader_id);   //수신자 팀리더
				pushMap.put("reg_user",  sender_id);   //발신자 

				sbEvent.append("&team_id=").append(team_id).append("&selectDefectCode=4");
			}
			//B001_02 배정완료시 당당개발자에게 PUSH 전송 
			else if("B001_02".equals(defect_code)) {
				pushMap.put("title", "결함이 배정되었습니다."); 
				pushMap.put("recv_user", dev_id);      //수신자 개발자
				pushMap.put("reg_user",  sender_id);   //발신자 

				sbEvent.append("&dev_id=").append(dev_id).append("&defect_id=").append(defect_id);
			}
			//조치완료, 미조치건의 경우 담당 현업에게 PUSH 전송
			else if("B001_03".equals(defect_code)) {
				pushMap.put("title", "결함이 조치되었습니다."); 
				pushMap.put("recv_user", test_id);      //수신자 현업
				pushMap.put("reg_user",  sender_id);   //발신자 
				

				sbEvent.append("&test_id=").append(test_id).append("&defect_id=").append(defect_id);
			}
			else if("B001_04".equals(defect_code)) {
				pushMap.put("title", "결함이 조치되었습니다."); 
				pushMap.put("recv_user", test_id);      //수신자 현업
				pushMap.put("reg_user",  sender_id);   //발신자 
				

				sbEvent.append("&test_id=").append(test_id).append("&defect_id=").append(defect_id);
			}
			//B001_07 결함반려시에 당당개발자에게 PUSH 전송 
			else if("B001_07".equals(defect_code)) {
				pushMap.put("title", "결함조치 내용이 반려되었습니다."); 
				pushMap.put("recv_user", dev_id);      //수신자 개발자
				pushMap.put("reg_user",  sender_id);   //발신자 

				sbEvent.append("&dev_id=").append(dev_id).append("&defect_id=").append(defect_id);
			}
			
			else {
				return true;
			}

			String test_user_name 		= (String) defectMap.get("test_user_name");
			String dev_user_name 		= (String) defectMap.get("dev_user_name");
			String test_defect_name 	= (String) defectMap.get("test_defect_name");
			String defect_code_name 	= (String) defectMap.get("defect_code_name");
			
			SimpleDateFormat format1 = new SimpleDateFormat ( "yyyy-MM-dd HH:mm");
			Date time = new Date();
			String time1 = format1.format(time);
			
			
			StringBuffer sbMsg = new StringBuffer();
			sbMsg.append("결함제목 : "); sbMsg.append(defectTitle);
//			sbMsg.append("\n결함유형 : "); sbMsg.append(test_defect_name);
			sbMsg.append("\n결함상태 : "); sbMsg.append(defect_code_name);
//			sbMsg.append("\n담당현업 : "); sbMsg.append(test_user_name);
//			sbMsg.append("\n담당개발 : "); sbMsg.append(dev_user_name);
			sbMsg.append("\n발송시각 : "); sbMsg.append(time1);

			pushMap.put("msg", sbMsg.toString());
			pushMap.put("event", sbEvent.toString());
			
			
			int result = sqlSession.insert("PushDAO.insertPush", pushMap);
			
			if(result != 1) {
				return false;
			}
			return true;
			
		}
		else {
			return false;
		}
	}
	
	/**
	 * 게시글 등록 따른 PUSH 메시지 설정
	 *
	 * @param border_id : 게시글 id
	 * @param sender_id : 발송자 명
	 * @param push_receive : 발송대상
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public boolean sendPushMessage_border( int border_id, String sender_id, String push_receive  ) {
			
		
		log.debug("푸쉬 등록 요청>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		log.debug("border_id : " + border_id);
		log.debug("sender_id : " + sender_id);
		log.debug("push_receive " + push_receive);
		log.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>푸쉬 등록 요청");
		
		Map borderMap = sqlSession.selectOne("BorderDAO.selectBorderDetail", border_id);
		if(borderMap == null ) return false;

		String type_name = (String) borderMap.get("type_name");
		String type_code = (String) borderMap.get("type_code");
		String title = (String) borderMap.get("title");
		String reg_date = (String) borderMap.get("reg_date");
		String reg_user_name = (String) borderMap.get("reg_user_name");
		
		if(title.length() > 10) {
			title = title.substring(0, 8) + "...";
		}
		
		Map<String, String> pushMap = new HashMap<String, String>();
		StringBuffer sbEvent = new StringBuffer();
		pushMap.put("push_code", "P001_02"); //push 코드 (결함)
		pushMap.put("title", "["+type_name+"] " + title); 
		
		pushMap.put("reg_user",  sender_id);   //발신자 
		
		StringBuffer sbMsg = new StringBuffer();
		sbMsg.append("제목 : "); sbMsg.append(title);
		sbMsg.append("\n유형 : "); sbMsg.append(type_name);
		sbMsg.append("\n등록자 : "); sbMsg.append(reg_user_name);
		sbMsg.append("\n발송시각 : "); sbMsg.append(reg_date);
		
		sbEvent.append("path=border/border");
		sbEvent.append("&type_code=").append(type_code).append("&border_id=").append(border_id);
		
		
		pushMap.put("msg", sbMsg.toString());
		pushMap.put("event", sbEvent.toString());
		
		
		List<Object> userList = sqlSession.selectList("UserDAO.selectUser",  new HashMap<String, String>());
//		Map<String, Object> response = new HashMap<String, Object>();
		
		for(int i=0; i<userList.size();i++) {
			Map tempMap = (HashMap) userList.get(i);
			String user_id = (String) tempMap.get("user_id");
			String role_code = (String) tempMap.get("role_code");
			if( !"ALL".equals(push_receive) && role_code.equals(push_receive) ) {
				continue;	
			}
			pushMap.put("recv_user", user_id);
			
			sqlSession.insert("PushDAO.insertPush", pushMap);
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
