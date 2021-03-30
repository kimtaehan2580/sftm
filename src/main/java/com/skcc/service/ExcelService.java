package com.skcc.service;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
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
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.skcc.util.ExcelUtil;

/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 * @desc    액셀파일 다운로드 서비스
 */
@Service
public class ExcelService {

	/**
	 * Logger
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(ExcelService.class);
	
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	

	@Value("${excelfile.path}") private String excelFile_Path;
	
	
	/**
     * 사용자화면 화면에서 액셀 다운로드 기능
     *
     * @param     reqMap  화면에서 입력된 데이터 
     * @return      응답 결과
     * @exception Exception
     *     액셀파일 쓰는 도중 애러 발생시 호출됨
     */
	public Map<String, Object> downloadUserExcel(Map<String, Object> reqMap) {

		Map<String, Object> response = new HashMap<String, Object>();

		List<Object> list = (List<Object>) reqMap.get("list");

		// 액셀파일 설정 하기
		HSSFWorkbook writebook = new HSSFWorkbook();// 새 엑셀파일만들기
		HSSFSheet mySheet = writebook.createSheet("사용자 목록");// 새 시트 만들기 (zone이라는 이름의 시트)

		mySheet.setColumnWidth(3, 7500); // 팀명
		mySheet.setColumnWidth(4, 5000); // 조직
		mySheet.setColumnWidth(6, 8000); // 조직

		int rowIndex = 3;
		// 파일 생성
		HSSFRow row;

		try {

			//////////////////// Title /////////////////////////
			HSSFCell cell;
			row = mySheet.createRow(1);// 행 생성
			row.setHeightInPoints((2 * mySheet.getDefaultRowHeightInPoints()) + 10);
			cell = row.createCell(0);
			cell.setCellValue("1. 사번을 기준으로 저장됩니다. (중복시 업데이트 됨) \n2. 비밀번호는 미입력시 사번으로 대체됩니다.");// 값넣기
			mySheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 9));

			CellStyle cs = writebook.createCellStyle();
			cs.setWrapText(true);
			cell.setCellStyle(cs);

			//////////////////// Header /////////////////////////
			HSSFCellStyle headerStyle = writebook.createCellStyle();
			headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex()); // 배경색
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			headerStyle.setBorderRight(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.THIN);

			ExcelUtil.setCellData(mySheet, 3, 0, "*사번", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 1, "비밀번호", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 2, "*이름", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 3, "*팀명", headerStyle);

			// 모든 팀 정보를 셀렉트 박스에 집어넣음
			List<Object> listTeam = sqlSession.selectList("UserDAO.selectTeamList", null);
			String[] strFormula = new String[listTeam.size()];

			for (int k = 0; k < listTeam.size(); k++) {
				Map<String, String> tempMap = (Map<String, String>) listTeam.get(k);
				strFormula[k] = tempMap.get("name");
			}
			mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula, 3, 3, 1000, 3));

			ExcelUtil.setCellData(mySheet, 3, 4, "조직", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 5, "직급", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 6, "전화번호", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 7, "성별", headerStyle);

			String[] strFormula2 = { "남성", "여성" };
			mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula2, 3, 7, 1000, 7));

			ExcelUtil.setCellData(mySheet, 3, 8, "*생년월일", headerStyle);

			//////////////////// Body /////////////////////////
			HSSFCellStyle bodyStyle = writebook.createCellStyle();

			bodyStyle.setBorderRight(BorderStyle.THIN);
			bodyStyle.setBorderLeft(BorderStyle.THIN);
			bodyStyle.setBorderTop(BorderStyle.THIN);
			bodyStyle.setBorderBottom(BorderStyle.THIN);

			for (int i = 0; i < list.size(); i++) {

				Map<String, String> tempMap = (Map<String, String>) list.get(i);

				row = mySheet.createRow(++rowIndex);// 행 생성

				// 1열 아이디
				cell = row.createCell(0);
				cell.setCellValue(tempMap.get("user_id"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 2열 비밀번호
				cell = row.createCell(1);// 해당 행의 2열
				cell.setCellValue(tempMap.get("password"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 3열 이름
				cell = row.createCell(2);// 해당 행의 2열
				cell.setCellValue(tempMap.get("name"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 4열 팀명
				cell = row.createCell(3);
				cell.setCellValue(tempMap.get("team_name"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 5열 조직
				cell = row.createCell(4);
				cell.setCellValue(tempMap.get("organization"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 6열 직급
				cell = row.createCell(5);
				cell.setCellValue(tempMap.get("position"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 7열 전화번호
				cell = row.createCell(6);
				cell.setCellValue(tempMap.get("phone_num_fomatting"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 8열 성별
				cell = row.createCell(7);
				cell.setCellValue(tempMap.get("sex_fomatting"));// 값넣기
				cell.setCellStyle(bodyStyle);

				// 9열 생년월일
				cell = row.createCell(8);
				cell.setCellValue(tempMap.get("birth"));// 값넣기
				cell.setCellStyle(bodyStyle);
			}

			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd_hhmmss");
			Calendar cal = Calendar.getInstance();
			String fileName = formatter.format(cal.getTime());

			FileOutputStream output = new FileOutputStream(excelFile_Path + "User_" + fileName + ".xls");
			writebook.write(output);// 파일 생성
			
			
			//검증 타입 
			File file = new File(excelFile_Path + "User_" + fileName + ".xls");
			log.debug("파일이 생성되었나요? : " + file.exists());
			output.close();

			response.put("resultCode", "0000");
			response.put("filePath", "User_" + fileName + ".xls");

		} catch (Exception e) {
			e.printStackTrace();
			response.put("resultCode", "0001");
			response.put("filePath", "");
		}

		return response;
	}
	
	/**
     * 업무분류 화면에서 액셀 다운로드 기능
     *
     * @param     reqMap  화면에서 입력된 데이터 
     * @return      응답 결과
     */
	public Map<String, Object> downloadDivExcel( Map<String, Object> reqMap ) {	
		
		// return data 구조
		Map<String, Object> response = new HashMap<String, Object>();
		boolean isErrorList = false;
		
		//업무분류 데이터 조회 
		List<Object> list = null;
		if(reqMap.get("list") != null) {
			list = (List<Object>) reqMap.get("list");
			isErrorList = true;
		}
		else{
			list = sqlSession.selectList("ScenarioDAO.selectScenarioList", reqMap);
		}
		
		HSSFWorkbook writebook = new HSSFWorkbook();//새 엑셀파일만들기
        HSSFSheet mySheet = writebook.createSheet("업무분류 목록");//새 시트 만들기 (zone이라는 이름의 시트)
        
        mySheet.setColumnWidth(1,7500); //팀명 
        mySheet.setColumnWidth(2,7500); //조직
        mySheet.setColumnWidth(3,7500); //조직
        mySheet.setColumnWidth(4,7500); //조직
        
        int rowIndex = 3;
        //파일 생성
        HSSFRow row;
        HSSFCell cell;
      
        try {
        	
        	//////////////////// Title /////////////////////////
			row = mySheet.createRow(1);// 행 생성
			row.setHeightInPoints((2 * mySheet.getDefaultRowHeightInPoints())+10);
			cell = row.createCell(0);
			cell.setCellValue("1. 서브시스템/업무구분 Text가 다른경우 신규로 생성 \n"
					+ "2. key가 입력되지 않으면 대상업무 신규등록.");// 값넣기
			mySheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 9));

			CellStyle cs = writebook.createCellStyle();
			cs.setWrapText(true);
			cell.setCellStyle(cs);
   
			//////////////////// Header /////////////////////////
			HSSFCellStyle headerStyle = writebook.createCellStyle();
			headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex()); // 배경색
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			headerStyle.setBorderRight(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.THIN);

			ExcelUtil.setCellData(mySheet, 3, 0, "key (pk)", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 1, "서브시스템", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 2, "업무구분", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 3, "대상업무", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, 4, "개발팀(콤보)", headerStyle);
			
			if(isErrorList) {
		        mySheet.setColumnWidth(5,9000); //조직
				ExcelUtil.setCellData(mySheet, 3, 5, "실패사유", headerStyle);
			}
         	
         	Map<String, Object> teamReqMap = new HashMap<String, Object>();
         	teamReqMap.put("role_code", "DEV");
         	List<Object> listTeam = sqlSession.selectList("UserDAO.selectTeamList", teamReqMap);
         	String[] strFormula = new String[listTeam.size()];
         	for(int k=0; k<listTeam.size();k++) {
         		Map<String, String> tempMap = (Map<String, String>) listTeam.get(k);
         		strFormula[k] = tempMap.get("name");
         	}
            mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula, 3, 4, 1000, 4));
            
            
            //////////////////// Body /////////////////////////
			HSSFCellStyle bodyStyle = writebook.createCellStyle();

			bodyStyle.setBorderRight(BorderStyle.THIN);
			bodyStyle.setBorderLeft(BorderStyle.THIN);
			bodyStyle.setBorderTop(BorderStyle.THIN);
			bodyStyle.setBorderBottom(BorderStyle.THIN);
		
            for(int i=0;i<list.size();i++) {
	        	
	        	Map<String, String> tempMap = (Map<String, String>) list.get(i);

	        	row = mySheet.createRow(++rowIndex);//행 생성
	        	
	        	int colIndex = 0;
	        	//1열 아이디
	        	cell = row.createCell(colIndex++);
	        	cell.setCellValue(tempMap.get("div_id"));//값넣기
	        	cell.setCellStyle(bodyStyle);
	             
	        	//2열 upup_name
	        	cell = row.createCell(colIndex++);//해당 행의 2열
	        	cell.setCellValue(tempMap.get("upup_name"));//값넣기
	        	cell.setCellStyle(bodyStyle);
	        	
	        	//3열 up_name
	        	cell = row.createCell(colIndex++);//해당 행의 2열
	        	cell.setCellValue(tempMap.get("up_name"));//값넣기
	        	cell.setCellStyle(bodyStyle);
	        	

	        	cell = row.createCell(colIndex++);//해당 행의 2열
	        	cell.setCellValue(tempMap.get("name"));//값넣기
	        	cell.setCellStyle(bodyStyle);
	        	
	        	cell = row.createCell(colIndex++);//해당 행의 2열
	        	cell.setCellValue(tempMap.get("team_name"));//값넣기
	        	cell.setCellStyle(bodyStyle);
	        	
	        	if(isErrorList) {
	        		cell = row.createCell(colIndex++);//해당 행의 2열
		        	cell.setCellValue(tempMap.get("result"));//값넣기
		        	cell.setCellStyle(bodyStyle);
				}
	        	
            } // end for(int i=0;i<list.size();i++) {
            
            SimpleDateFormat formatter = new SimpleDateFormat ("yyyyMMdd_hhmmss");
	        Calendar cal = Calendar.getInstance();
	        String fileName = formatter.format(cal.getTime());
	        
	        if(isErrorList) {
	        	fileName += "_Error";
	        }
	        
	        FileOutputStream output = new FileOutputStream(excelFile_Path + "division_" + fileName + ".xls");
	        writebook.write(output);//파일 생성
	        output.close();
	        
	        response.put("resultCode", "0000");
	        response.put("filePath", "division_" + fileName + ".xls");
	        
	     } catch (Exception e) {
	    	
	    	 response.put("resultCode", "0001");
		     response.put("filePath", "");
	     }

//		searchDivList
		return response;
	}
	

	/**
     * 시나리오 화면에서 액셀 다운로드 기능
     * 3개의 시트로 구성됩니다. (테스트케이스, 참고용_개발자, 참고용_테스터)
     *
     * @param     reqMap  화면에서 입력된 데이터 
     * @return      응답 결과
     * @exception Exception
     *     액셀파일 쓰는 도중 애러 발생시 호출됨
     */
	@SuppressWarnings("unchecked")
	public Map<String, Object> downloadScenarioExcel( Map<String, Object> reqMap ) {	
		
		//return 값 변수
		Map<String, Object> response = new HashMap<String, Object>();
		boolean isErrorExcel 		 = false;
		
		//Test Case List 조회
		List<Object> list = null;
		if(reqMap.get("list") != null) {
			list = (List<Object>) reqMap.get("list");
			isErrorExcel = true;
		}
		else{
			list = sqlSession.selectList("ScenarioDAO.selectTestCaseListForExcel", reqMap);
		}
		
		
		// 신규 액셀파일 생성  3개의 시트로 구성됩니다. (테스트케이스, 참고용_개발자, 참고용_테스터)
		HSSFWorkbook writebook = new HSSFWorkbook();
		
		//sheet 1 테스트 케이스 리스트
		HSSFSheet mySheet = writebook.createSheet("테스트케이스 목록");
		int headerRow = 0;
		mySheet.setColumnWidth(headerRow++,10000); //업무구분값
		mySheet.setColumnWidth(headerRow++,10000); //프로젝트 구분값
		
        mySheet.setColumnWidth(headerRow++,5000); //시나리오 ID
        mySheet.setColumnWidth(headerRow++,7500); //시나리오 명
        //배치여부
        mySheet.setColumnWidth(headerRow++,7500); //화면/배치명
        mySheet.setColumnWidth(headerRow++,10000); //시나리오 상세내용
        mySheet.setColumnWidth(headerRow++,6500); //화면/배치명

        mySheet.setColumnWidth(headerRow++,5000); //케이스 ID
        mySheet.setColumnWidth(headerRow++,7500); //케이스 명
        mySheet.setColumnWidth(headerRow++,10000); //케이스 상세내용

        mySheet.setColumnWidth(headerRow++,5000); //테스터 ID
        mySheet.setColumnWidth(headerRow++,8000); //테스터 ID
        mySheet.setColumnWidth(headerRow++,5000); //테스터 ID
        mySheet.setColumnWidth(headerRow++,8000); //테스터 ID
        mySheet.setColumnWidth(headerRow++,8000); //테스터 ID
        
        if(isErrorExcel) {
            mySheet.setColumnWidth(headerRow++,8000); //결과
        }
        
		//sheet 2,3 vlookup에 사용되는 User 정보
        HSSFSheet testerSheet = writebook.createSheet("참고용_테스터");
        HSSFSheet devSheet    = writebook.createSheet("참고용_개발자");
       
        HSSFRow row;
    	HSSFCell cell;
    	
    	
        try {
        	
        	
        	////////////////////Title /////////////////////////
			row = mySheet.createRow(1);// 행 생성
			row.setHeightInPoints((3 * mySheet.getDefaultRowHeightInPoints())+10);
			cell = row.createCell(0);
			cell.setCellValue("1. 신규 시나리오/테스트케이스 등록시 시나리오/테스트케이스 ID를 비워두셔야 됩니다.\n"
					+ "2. 케이스유형선택시 등록된 유형이 자동 등록됩니다. (개발자, 테스트 입력가능하면 신규건만 가능합니다.)\n"
					+ "3. 단위/통합테스트 구분은 변경이 되지 않습니다. (신규건만 가능합니다.)");// 값넣기
			//단위/통합테스트 구분
			mySheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 9));
		
			CellStyle cs = writebook.createCellStyle();
			cs.setWrapText(true);
			cell.setCellStyle(cs);
	
			////////////////////Header /////////////////////////
			HSSFCellStyle headerStyle = writebook.createCellStyle();
			headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex()); // 배경색
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		
			headerStyle.setBorderRight(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.THIN);
         	
         	//테이블 헤더 내용
			
			int headerColIndex = 0;
			
         	
         	List<Object> listTeam = sqlSession.selectList("ScenarioDAO.selectDivListForExcel", null);
         	String[] strFormula = new String[listTeam.size()];
         	
         	for(int k=0; k<listTeam.size();k++) {
         		Map<String, String> tempMap = (Map<String, String>) listTeam.get(k);
         		strFormula[k] = tempMap.get("div_name");
         	}
         	mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula, 4, headerColIndex, 1000,headerColIndex));
			ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 업무분류 (콤보박스)", headerStyle);

			

			Map<String, Object> queryMap = new HashMap<String, Object>();
			queryMap.put("use_yn", "Y");
			List<Object> listProject = sqlSession.selectList("CodeDAO.selectProjectList", queryMap);
         	String[] strFormulaProject = new String[listProject.size()];
         	
         	for(int k=0; k<listProject.size();k++) {
         		Map<String, Object> tempMap = (Map<String, Object>) listProject.get(k);
         		strFormulaProject[k] = tempMap.get("id")+"-"+ tempMap.get("project_name");
         	}
         	mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormulaProject, 4, headerColIndex, 1000, headerColIndex));
			ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 단위/통합테스트 구분", headerStyle);
         	
         	
			ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "시나리오 ID", headerStyle);
			ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 시나리오 명", headerStyle);
			

         	String[] strFormula2 = {"N", "Y"};
        	mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula2, 4, headerColIndex, 1000, headerColIndex));
			ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 배치여부", headerStyle);
	         	


        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 시나리오 화면/배치명", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "시나리오 설명", headerStyle);
        	
        	
        	List<Object> listType = sqlSession.selectList("CodeDAO.selectTypeGroupList", null);
         	String[] strFormula3 = new String[listType.size() + 1];
         	strFormula3[0] = "직접입력";
         	for(int k=0; k<listType.size();k++) {
         		Map<String, Object> tempMap = (Map<String, Object>) listType.get(k);
         		strFormula3[k+1] = tempMap.get("id") + "-" + tempMap.get("type_group");
         	}
         	mySheet.addValidationData(ExcelUtil.getCellDropBox(strFormula3, 4, headerColIndex, 1000, headerColIndex));
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 케이스유형(콤보박스)", headerStyle);

        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "테스트케이스 ID", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 테스트케이스 명", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "테스트케이스 설명", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 테스터 ID", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "테스터 이름", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "* 개발자 ID", headerStyle);
        	ExcelUtil.setCellData(mySheet, 3, headerColIndex++, "개발자 이름", headerStyle);

         	if(isErrorExcel) {
         		ExcelUtil.setCellData(mySheet, 3, 13, "실패사유", headerStyle);
         	}
         	
         	//열 Index 3부터 시작됩니다. 
         	
         	//////////////////// Body /////////////////////////
			HSSFCellStyle bodyStyle = writebook.createCellStyle();

			bodyStyle.setBorderRight(BorderStyle.THIN);
			bodyStyle.setBorderLeft(BorderStyle.THIN);
			bodyStyle.setBorderTop(BorderStyle.THIN);
			bodyStyle.setBorderBottom(BorderStyle.THIN);
			
        	int rowIndex = 3;
         	//테이블 바디 내용
     		for(int i=0;i<list.size();i++) {
	        	
	        	Map<String, String> tempMap = (Map<String, String>) list.get(i);

	        	row = mySheet.createRow(++rowIndex);//행 생성
	        	
	        	int colIndex = 0;
	        	
	        	//업무분류 (콤보박스)
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("div_name"), bodyStyle);
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("project_id"), bodyStyle);
	        	
	        	// 2번쨰 시나리오 ID
	        	String scenario_id = tempMap.get("scenario_id");
	        	if(scenario_id != null && !"".equals(scenario_id)) {
	        		scenario_id = "scenario_" + scenario_id;
	        	}
	        			
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, scenario_id, bodyStyle);
	        	

	        	// 3번쨰 시나리오 명;
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("scenario_name"), bodyStyle);

	        	// 4번쨰 시나리오 유형
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("is_batch"), bodyStyle);

	        	// 5번쨰 시나리오 유형
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("scenario_code"), bodyStyle);

	        	// 6번쨰 시나리오 명
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("scenario_desc"), bodyStyle);

	        	
	        	//테스트케이스 유횽
	        	String type = tempMap.get("type");
	        	if(type == null || "".equals(type)) {
	        		type = "직접입력";
	        	}
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, type, bodyStyle);
	        	
	        	// 7번쨰 케이스 아이디	
	        	if(tempMap.get("case_id") == null || "".equals(tempMap.get("case_id"))) {
	        		ExcelUtil.setCellData(mySheet, row, colIndex++, "", bodyStyle);
	        	}
	        	else {
		        	// 8번쨰 테스트케이스 ID
		        	String case_id = "case_" + tempMap.get("case_id");
		        	ExcelUtil.setCellData(mySheet, row, colIndex++, case_id, bodyStyle);
	        	}
	        	
	        	// 9번쨰 테스트케이스 명
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("case_name"), bodyStyle);

	        	// 10번쨰 테스트케이스 설명
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("case_desc"), bodyStyle);

	        	// 11번쨰 tester_id
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("tester_id"), bodyStyle);

	        	// 12번쨰 tester_name
	        	cell = row.createCell(colIndex++);
	        	cell.setCellFormula("VLOOKUP(L"+(rowIndex+1)+",참고용_테스터!$A:$B,2,FALSE)");//값넣기
	        	cell.getCellStyle().setLocked(true);
	        	
	        	// 13번쨰 developer_id
	        	ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("developer_id"), bodyStyle);
	        	
	        	// 14번째 developer_name
	        	cell = row.createCell(colIndex++);
	        	cell.setCellFormula("VLOOKUP(N"+(rowIndex+1)+",참고용_개발자!$A:$B,2,FALSE)");//값넣기
	        	cell.getCellStyle().setLocked(true);
	        	
	        	if(isErrorExcel) {
	        		ExcelUtil.setCellData(mySheet, row, colIndex++, tempMap.get("result"), bodyStyle);
	        	}
	        	
            } // end for(int i=0;i<list.size();i++) {
         	
     		
     		
     		
     		//테스터 참고용 

     		testerSheet.setColumnWidth(0,7500); //업무구분값
     		testerSheet.setColumnWidth(1,7500); //시나리오 ID
            
            ExcelUtil.setCellData(testerSheet, 0, 0, "테스터 ID", headerStyle);
            ExcelUtil.setCellData(testerSheet, 0, 1, "테스터 정보", headerStyle);
            
            Map<String, Object> teamReqMap = new HashMap<String, Object>();
         	teamReqMap.put("role_code", "TEST");
         	List<Map<String, String>> listTest = sqlSession.selectList("UserDAO.selectUserList", teamReqMap);
         	int i = 1;
             for(Map<String, String> tempMap : listTest){

            	 int colIndex = 0;
               	 row = testerSheet.createRow(i++);//행 생성
 
               	 ExcelUtil.setCellData(testerSheet, row, colIndex++, tempMap.get("user_id"), bodyStyle);
               	 ExcelUtil.setCellData(testerSheet, row, colIndex++, tempMap.get("team_name") + ":" + tempMap.get("name"), bodyStyle);
	        	
             }

             //개발자 참고용 
             devSheet.setColumnWidth(0,7500); //업무구분값
             devSheet.setColumnWidth(1,7500); //시나리오 ID
//
             ExcelUtil.setCellData(devSheet, 0, 0, "개발자 ID", headerStyle);
             ExcelUtil.setCellData(devSheet, 0, 1, "개발자 정보", headerStyle);
             teamReqMap.put("role_code", "DEV");
             i = 1;
             List<Map<String, String>> listDev = sqlSession.selectList("UserDAO.selectUserList", teamReqMap);
             for(Map<String, String> tempMap : listDev){
//            	 
            	 int colIndex = 0;
               	 row = devSheet.createRow(i++);//행 생성
// 
               	 ExcelUtil.setCellData(devSheet, row, colIndex++, tempMap.get("user_id"), bodyStyle);
               	 ExcelUtil.setCellData(devSheet, row, colIndex++, tempMap.get("team_name") + ":" + tempMap.get("name"), bodyStyle);
            }
     		
         	//파일 쓰기 
         	SimpleDateFormat formatter = new SimpleDateFormat ("yyyyMMdd_hhmmss");
 	        Calendar cal = Calendar.getInstance();
 	        String fileName = formatter.format(cal.getTime());
 	        
 	        if(isErrorExcel) {
 	    	   fileName += "_Error";
 	        }
 	        
 	        FileOutputStream output = new FileOutputStream(excelFile_Path + "scenario_" + fileName + ".xls");
 	        writebook.write(output);//파일 생성
 	        output.close();
 	        
 	        response.put("resultCode", "0000");
 	        response.put("filePath", "scenario_" + fileName + ".xls");
		
        } catch (Exception e) {
        	e.printStackTrace();
        	response.put("resultCode", "0001");
        	response.put("filePath", "");
        }
		
		return response;
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	
	

	/**
     * 사용자 화면에서 액셀 업로드 기능
     *
     * @param     arrayList  액셀파일에서 읽어온 데이터
     * @return      응답 결과
     * @exception Exception
     *     액셀파일 쓰는 도중 애러 발생시 호출됨
     */
	public HashMap<String, Object> uploadExcelUser(ArrayList<Map<String, String>> arrayList) {
		// TODO Auto-generated method stub
		
//		아이디	비밀번호	이름	팀명	조직	직급	전화번호	성별	생년월일
//		D001	D001	이성준	일반계약	프리	대리	010-1111-1111	남성	901010
		//password |user_id |name |phone_num   |sex |organization |position |birth  |team_name |team_id |
		ArrayList< Map<String, String> > failList = new ArrayList<Map<String, String> >();
		int successCnt = 0;
		for(int i=0; i<arrayList.size();i++) {
			Map<String, String> map = (HashMap<String, String>) arrayList.get(i);
			int k = 0;
			
			String user_id 			= map.get("col" + k++);
			String password 		= map.get("col" + k++);
			String name 			= map.get("col" + k++);
			String team_name 		= map.get("col" + k++);
			String organization	 	= map.get("col" + k++);
			String position	 		= map.get("col" + k++);
			String phone_num	 	= map.get("col" + k++);
			String sex	 			= map.get("col" + k++);
			String birth	 		= map.get("col" + k++);
//			{"password":"T002","user_id":"T002","sex":"M","organization":"카카오","name":"임꺽정","birth":"701010","position":"부장","team_id":3,"team_name":"현업1팀"}
			
			Map<String, Object> queryMap = new HashMap<String, Object>();
			
			
			//1 사용자 아이디 (없는 경우 애러처리
			if(user_id == null || user_id.equals("")) {
				map.put("result", "사용자아이디가 없습니다.");
				failList.add(map);
				continue;
			}
			queryMap.put("user_id", user_id);
			
			//2 비밀번호 (없는 경우 사용자 아이디로 대체)
			if(password == null || password.equals("")) {
				queryMap.put("password", user_id);
			}
			else {
				queryMap.put("password", password);
			}
			
			//3 name 
			if(name == null || name.equals("")) {
				map.put("result", "사용자이름이 없습니다.");
				failList.add(map);
				continue;
			}
			queryMap.put("name", name);
			
			
			//4 team_name
			if(team_name == null || team_name.equals("")) {
				map.put("result", "팀정보가 없습니다.");
				failList.add(map);
				continue;
			}
			queryMap.put("team_name", team_name);
//			String organization	 	= map.get("col" + k++);
			
			//5 organization
			queryMap.put("organization", organization);
			
			//6 position
			queryMap.put("position", position);
			
			//7 phone_num
			queryMap.put("phone_num", phone_num.replaceAll("-", ""));
			
			if(sex == null || sex.equals("")) {
				queryMap.put("sex", "T");
            }
            else {
            	
            	if(sex.indexOf("남") != -1) {
            		queryMap.put("sex", "M");
            	}
            	else if(sex.indexOf("여") != -1) {
            		queryMap.put("sex", "F");
            	}
            	else {
            		queryMap.put("sex", "T");
            	}
            }
			
			//3 birth 
			if(birth == null || birth.equals("")) {
				queryMap.put("birth", "000101");
			}
			else {
				queryMap.put("birth", birth);
			}
			
			
			log.debug("");
			 queryMap.put("reg_user", "admin");
             int result = sqlSession.insert("UserDAO.upsertUser", queryMap);
             if(result == -1) {
             	map.put("result", "원인불명");
             	failList.add(map);
             }
             else {
            	 successCnt++;
             }
		}
		
		HashMap<String, Object> response = new HashMap<String, Object>();
//		response.put("resultCode", "0000");
//		response.put("message", successCnt + "건이 저장되었습니다.");
//		response.put("list", failList);
		
		
		response.put("resultCode", "0000");
		response.put("message", "("+successCnt+"/"+ arrayList.size() + ")건이 저장되었습니다.");
		response.put("list", failList);
		return response;
	}
	
	
	/**
     * 업무분류 화면에서 액셀 업로드 기능
     *
     * @param     arrayList  액셀파일에서 읽어온 데이터
     * @return      응답 결과
     * @exception Exception
     *     액셀파일 쓰는 도중 애러 발생시 호출됨
     */
	public HashMap<String, Object> uploadExcelDivision(ArrayList<Map<String, String>> arrayList) {
		
		HashMap<String, Object> response = new HashMap<String, Object>();
		ArrayList< Map<String, String> > failList = new ArrayList<Map<String, String> >();
		int successCnt = 0;
		int k = 0;

		String div_id = "";
		String up_name = "";
		String upup_name = "";
		String div_name = "";
		String team_name = "";
		
		String upup_code = "";
		String up_code = "";
		String tema_id = "";

		Map<String, String> queryMap = new HashMap<String, String>();
		
		for(Map<String, String> tempMap : arrayList){
			
			queryMap.clear();
			 
			k = 0;
			div_id = "";
			up_name = "";
			upup_name = "";
			div_name = "";
			team_name = "";
			tema_id = "";
			
			upup_code = "";
			up_code = "";
			
//			key (pk)	서브시스템	업무구분	대상업무	개발팀(콤보)
//			C0005	자동차업무	자동차계약	배서	자동차계약
			div_id 		= tempMap.get("col" + k++); //key (pk)
			upup_name 	= tempMap.get("col" + k++); //서브시스템
			up_name 	= tempMap.get("col" + k++); //업무구분
			div_name	= tempMap.get("col" + k++); //대상업무
			team_name   = tempMap.get("col" + k++); //개발팀

			if(upup_name == null || upup_name.isEmpty()) {
				tempMap.put("result", "서브시스템값이 비었습니다.");
				failList.add(tempMap);
				continue;
			}
			if(up_name == null || up_name.isEmpty()) {
				tempMap.put("result", "업무구분값이 비었습니다.");
				failList.add(tempMap);
				continue;
			}
			if(div_name == null || div_name.isEmpty()) {
				tempMap.put("result", "대상업무값이 비었습니다.");
				failList.add(tempMap);
				continue;
			}
			
			//1. 서브시스템 text로 key 값 조회
			queryMap.put("name", upup_name);
			queryMap.put("depth", "A");
			upup_code = sqlSession.selectOne("ScenarioDAO.selectDivListForExcel2", queryMap);
			if(upup_code == null ) upup_code = "";
			
			log.debug("1. 서브시스템 text로 key 값 조회 : " + upup_code);
			
			//2. 업무구분 Text + 상위키로 조회
			//(서브시스템 TEXt로 ID가 있는 경우)
			if(	!upup_code.isEmpty()) {
				
				queryMap.put("name", up_name);
				queryMap.put("upcode", upup_code);
				queryMap.put("depth", "B");
				up_code = sqlSession.selectOne("ScenarioDAO.selectDivListForExcel2", queryMap);
				log.debug("2_1. 업무구분 Text + 상위키로 조회 : " + up_code);
			}
			//(서브시스템 TEXT로 ID가 없는 경우)
			else {

				queryMap.put("depth", "A");
				queryMap.put("name", upup_name);
				queryMap.put("upcode", "" );
				queryMap.put("team_id", null);

				upup_code =  sqlSession.selectOne("ScenarioDAO.selectDivisionId", queryMap); 
				queryMap.put("div_id", upup_code);
				log.debug("2_2. 서브시스템 key를 신귫 생성 : " + upup_code);
				int result = sqlSession.insert("ScenarioDAO.insertDivision", queryMap);
				if(result!= 1) {
					tempMap.put("result", "서브시스템 생성에 실패했습니다.");
					failList.add(tempMap);
					continue;
				}
				
				log.debug("2_3. 서브시스템 key로 저장 완료 " );
			}
			
			
			queryMap.put("depth", "B");
			queryMap.put("name", up_name);
			queryMap.put("upcode", upup_code);
			queryMap.put("team_id", null);
			
			//(조회한 업무구분값이 없는 경우)
			if(up_code==null || up_code.isEmpty()) {
				up_code =  sqlSession.selectOne("ScenarioDAO.selectDivisionId", queryMap); 
				log.debug("3_1. 업무구분값이 key를 신귫 생성 : " + up_code);
				
				queryMap.put("div_id", up_code);
				int result = sqlSession.insert("ScenarioDAO.insertDivision", queryMap);
				
				if(result!= 1) {
					tempMap.put("result", "업무구분값이 생성에 실패했습니다.");
					failList.add(tempMap);
					continue;
				}
				log.debug("2_3. 업무구분값이 key로 저장 완료 " );
				
			}
			
			if( !team_name.isEmpty()) {
				queryMap.put("name", team_name);
				tema_id = sqlSession.selectOne("UserDAO.selectTeamIdbyName", queryMap); 
			}
			
			
			
			//업무구분값 체크 
			boolean isInsert = false;
			if(div_id.isEmpty()) {
				

				queryMap.put("depth", "C");
				queryMap.put("name", div_name);
				queryMap.put("upcode", up_code);
				queryMap.put("team_id", tema_id);
				
				//동일한 업무구분 key 값과 동일한 대상업무 text의 경우 업데이트건으로 변환 
				div_id = sqlSession.selectOne("ScenarioDAO.selectDivListForExcel2", queryMap);
				if(div_id == null) {
					isInsert = true;
					div_id =  sqlSession.selectOne("ScenarioDAO.selectDivisionId", queryMap);
					log.debug("4_1. 대상업무 key를 신귫 생성 : " + div_id);
					
					queryMap.put("div_id", div_id);
					int result = sqlSession.insert("ScenarioDAO.insertDivision", queryMap);
					
					if(result!= 1) {
						tempMap.put("result", "대상업무 생성에 실패했습니다.");
						failList.add(tempMap);
						continue;
					}
					log.debug("4_1. 대상업무 key로 저장 완료 " );
				}
				
			}
			
			if( !isInsert ) {

				queryMap.put("depth", "C");
				queryMap.put("name", div_name);
				queryMap.put("upcode", up_code);
				queryMap.put("team_id", tema_id);
				queryMap.put("div_id", div_id);
				
				int result = sqlSession.insert("ScenarioDAO.updateDivision", queryMap);
				if(result!= 1) {
					tempMap.put("result", "대상업무 업데이트 실패했습니다..");
					failList.add(tempMap);
					continue;
				}
			}
			
			successCnt++;
		} //for(Map<String, String> tempMap : arrayList){
		
		response.put("resultCode", "0000");
		response.put("message", "("+successCnt+"/"+ arrayList.size() + ")건이 저장되었습니다.");
		response.put("list", failList);
		return response;
	}
	
	
	
	/**
     * 시나리오 화면에서 액셀 업로드 기능
     * 3개의 시트로 구성됩니다. (테스트케이스, 참고용_개발자, 참고용_테스터)
     *
     * @param     arrayList  액셀파일에서 읽어온 데이터
     * @return      응답 결과
     * @exception Exception
     *     액셀파일 쓰는 도중 애러 발생시 호출됨
     */
	public HashMap<String, Object> uploadExcelScenario(ArrayList<Map<String, String>> arrayList) {
		
		
		HashMap<String, Object> response = new HashMap<String, Object>();
		ArrayList< Map<String, String> > failList = new ArrayList<Map<String, String> >();
		int successCnt = 0;
		Map<String, String> scenarioCheckMap = new HashMap<String, String>();
		Map<String, String> caseCheckMap = new HashMap<String, String>();
		
		int k = 0;
		String div_name 		= "";
		String scenario_id 		= "";
		String scenario_name 	= "";
		String is_batch	 		= "";
		String scenario_code    = "";
		String scenario_desc    = "";
		String type_group 		= "";
		String case_id 			= "";
		String case_name = "";
		String project_id = "";
		
		
		//1차 validation 정리함
		for(Map<String, String> tempMap : arrayList){
			
			k = 0;
			
			//validation check 
			//scenario key validation
			div_name 		= tempMap.get("col" + k++); //업무구분 값
			project_id	= tempMap.get("col" + k++); //업무구분 값
			scenario_id 	= tempMap.get("col" + k++); //시나리오 ID
			scenario_name 	= tempMap.get("col" + k++); //시나리오 명
			is_batch	 	= tempMap.get("col" + k++); //배치여부
			scenario_code   = tempMap.get("col" + k++); //시나리오 화면/배치명
			scenario_desc   = tempMap.get("col" + k++); //시나리오 상세내용
			type_group      = tempMap.get("col" + k++); //시나리오 유형
			case_id 		= tempMap.get("col" + k++); //시나리오 상세내용
			case_name       = tempMap.get("col" + k++); //시나리오 상세내용
			String checkScenarioStr = div_name+scenario_name+is_batch+scenario_code+scenario_desc;
			//시나리오 아이디로 등록된 검증 데이터가 없는 경우
			
			if(scenario_id.isEmpty()) {
				scenario_id = scenario_name;
			}
			if(scenarioCheckMap.get(scenario_id) == null) {
				scenarioCheckMap.put(scenario_id, checkScenarioStr);
			}
			else if(!checkScenarioStr.equals(scenarioCheckMap.get(scenario_id))) {
				//1건이라도 다른 데이터가 있는 경우 제외합니다.
				response.put("resultCode", "0001");
				response.put("message", "시나리오 (" + scenario_name + ")에 상이한 데이터가 존재합니다.");
				return response;
			}
			
			if(case_id.isEmpty()) {
				case_id = scenario_id + case_name;
			}
			else if(caseCheckMap.get(case_id)==null) {
				caseCheckMap.put(case_id, "Y");
			}
			else {
				response.put("resultCode", "0001");
				response.put("message", "중복된 케이스 id가 존재합니다.");
				return response;
			}
		}

		//업무구분 데이터 조회 하기
		List<Object> listDiv = sqlSession.selectList("ScenarioDAO.selectDivListForExcel", null);
		Map<String, String> divMap = new HashMap<String, String>();
		for(int kk=0; kk<listDiv.size();kk++) {
     		Map<String, String> tempMap = (Map<String, String>) listDiv.get(kk);
     		divMap.put(tempMap.get("div_name"), tempMap.get("div_id"));
     	}
		
		String case_desc = "";
		String test_id = "";
		String dev_id = "";
		
		String div_id = "";
		//2차 데이터 업데이트 및 저장하기
		
		//senario_id 중복 방지
		scenarioCheckMap = new HashMap<String, String>();
		
		Map<String, Integer> scenarioInsertMap = new HashMap<String, Integer>();
		
		for(Map<String, String> tempMap : arrayList){
			
			boolean isInsertSc = false;
			boolean isInsertTc = false;
			
			k = 0;
//			업무구분 값 (선택)	시나리오 ID	시나리오 명	배치여부	시나리오 화면/배치명	시나리오 상세내용	케이스 ID	케이스 명	케이스 상세내용	테스터 ID	테스터 수정불가	개발자 ID	개발자 수정불가
//			자동차업무-자동차계약-가입설계	scenario_1	주요보종가입설계	N	CLUZ001M	주요보종가입설계 화면	case_2	대리운전 가입설계 1	대리운전 가입설계 1	T001	현업1팀:홍길동	D001	자동차계약:이성준
			//validation check 
			//scenario key validation
			Map<String, String> queryMapSc = new HashMap<String, String>();
			Map<String, String> queryMapTc = new HashMap<String, String>();
			div_name 		= tempMap.get("col" + k++); //업무구분 값
			project_id	= tempMap.get("col" + k++); //업무구분 값
			

			scenario_id 	= tempMap.get("col" + k++); //시나리오 ID
			
			scenario_id     = scenario_id.replace("scenario_", "");
			scenario_name 	= tempMap.get("col" + k++); //시나리오 명
			is_batch	 	= tempMap.get("col" + k++); //배치여부
			scenario_code   = tempMap.get("col" + k++); //시나리오 화면/배치명
			scenario_desc   = tempMap.get("col" + k++); //시나리오 상세내용


			type_group      = tempMap.get("col" + k++); //시나리오 유형
			
			case_id 		= tempMap.get("col" + k++); //시나리오 상세내용
			case_id     	= case_id.replace("case_", "");
			case_name    	= tempMap.get("col" + k++); //케이스 명
			case_desc    	= tempMap.get("col" + k++); //케이스 명
			test_id       	= tempMap.get("col" + k++); //케이스 명
			k++;
			dev_id      	= tempMap.get("col" + k++); //케이스 명
			
			div_id = divMap.get(div_name);
			if("".equals(div_name) || div_id == null ) {
				tempMap.put("result", "업무구분코드가 잘못되었습니다.");
				failList.add(tempMap);
				continue;
			}
			
			//이거는 없어도 됨
			if( scenario_name.isEmpty()  ) {
				tempMap.put("result", "시나리오 명이 없습니다.");
				failList.add(tempMap);
				continue;
			}

			if( is_batch.isEmpty()  ) {
				is_batch = "N";
			}
			
			//Test Case 정리
			if(case_name.isEmpty() && !case_id.isEmpty()) {
				tempMap.put("result", "테스트 케이스 명이 없습니다.");
				failList.add(tempMap);
				continue;
			}
			
			String[] project_values = project_id.split("-");
			if(project_values.length < 2) {
				tempMap.put("result", "테스트구분설정이 정상적으로 되지 않았습니다.");
				failList.add(tempMap);
				continue;
			}
			project_id = project_values[0];
			
			//시나리오 ID 없고, 
			if( scenario_id.isEmpty()  ) {
				
				//이전에 동일한 시나리오 명으로 등록되지 않을떄
				if(scenarioCheckMap.get(scenario_name) == null) {
					scenario_id = "" + sqlSession.selectOne("ScenarioDAO.selectScenarioId"); 
					scenarioCheckMap.put(scenario_name, scenario_id);
					isInsertSc = true;
				}
				//동일한 시나리오명으로 등록시 (기존내용 유지)
				else {
					scenario_id = scenarioCheckMap.get(scenario_name);
				}
			}
			
			
			
			//test case 생성
			if(case_id.isEmpty() && !case_name.isEmpty() ) {
				 case_id =  "" + sqlSession.selectOne("ScenarioDAO.selectTestcaseId"); 
				 isInsertTc = true;
			}

			queryMapSc.put("scenario_id", scenario_id);
			queryMapSc.put("project_id", project_id);
			
			
			queryMapSc.put("scenario_name", scenario_name);
			queryMapSc.put("scenario_code", scenario_code);
			queryMapSc.put("div_id", div_id);
			queryMapSc.put("description", scenario_desc);
			queryMapSc.put("is_batch", is_batch);
			queryMapSc.put("cookieUserId", "admin");
			
			int result  = 0;
			
			//신규 scenario
			if(scenarioInsertMap.get(scenario_id)!=null) {
				result = scenarioInsertMap.get(scenario_id);
			}
			else if(isInsertSc) {
				result = sqlSession.insert("ScenarioDAO.insertScenario", queryMapSc);
				scenarioInsertMap.put(scenario_id,   result);
			}
			//수정 scenario
			else {
				result = sqlSession.insert("ScenarioDAO.updateScenario", queryMapSc);
				scenarioInsertMap.put(scenario_id,  result);
			}
			if(result != 1) {
				tempMap.put("result", "시나리오 Table 원인 불명 오류발생");
				failList.add(tempMap);
				continue;
			}
			
			if( type_group == null || "직접입력".equals(type_group)) {
				type_group = "";
			}
			//type_group
			if(case_id.isEmpty() && case_name.isEmpty() && "".equals(type_group) ) {
				successCnt++;
				continue;	
			}
			
			if("".equals(type_group)) {
				
				queryMapTc.put("scenario_id", scenario_id);
				queryMapTc.put("case_id", case_id);
				queryMapTc.put("case_name", case_name);
				queryMapTc.put("description", case_desc);
				queryMapTc.put("tester_id", test_id);
				queryMapTc.put("dev_id", dev_id);	
				
				result  = 0;
				if(isInsertTc) {
					result = sqlSession.insert("ScenarioDAO.insertTestcase", queryMapTc);
				}
				else {
					result = sqlSession.insert("ScenarioDAO.updateTestcase", queryMapTc);
				}
//				
				if(result != 1) {
					tempMap.put("result", "테스트케이스 Table 원인 불명 오류발생");
					failList.add(tempMap);
					continue;
				}
				successCnt++;
			}
			//테스트케이스 유형
			else {
				
				//테스트케이스 유형 정보 조회
				String id = type_group.substring(0, type_group.indexOf("-"));
				
				Map<String, Object> queryMap = new HashMap<String, Object>();
				queryMap.put("id", id); 
				List<Map<String, Object>> listTest =  sqlSession.selectList("CodeDAO.selectTypeList", queryMap);
	         	for(Map<String, Object> tempMap2 : listTest){
	         		
	         		int case_id2 =  sqlSession.selectOne("ScenarioDAO.selectTestcaseId"); 
	         		String case_name2 = (String) tempMap2.get("case_name");
	         		String case_desc2 = (String) tempMap2.get("case_desc");
	         		
	         		case_name2 = case_name2.replaceAll("\\{\\#\\}", scenario_name);
	         		case_desc2 = case_desc2.replaceAll("\\{\\#\\}", scenario_name);
	         		
	         		
	        		queryMap.put("scenario_id", 	scenario_id);
	        		queryMap.put("case_id", 		case_id2);
	        		queryMap.put("case_name", 		case_name2);
	        		queryMap.put("description", 	case_desc2);
	        		queryMap.put("tester_id", 		test_id);
	        		queryMap.put("dev_id", 			dev_id);
	        		
	        		try {
	        			int result2 = sqlSession.insert("ScenarioDAO.insertTestcase", queryMap);
	        			if(result2 != 1) {
	        				tempMap.put("result", "테스트케이스 Table 원인 불명 오류발생");
	    					failList.add(tempMap);
	    					successCnt--;
	    					break;
	        			}
	        			
	        		}
	        		catch(Exception e) {
//	        			Message.SetSuccesMsg(response, "select");
	        		}
				}
	         	
	         	successCnt++;
			}
		}
		response.put("resultCode", "0000");
		response.put("message", "("+successCnt+"/"+ arrayList.size() + ")건이 저장되었습니다.");
		response.put("list", failList);
		
		return response;
		
	}
	
	
}
