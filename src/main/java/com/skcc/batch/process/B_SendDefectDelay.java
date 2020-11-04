package com.skcc.batch.process;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.skcc.service.PushService;
import com.skcc.util.ProcessTime;

@Component
public class B_SendDefectDelay {

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
	
	@Autowired
	private PushService pushService;
	 
	public void run() {
		
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.KOREA);
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
		String today = sdf.format(date);

		String yesterday = sdf2.format(date);
		
		log.info("************************************************");
		log.info("Batch Start : ");
		log.info("Batch Name  : 결함 처리 지연건 푸쉬발송 서비스");
		log.info("Batch Time  : " + today );
		log.info("************************************************");
		
		List<Map<String, Object>>  listDelayDefect = null;
		//주말 공휴일에는 제외합니다.
		if(!processTime.isHoliday(date.getTime())) {
			listDelayDefect= sqlSession.selectList("DefectDAO.selectDelayDefect");
		}
		
		for(int k=0; k<listDelayDefect.size(); k++) {

			String defect_code 	= (String) listDelayDefect.get(k).get("defect_code");
			String reg_date_str = (String) listDelayDefect.get(k).get("reg_date_str");
			String title        = (String) listDelayDefect.get(k).get("title");
			long defect_id = (Long) listDelayDefect.get(k).get("defect_id");
			
//			Integer.parseInt((String) reqMap.get("sftm_id"));
		
			try {
				
				long tranTime = processTime.getProcessTime(reg_date_str, today);
				
				log.info("결함 : {} 의 총 소요시간은 {} 입니다." , title, tranTime);
				
				//3일 24시간 이상 지난건에 대해서 PUSH 발송하자
				
				if(tranTime > 1 * 60 *24) {
					log.info("결함 조치 일자가 {} 이므로  결함 {} 의 총 소요시간이가 3일 지났습니다." , reg_date_str, title);
				}
				
				
				//배정완료 또는 결함 반려의 경우 개발자에게 PUSH 발송
				if("B001_02".equals(defect_code) || "B001_07".equals(defect_code)) {
					pushService.insertDelayDefect((int)defect_id);
					
				}
				//조치완료/미개발건은 테스터에서 전달해야지
				else if("B001_03".equals(defect_code) || "B001_04".equals(defect_code)) {
					pushService.insertDelayDefect((int)defect_id);
				}
				// TODO 결함등록-> 배정필요는 일단 보류 정말 귀찮다.. 
				
				else {
					
				}
				
			} catch (ParseException e) {
				continue;
			}
			
		}
		
//		log.info("listDelayDefect : " + listDelayDefect.size());
		
		log.info("************************************************");
		log.info("Batch End");
		log.info("Batch Name : 결함 처리 지연건 푸쉬발송 서비스 " );
		log.info("************************************************");
		
		
	}
}
