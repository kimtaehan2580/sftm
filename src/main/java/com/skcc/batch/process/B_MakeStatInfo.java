package com.skcc.batch.process;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.skcc.util.ProcessTime;

@Component
public class B_MakeStatInfo {
	

	private Logger log = LoggerFactory.getLogger(B_MakeStatInfo.class);
	
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	
	@Autowired
	private ProcessTime processTime;

	public void run() throws ParseException {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.KOREA);
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
		String today = sdf.format(date);

		String yesterday = sdf2.format(date);
		log.info("************************************************");
		log.info("Batch Start : ");
		log.info("Batch Name : 일마감 통계 배치 : (기준일자 :  "+ today + ")");
		log.info("Batch Time : " + yesterday);
		log.info("************************************************");
		
		
	
		
		List<Map<String, Object>>  listUser = sqlSession.selectList("StatDAO.selectStatUserListBatch");
		
		Map<String, Object> deleteQueryMap = new HashMap<String, Object>();
		deleteQueryMap.put("base_date", yesterday);
		
		int result1 = sqlSession.update("StatDAO.deleteStatBatch", deleteQueryMap);
		
		for(int i=0; i<listUser.size(); i++) {
			
			Map<String, Object> queryMap =  listUser.get(i);
			Long defect_cnt = (Long) queryMap.get("defect_cnt");
			if(defect_cnt == 0L) {
				
				queryMap.put("sum_time", "0");
				queryMap.put("tran_cnt", "0");
				queryMap.put("base_date", yesterday);

				int result2 = sqlSession.insert("StatDAO.insertStatBatch", queryMap);
				
				continue;
			}
			
			List<Map<String, Object>>  listDefect = sqlSession.selectList("StatDAO.selectUserDefectListBatch", queryMap);
			
			
			String preDefect_id = "";
			String defect_id    = "";	
			String defect_code  = "";
			String reg_date_str = "";
			String startTime = "";
			String skipDefect_id = "";
//			String[] listProcessTime = [];
			ArrayList listProcessTime = new ArrayList();
			
			for(int k=0; k<listDefect.size(); k++) {

				defect_id  		= (String) listDefect.get(k).get("defect_id");
				defect_code 	= (String) listDefect.get(k).get("defect_code");
				reg_date_str    = (String) listDefect.get(k).get("reg_date_str");
				
				//일단 토일요일만 이라도 제외하자
				//09~18시까지만 취급함
				log.info(" defect_id : " + defect_id);
				log.info(" defect_code : " + defect_code);
				log.info(" reg_date_str : " + reg_date_str);
				
				if(skipDefect_id.equals(defect_id)) {
					continue;
				}
				
				if( !preDefect_id.equals(defect_id)) {
					
					//다른 defect_id인데 
					if(!"".equals(startTime)) {
						listProcessTime.add(processTime.getProcessTime(startTime, today));
					}
					startTime = "";
					preDefect_id = defect_id;
				}
				
				//B001_02	배정완료
				//B001_07	결함반려
				//의 경우 시간체크 를 시작합니다. 
				if( "B001_02".equals(defect_code) || "B001_07".equals(defect_code)) {
					startTime = reg_date_str;
				}
				
				//개발지연건은 대상에서 완전 제외해야됩니다. 
				else if( "B001_05".equals(defect_code)) {
					
					skipDefect_id = defect_id;
					startTime = "";
					preDefect_id = defect_id;
				}
				
//				B001_03	조치완료	Y	20	admin	2020-09-01
//				B001_04	미조치건	Y	30	admin	2020-09-01
				//조치된건으로 처리 됨
				if( "B001_03".equals(defect_code) || "B001_04".equals(defect_code)) {
					if(!"".equals(startTime)) {
						listProcessTime.add(processTime.getProcessTime(startTime, reg_date_str));
					}
					startTime = "";
				}
			} //for(int k=0; k<listDefect.size(); k++) {
			
			//다른 defect_id인데 
			if(!"".equals(startTime)) {
				listProcessTime.add(processTime.getProcessTime(startTime, today));
			}
			
			long sum_time = 0;
			for(int k=0; k<listProcessTime.size();k++) {
				log.debug("결과 : " + listProcessTime.get(k) + "");
				sum_time += (Long) listProcessTime.get(k);
			}
			
			queryMap.put("sum_time", sum_time);
			queryMap.put("tran_cnt", listProcessTime.size());
			queryMap.put("base_date", yesterday);
			
			 
			log.debug("김태한 결과 : " + queryMap.toString());
			
			int result2 = sqlSession.insert("StatDAO.insertStatBatch", queryMap);
			
		}
		

		log.info("************************************************");
		log.info("Batch End");
		log.info("Batch Name : 일마감 통계 배치 " );
		log.info("************************************************");
		
	}
	
	
	
	

}
