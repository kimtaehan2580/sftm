package com.skcc.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.skcc.util.ExcelUtil;
import com.skcc.util.Message;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 * 
 * 공통으로 사용하는 전문 모음 (file up/down 비롯해서 사용됨)
 */
@Service
public class CommonService {

	private Logger log = LoggerFactory.getLogger(CommonService.class);
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
	
	@Value("${excelfile.path}") private String excelFile_Path;
	/**
	 * 파일 업로드 
	 *
	 * @param MultipartHttpServletRequest (request)
	 * @return HashMap (img_key)
	 * @exception 예외사항한 라인에 하나씩
	 */
	@Transactional 
	public String uploadMutipartFile(MultipartHttpServletRequest mtfRequest) {
		log.info("uploadMutipartFile CALL"  );
		HashMap<String, Object> response = new HashMap<String, Object>();
		
		String fileLength = mtfRequest.getParameter("fileLength");
		if(fileLength == null) {
			fileLength = "0";
		}
		 
		int count = Integer.parseInt(mtfRequest.getParameter("fileLength"));
		int resImgKey = -1;
		
		log.info("uploadMutipartFile count : " + count  );
		if(count > 0) {
			

			String resImgKeys = mtfRequest.getParameter("imgkey");
			String crud = mtfRequest.getParameter("crud");
			
			if(resImgKeys != null && !"".equals(resImgKeys) && Integer.parseInt(resImgKeys) > 0) {
				resImgKey = Integer.parseInt(resImgKeys);
			}
			else {
				resImgKey = sqlSession.selectOne("ImgDAO.selectImgId"); 
			}
			//이미지키 조회
			//key는 중복처리 되지 않게 커밋 작업
			log.info("uploadMutipartFile resImgKey : " + resImgKey  );
			
			String tbname = mtfRequest.getParameter("tbname");
			response.put("imgkey", resImgKey);
			response.put("crud", crud);
			response.put("tbname", tbname);
			for (int i = 0; i < count; i++) {
				
				Map<String, Object> reqMap = new HashMap<String, Object>();
				MultipartFile mf = mtfRequest.getFile("file" + i);
				
				
				String originFileName = mf.getOriginalFilename(); // 원본 파일 명
				long fileSize = mf.getSize(); // 파일 사이즈

				String[] fileNameList = originFileName.split("\\.");
				String ext = "";
				
				if(fileNameList.length > 1) {
					ext = fileNameList[fileNameList.length-1];
				}
				String safeFile = mtfRequest.getParameter("user_id") + "_" + System.currentTimeMillis() + "." + ext;
				SimpleDateFormat mSimpleDateFormat = new SimpleDateFormat ( "yyyyMMdd", Locale.KOREA );
				Date currentTime = new Date ();
				String mTime = mSimpleDateFormat.format ( currentTime );

				
				reqMap.put("id", resImgKey);
				reqMap.put("tbName", tbname);
				reqMap.put("tbDate", mTime);
				reqMap.put("saveFileName", safeFile);
				reqMap.put("originFileName", originFileName);
				reqMap.put("fileLength", fileSize);
				reqMap.put("user_id", mtfRequest.getParameter("user_id"));
				reqMap.put("ext", ext);
				
					
				try {
					
					log.info("reqMap : " + reqMap.toString());
					mf.transferTo(new File(file_Path + "//" + safeFile));
					int result = sqlSession.insert("ImgDAO.insertImg", reqMap);
					

					log.info("result : " + result);
					
//					{"imgId":10}
				} catch (IllegalStateException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} // for(int i=0; i< count ; i++) {		
//			Message.SetSuccesMsg(response, "upload");	
//			log.info("response : " + response.toString());
		}
	
		return resImgKey + "";
	}
	
	public Map<String, Object> selectImg( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("ImgDAO.selectImg", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			Message.SetSuccesMsg(response, "select");
			response.put("list", list);
		}
		return response;
	}
	
	
	/*
	 * insertAutoRecording -> chrom extention에서 전송한 데이터
	 */
	public HashMap<String, Object> insertAutoRecording(Map<String, Object> reqMap) {
		// TODO Auto-generated method stub
		
		
		String htmlFileStr = (String) reqMap.get("htmlFileStr");

//		int sftm_case_id = Integer.parseInt((String) reqMap.get("sftm_case_id"));
//		int sftm_defect_id = Integer.parseInt((String) reqMap.get("sftm_defect_id"));

		String sftm_case_id   = (String) reqMap.get("sftm_case_id");
		String sftm_defect_id = (String) reqMap.get("sftm_defect_id");
		
		
		if(!sftm_defect_id.isEmpty()) {
			reqMap.put("defect_id",  Integer.parseInt(sftm_defect_id));
		}
		else {
			reqMap.put("defect_id", -1);
		}
		if(!sftm_case_id.isEmpty()) {
			reqMap.put("case_id",  Integer.parseInt(sftm_case_id));
		}
		else {
			reqMap.put("case_id", -1);
		}
		
		reqMap.put("reg_user", reqMap.get("sftm_user_id"));
		reqMap.put("html", reqMap.get("htmlFileStr"));
		reqMap.put("title", reqMap.get("sftm_title"));
		
		
		
		HashMap<String, Object> response = new HashMap<String, Object>();
		int result = sqlSession.insert("PushDAO.insertAuto", reqMap);
		
		
		if(result == 1) {
			Message.SetSuccesMsg(response, "insert");
//			pushService.insertPushDefectAutoTest((int) defect_id, (String)reqMap.get("sftm_user_id"));
		}
		
		return response;
	}
	
	
}
