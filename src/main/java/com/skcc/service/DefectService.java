package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.exceptions.PersistenceException;
import org.json.simple.JSONObject;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class DefectService {

	private Logger log = LoggerFactory.getLogger(DefectService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	

	@Autowired
	private PushService pushService;
	
	@Value("${file.path}") private String file_Path;

	 
	/**
	 * 결함 목록 조회 
	 *
	 * @param reqMap request 데이터
	 * @return 응답 결과
	 */
	public Map<String, Object> selectDefectList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	/**
	 * 신규 결함 등록
	 *
	 * @param reqMap request 데이터
	 * @return 응답 결과
	 */
//	@Transactional(rollbackFor=Exception.class)
	public Map<String, Object> insertDefect( Map<String, Object> reqMap ) {	
			
		/*
		 * desc : 신규결함 등록 모듈
		 * 1. 결함 테이블 등록 	(itm_defect)
		 * 2. 결함 이력테이블 등록    (itm_defect_history) 결함등록
		 * 2-1. 개발자가 있는 테스트케이스건의 결함은  자동배정완료 됨 (itm_defect_history) 배정완료
		 * 2-2. 개발자가 없는 텟트트케이스건의 결함은 PL이 배정하도록 함
		 * 3. push evnet 발송합니다.
		 */
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		//0. 테스트케이스 상태 변경 필요합니다. 
		//결함등록 시도상태의 경우 테스트케이스가 진행중이므로 테스트중으로 변경합니다.
		String state = (String) reqMap.get("state");
		if("C001_01".equals(state)){
			reqMap.put("state", "C001_02");
			int result = sqlSession.update("ScenarioDAO.updateTestCaseOnlyState", reqMap);
			if(result != 1) {
				return response;
			}
		}

		int id =  sqlSession.selectOne("DefectDAO.selectDefectId"); 
		reqMap.put("defect_id", id);
		
		//2. 결함 이력테이블 등록    (itm_defect_history) 결함등록
		reqMap.put("reg_user", reqMap.get("cookieUserId") );
		int result = sqlSession.insert("DefectDAO.insertDefectHistory", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		
		//자동배정 로직 추가합니다. 
		//2-1. 개발자가 있는 테스트케이스건의 결함은  자동배정완료 됨 (itm_defect_history) 배정완료
		//결함 등록 안내
		String dev_id = sqlSession.selectOne("DefectDAO.selectTestCaseDevId", reqMap); 
		
		if(dev_id == null || "".equals(dev_id) ) {
			;
		}
		else {
			reqMap.put("reg_user", "admin" );
			reqMap.put("defect_code", "B001_02" ); //배정완료 로직입니다.
			 result = sqlSession.insert("DefectDAO.insertDefectHistory", reqMap);   //결함이력테이블 데이터 등록
			if(result != 1) {
				return response;
			}
//			pushService.insertPushmsg(Message.REG_DEFECT_DEV, (String) reqMap.get("title"), dev_id);
		}
		
		//1. 결함 테이블 등록 	(itm_defect)
		result = sqlSession.insert("DefectDAO.insertDefect", reqMap);			//결함테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		
		//결함 등록시 commnet에 자동으로 desc 남기는 로직 추가함
//		#{type_code},
//		#{case_id}::bigint,
//		#{cookieUserId},
//		#{comment},
		
		Map<String, Object> commentDao = new HashMap<String, Object>();
		commentDao.put("type_code", "d");
		commentDao.put("case_id", "0");
		commentDao.put("defect_id", id);
		commentDao.put("cookieUserId", reqMap.get("cookieUserId"));
		
		commentDao.put("comment", "<최초등록> " + reqMap.get("description"));
		int result2 = sqlSession.update("ScenarioDAO.insertComment", commentDao);
		
		
		
		pushService.sendPushMessage_defect(id, (String) reqMap.get("cookieUserId"));
		//결함 PUSH 발송함
//		pushService.insertPushDefect( id );
		
		//push evnet 발송합니다.
//		pushService.insertPushmsg ( id );
		
		
		Message.SetSuccesMsg(response, "insert");
		response.put("id", id);
		response.put("title", reqMap.get("title"));
		
		return response;
	}
	
	/*
	 * 테스터가 결함테이블 수정
	 */
	public Map<String, Object> updateDefectState( Map<String, Object> reqMap ) {	
		
//		case_code: "android_002"
//		cookieUserId: "T002"
//		defect_code: "B001_02"
//		description: "tset"
//		id: 32
//		imgkey: "42"
//		scenario_code: "ANDROID"
//		title: "test"
		Map<String, Object> response = new HashMap<String, Object>();
		String 	defect_code = (String) reqMap.get("defect_code");
		String 	imgkey = (String) reqMap.get("imgkey");
		String 	comment = (String) reqMap.get("comment");
		String 	developer_id = (String) reqMap.get("developer_id");
		int 	defect_id = (Integer) reqMap.get("defect_id");
		System.out.println("defect_code -> " + defect_code + " : " + defect_code.isEmpty());
		System.out.println("imgkey -> " + imgkey+ " : " + imgkey.isEmpty());
		System.out.println("comment -> " + comment+ " : " + comment.isEmpty());
		System.out.println("developer_id -> " + developer_id+ " : " + developer_id.isEmpty());
		
		//이력 업데이트 필요한 건인지 확인
		boolean isHistoryUpdate = false;
		
		//주요로직 정리함
		// 1. defect_id로 마지막 데이터 가져옵니다.
		// 2. itm_defect table에 imgkey, developer_id, defect_type, defect_code update 진행
		// 3. itm_defect_history table에 developer_id, defect_type, defect_code insert 진행
		// 4. itm_comment table에 댓글 저장 함
		
		// 1. defect_id로 마지막 데이터 가져옵니다.
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectById", reqMap);
		if(list.size() != 1) {
			return response;
		}
		Map<String, Object> preDefectData = (Map<String, Object>) list.get(0);
		String pre_defect_type		= (String) preDefectData.get("defect_type");
		String pre_defect_code 		= (String) preDefectData.get("defect_code");
		String pre_dev_id           = (String) preDefectData.get("dev_id");
		String pre_test_id          = (String) preDefectData.get("test_id");
		
		// 2. itm_defect table에 imgkey, developer_id update 진행
		if( !developer_id.isEmpty() && !developer_id.equals(pre_dev_id)) {
			reqMap.put("defect_code", "B001_02");
			isHistoryUpdate = true;
		}
		if("B001_06".equals(defect_code) && "B001_04".equals(pre_defect_code)) {
			reqMap.put("defect_type", "A001_03");
			isHistoryUpdate = true;
		}
		else {
			reqMap.put("defect_type", pre_defect_type);	
		}
		
		int result = sqlSession.insert("DefectDAO.updateDefectState", reqMap);
		if(result != 1) {
			return response;
		}

		// 3. itm_defect_history table에 developer_id, defect_type, defect_code insert 진행
		if( !defect_code.isEmpty() && !defect_code.equals(pre_defect_code)) {
			isHistoryUpdate = true;
		}
		
		if(isHistoryUpdate) {
			
			reqMap.put("dev_id", developer_id);	
			reqMap.put("test_id", pre_test_id);	
			int result2 = sqlSession.insert("DefectDAO.updateDefectHistory", reqMap);
			if(result2 != 1) {
				return response;
			}
		}
		
		if(!comment.isEmpty()) {
			reqMap.put("type_code", "d");
			reqMap.put("case_id", "0");
			int result2 = sqlSession.update("ScenarioDAO.insertComment", reqMap);
		}
		
		
		pushService.sendPushMessage_defect(defect_id, (String) reqMap.get("cookieUserId"));
		
		
		Message.SetSuccesMsg(response, "update");
		
		/*
		//중요 로직 
		//"B001_06";"결함종료", "B001_07";"결함반려"
		String defect_code = (String) reqMap.get("defect_code");
		
		
		//마지막으로 저장된 test_type_id/defect_code가 일치한 경우 history 테이블에 추가 하지 않습니다.
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectById", reqMap);
		if(list.size() != 1) {
			return response;
		}
		
		Map<String, Object> tempRes = (Map<String, Object>) list.get(0);
		String temp_test_type 	= (String) tempRes.get("test_type");
		String temp_defect_code 	= (String) tempRes.get("defect_code");
		
		//개발자가 미조치건 등록하였고, 현업이 결함 완료 선택시에는 
		//이건은 결함이 아닌 협의완료건으로 처리 됩니다. 
		if("B001_06".equals(defect_code) && "B001_04".equals(temp_defect_code)) {
			reqMap.put("test_type", "A001_03");
		}
		//updateDefect table
		int result = sqlSession.insert("DefectDAO.updateDefect", reqMap);
					
		if( !temp_test_type.equals(reqMap.get("test_type")) || !temp_defect_code.equals(defect_code) ) {
			
			reqMap.put("reg_user", reqMap.get("cookieUserId"));
			int result2 = sqlSession.insert("DefectDAO.insertDefectHistory", reqMap);   //결함이력테이블 데이터 등록
			if(result2 != 1) {
				return response;
			}
			
			if(!temp_defect_code.equals(defect_code)) {
				String defect_id = (String) reqMap.get("defect_id");
				pushService.insertPushDefect(Integer.parseInt(defect_id));
			}
			
		}
		
		if(result == 1) { 
			Message.SetSuccesMsg(response, "update");
		}
		
		*/
		return response;
	}
	
	/*
	 * 개발자가 결함테이블 수정
	 */
	public Map<String, Object> updateDefectByDev( Map<String, Object> reqMap ) {	
		
//		cookieUserId: "D011"
//		defect_code: "B001_03"
//		defect_result: ""
//		defect_user: "D011"
//		defect_user_name: "김태한"
//		description: "V3 설치오류"
//		id: "14"
//		reg_date: "2020-06-11"
//		reg_name: "서대우"
//		test_type: "A001_01"
//		title: "V3 설치오류"
		
		Map<String, Object> response = new HashMap<String, Object>();
		String reg_user = (String) reqMap.get("reg_user");
		String defect_id = (String) reqMap.get("defect_id");
		String defect_code  = (String) reqMap.get("defect_code");
		
		
		//마지막으로 저장된  defect_code가 일치한 경우 history 테이블에 추가 하지 않습니다.
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectById", reqMap);
		if(list.size() != 1) {
			return response;
		}
		
		Map<String, Object> tempRes = (Map<String, Object>) list.get(0);
		String pre_defect_code= (String) tempRes.get("defect_code");	
		if( !defect_code.equals(pre_defect_code)) {
			
			//조치완료 또는 비결함 처리시에 
			//조치일자를 추가해줍니다.
			if("B001_03".equals(defect_code) || "B001_04".equals(defect_code)  ) {
				reqMap.put("resolve", "Y");
			}
			
		}
		
		
		//결함테스트 업데이드
		int result = sqlSession.insert("DefectDAO.updateDefectByDev", reqMap);
		if(result != 1) { 
			return response;
		}
		//결함이력테이블 이력 추가 
		
		
		
		if( !defect_code.equals(pre_defect_code)) {
			reqMap.put("reg_user", reqMap.get("cookieUserId") );
			result = sqlSession.insert("DefectDAO.insertDefectHistory", reqMap);
			if(result != 1) { 
				return response;
			}

			//PUSH 발송하장
			if(defect_id != null) {
				
				//기존 결함 코드와 현재 결함 코드가 다른경우만 발송
				if( !defect_code.equals(pre_defect_code)) {
//					pushService.insertPushDefect(Integer.parseInt(defect_id));
				}
			}
			
			
		}
		Message.SetSuccesMsg(response, "update");
		
		return response;
	}
	
	
	//selectExcuteList
	public Map<String, Object> selectDefectHistory( Map<String, Object> reqMap ) {	
		
		
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectHistory", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	
	
	/**
	 * 결함 담당 개발자 변경
	 *
	 * @param reqMap request 데이터
	 * @return 응답 결과
	 */
	public Map<String, Object> updateDefectDev( Map<String, Object> reqMap ) {	

		Map<String, Object> response = new HashMap<String, Object>();
			String defect_id = (String) reqMap.get("defect_id");
		int result = sqlSession.insert("DefectDAO.updateDefectDev", reqMap);
		if(result != 1) { 
			return response;
		}
		
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectById", reqMap);
		if(list.size() != 1) {
			return response;
		}
		
		Map<String, Object> tempRes = (Map<String, Object>) list.get(0);
		String pre_defect_code= (String) tempRes.get("defect_code");	

		tempRes.put("defect_code", "B001_02"); //배정완료 상태
		tempRes.put("reg_user",    reqMap.get("cookieUserId")); //로그인자
		result = sqlSession.insert("DefectDAO.insertDefectHistory", tempRes);
		if(result != 1) { 
			return response;
		}
		
		Message.SetSuccesMsg(response, "update");
		
//		pushService.insertPushDefect(Integer.parseInt(defect_id));
		
		return response;
	}
	
	
	/**
	 * 개발자 아이디 결함을 전부 조회. 결함(개발자) 화면에서 사용함
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> selectDefectListByCond( Map<String, Object> reqMap ) {	
	
		//{"dev_id":"D001","team_id":"1","cookieUserId":"D001"}
		Map<String, Object> response = new HashMap<String, Object>();
		
		try {
			
			//defect_code_type
			List<Object> list = sqlSession.selectList("DefectDAO.selectDefectListByCond", reqMap);
			
			if(list.size() != -1) {
				Message.SetSuccesMsg(response, "select");
				response.put("list", list);
			}
			
		}
		catch(Exception e) {
//			Message.SetSuccesMsg(response, "select");
		}
		
		return response;
	}
	
	/**
	 * 1건의 결함에 대한 상세조회
	 * 결함 화면에서 사용함
	 *
	 * @param Map (request)
	 * @return Map (response)
	 * @exception 예외사항한 라인에 하나씩
	 */
	public Map<String, Object> selectDefectDetail( Map<String, Object> reqMap ) {	
		

		Map<String, Object> response = new HashMap<String, Object>();
		//defect_id
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectDetailByDefectId", reqMap);
		
		if(list.size() == 1) {
				
//			response.put("list", list);
			
			//1. image key로 이미지 조회 합니다. 
			response = (Map<String, Object>) list.get(0);
			Message.SetSuccesMsg(response, "select");
			
			if(response.get("imgkey") != null) {
				int imgkey;
				try {
					long temp = (Long) response.get("imgkey");
					imgkey = (int) temp;
				}
				catch(ClassCastException e) {
					String temp = (String) response.get("imgkey");
					imgkey = Integer.parseInt(temp);
				}
				
				if(!"-1".equals(imgkey)) {
					List<Object> imgList = sqlSession.selectList("ImgDAO.selectImgById", imgkey);
					if(imgList.size() != -1) {
						response.put("imgList", imgList);
					}
				}
				

				List<Object> commnetList = sqlSession.selectList("ScenarioDAO.selectComment", reqMap);
				if(commnetList.size() != -1) {
					response.put("commnetList", commnetList);
				}
			}
		}
		
		return response;
	}
	
	public Map<String, Object> selectDefectHistroty( Map<String, Object> reqMap ) {	

		//1. image key로 이미지 조회 합니다. 
		List<Object> list = sqlSession.selectList("DefectDAO.selectDefectHistroty", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
}
