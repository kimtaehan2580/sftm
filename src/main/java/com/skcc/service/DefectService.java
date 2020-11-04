package com.skcc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.exceptions.PersistenceException;
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
		
		//1. 결함 테이블 등록 	(itm_defect)
		int id =  sqlSession.selectOne("DefectDAO.selectDefectId"); 
		reqMap.put("defect_id", id);
		
		int result = sqlSession.insert("DefectDAO.insertDefect", reqMap);			//결함테이블 데이터 등록
		
		if(result != 1) {
			return response;
		}
		
		//2. 결함 이력테이블 등록    (itm_defect_history) 결함등록
		reqMap.put("reg_user", reqMap.get("cookieUserId") );
		result = sqlSession.insert("DefectDAO.insertDefectHistory", reqMap);   //결함이력테이블 데이터 등록
		if(result != 1) {
			return response;
		}
		
		//자동배정 로직 추가합니다. 
		//2-1. 개발자가 있는 테스트케이스건의 결함은  자동배정완료 됨 (itm_defect_history) 배정완료
		//결함 등록 안내
				
				
		
		String dev_id = sqlSession.selectOne("DefectDAO.selectTestCaseDevId", reqMap); 
		
		
		if(dev_id == null || "".equals(dev_id) ) {
			//pl 찾아서 PUSH 발송?? 
//			List<HashMap<String,String>> listReader = sqlSession.selectList("ScenarioDAO.selectScenarioInfo", reqMap);
//			if(listReader.size() > 0) {
//				String user_id = listReader.get(0).get("user_id");
////				pushService.insertPushmsg(Message.REG_DEFECT_READER, (String) reqMap.get("title"), user_id);
//			}
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
		
		//결함 PUSH 발송함
		pushService.insertPushDefect( id );
		
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
	public Map<String, Object> updateDefect( Map<String, Object> reqMap ) {	
		
//		case_code: "android_002"
//		cookieUserId: "T002"
//		defect_code: "B001_02"
//		description: "tset"
//		id: 32
//		imgkey: "42"
//		scenario_code: "ANDROID"
//		title: "test"
		
//		UPDATE  sftm.itm_defect
//		SET title = #{title},
//			description = #{description},
//		
//			imgkey = #{ imgkey }::bigint
//			
//		WHERE  id 	= #{id}::bigint
				
		
//		"B001_06";"결함종료"
//		"B001_07";"결함반려"
		
		
		Map<String, Object> response = new HashMap<String, Object>();
		
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
				pushService.insertPushDefect(Integer.parseInt(defect_id));
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
	
	
	
	public Map<String, Object> selectDefectDetail( Map<String, Object> reqMap ) {	

		//1. image key로 이미지 조회 합니다. 
		int imgkey = (Integer) reqMap.get("imgkey");
		List<Object> list = sqlSession.selectList("ImgDAO.selectImgById", imgkey);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
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
		
		pushService.insertPushDefect(Integer.parseInt(defect_id));
		
		return response;
	}
	
	
}
