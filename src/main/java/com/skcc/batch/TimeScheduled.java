package com.skcc.batch;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.skcc.batch.process.B_MakeStatInfo;
import com.skcc.batch.process.B_SendDefectDelay;

@Component
public class TimeScheduled {
	
	private Logger log = LoggerFactory.getLogger(TimeScheduled.class);
	
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;

	@Autowired
	private B_MakeStatInfo _B_MakeStatInfo;
	@Autowired
	private B_SendDefectDelay _B_SendDefectDelay;

	@Value("${excelfile.path}") private String excelFile_Path;

	//통계 일배치
	@Scheduled(cron = "0 0 1 * * *")
	public void batchMakeStatInfo() throws ParseException {
		_B_MakeStatInfo.run();
	}
	
	//결함처리관련 독촉 알림창 보내기
	@Scheduled(cron = "0 0 10 * * *")
	public void batchSendDefectDelay() throws ParseException {
		_B_SendDefectDelay.run();
	}
	
	//매일 23시에 excel 다운로드에 사용했던 파일들 삭제하기
	@Scheduled(cron = "0 0 23 * * *")
	public void deleteExcelFile() {
		
		
		File folder = new File(excelFile_Path);
		try {
			File[] folder_list = folder.listFiles(); //파일리스트 얻어오기
					
			for (int j = 0; j < folder_list.length; j++) {
				folder_list[j].delete(); //파일 삭제 
						
			}
		 } catch (Exception e) {
//			e.getStackTrace();
		}
	}
	
	
	
	
	
	


}
