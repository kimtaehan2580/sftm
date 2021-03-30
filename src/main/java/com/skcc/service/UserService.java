package com.skcc.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.mybatis.spring.SqlSessionTemplate;
import org.postgresql.util.PSQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//import com.skcc.controller.UserController;


/*
 * @author  Barack Obama
 * @version 1.0
 * @see     Service
 */
@Service
public class UserService {

	private Logger log = LoggerFactory.getLogger(UserService.class);
	/**
	 * SqlSessionTemplate (Autowired )
	 * 
	 * @see none
	 */
	@Autowired 
	private SqlSessionTemplate sqlSession;
	 
	public Map<String, Object> login( Map<String, Object> reqMap ) {	
		
//		reqMap.put("password", "and us.password = 't001'");
		
		List<Object> list = sqlSession.selectList("UserDAO.selectUser", reqMap);
		Map<String, Object> response = new HashMap<String, Object>();
		
		log.debug("list.size() ; " + list.size());
		if(list.size() ==1) { 
			response =  ( Map<String, Object>) list.get(0);
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 로그인 되었습니다.");
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "로그인에 실패했습니다.");
		}
		return response;
	}
	
	
	/*
	 * Team List 조회 로직
	 */
	public Map<String, Object> selectTeamList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectTeamList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	public Map<String, Object> searchRoleList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectRoleList", reqMap);
		
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> insertNewTeam( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("project_id", 0);
		reqMap.put("reg_user", "admin");
		reqMap.put("modify_user", "admin");
		
		String tema_id = sqlSession.selectOne("UserDAO.selectTeamIdbyName", reqMap);
		
		if( tema_id != null ) {
			response.put("resultCode", "0001");
			response.put("message", "동일한 팀명이 존재합니다.");
			
			return response;
		}
		
		log.error("role_code : " + reqMap.get("role_code"));
		
		int result = sqlSession.insert("UserDAO.insertNewTeam", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> updateTeamInfo( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.update("UserDAO.updateTeam", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	@Transactional 
	public Map<String, Object> deleteTeamInfo( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		

		int result = sqlSession.update("UserDAO.deleteUserByTeam", reqMap);
		if(result > -1) {
			 result = sqlSession.update("UserDAO.deleteTeam", reqMap);
		}
		else {
			
		}
		
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	public Map<String, Object> selectUserList( Map<String, Object> reqMap ) {	
	
		List<Object> list = sqlSession.selectList("UserDAO.selectUserList", reqMap);
		
//		position
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("role_code", reqMap.get("role_code"));
		
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> insertUser( Map<String, Object> reqMap ) {	
		
		
//		birth: "222222"
//		cookieUserId: "D011"
//		name: "22222"
//		organization: "222"
//		password: "2222"
//		phone_num: "010222222"
//		phone_num1: "010"
//		phone_num2: "222222"
//		position: "222"
//		sex: "M"
//		team_id: "8"
//		user_id: "T2222"
		Map<String, Object> response = new HashMap<String, Object>();
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("user_id", reqMap.get("user_id")); 
		List<Object> listUser = sqlSession.selectList("UserDAO.selectUser", queryMap);

		
		if(listUser.size() > 0) {
			response.put("resultCode", "0001");
			response.put("message", "동일한 아이디가 존재합니다.");
			
			return response;
		}
		
		
		
		reqMap.put("project_id", 0);
		reqMap.put("reg_user", 		reqMap.get("cookieUserId"));
		reqMap.put("modify_user",   reqMap.get("cookieUserId"));
		
		try {
			int result = sqlSession.insert("UserDAO.insertUser", reqMap);
			if(result == 1) { 
				response.put("resultCode", "0000");
				response.put("message", "정상적으로 저장되었습니다.");
			}
			else {
				response.put("resultCode", "0001");
				response.put("message", "정상적으로 저장에 실패하였습니다.");
			}
		}
		catch(Exception psql) {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		
		return response;
	}
	
	/*
	 * 사용자 삭제 서비스 
	 */
	@Transactional 
	public Map<String, Object> deleteUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		//삭제 프로세스 
		//1 사용자가 팀장인 경우 팀에 reader 데이터를 삭제함
		//2 사용자가 현업인 경우 등록된 시나리오와 연게를 종료함 (리더가 있는경우 리더에게 전부 전달?)
		//3 사용자가 개발자인 경우 등록된 시나리오와 연게를 종료함 (리더가 있는경우 리더에게 전부 전달?)
		//4 사용자가 현업인 경우 결함담당자를 리더에게 넘김

		
		int result = sqlSession.update("UserDAO.deleteUser", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	@Transactional 
	public Map<String, Object> updateUser( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		reqMap.put("modify_user", "admin");
		
		int result = sqlSession.insert("UserDAO.updateUser", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	
	
	private String getCellString(XSSFCell cell) {
		
		String resultStr = "";
		
		
		if(null != cell) {
			log.debug("cell.getCellType() : " + cell.getCellType());
			switch(cell.getCellType()) {
			
			case FORMULA:
				resultStr = cell.getCellFormula();
				break;
				
			case STRING:
				resultStr = cell.getStringCellValue() + "";
				break;
				
			case NUMERIC:
				resultStr = cell.getNumericCellValue() + "";
				break;
				
			case BLANK:
				resultStr =  "";
				break;
				
			case ERROR:
				resultStr = cell.getErrorCellString() + "";
				break;
			}
		}
		
		
		return resultStr;
	}

	public Map<String, Object> saveUserExcel(MultipartFile excelFile) {

		log.debug("saveUserExcel call " );
		log.debug("saveUserExcel call " );
		log.debug("saveUserExcel call " );
		log.debug("saveUserExcel call " );
		log.debug("saveUserExcel call " );
		
		Map<String, Object> response = new HashMap<String, Object>();
		ArrayList< Map<String, Object> > arrayList = new ArrayList<Map<String, Object> >();
		
		
		//1. xls 파일만 일단 준비하장 
		//파일을 읽기위해 엑셀파일을 가져온다
		FileInputStream fis;
		
		int rowindex=0;
		int columnindex=0;


		try {
			HSSFWorkbook workbook=new HSSFWorkbook( excelFile.getInputStream());
			
			HSSFSheet sheet=workbook.getSheetAt(0);

			//행의 수
			int rows=sheet.getPhysicalNumberOfRows();

//			log.debug("행의 수 : " + rows );
			for(rowindex=3;rowindex<rows;rowindex++){
			    //행을 읽는다
			    HSSFRow row=sheet.getRow(rowindex);
			    if(row !=null){
			        //셀의 수
			        int cells=row.getPhysicalNumberOfCells();
//					log.debug("열의 수 : " + cells );
			        for(columnindex=0;columnindex<=cells;columnindex++){
			            //셀값을 읽는다
			            HSSFCell cell=row.getCell(columnindex);
			            String value="";
			            
			            if(cell==null){
			                continue;
			            }else{
			                //타입별로 내용 읽기
			            	 value=cell.getStringCellValue()+"";
			            }
			            System.out.println("각 셀 내용 :"+value);
			        }
			    }
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		


		
		
		/*
		try {
			OPCPackage opcPackage = OPCPackage.open(excelFile.getInputStream());
			XSSFWorkbook workbook = new XSSFWorkbook(opcPackage);
			// 첫번째 시트 불러오기
            XSSFSheet sheet = workbook.getSheetAt(0);
            
            for(int i=4; i<sheet.getLastRowNum() + 1; i++) {
            	
            	Map<String, Object> tempMap = new HashMap<String, Object>();
            		
                XSSFRow row = sheet.getRow(i);
                // 행이 존재하기 않으면 패스
                if(null == row) {
                    continue;
                }

        		log.debug(getCellString(row.getCell(1)) );
                // 행의 두번째 열(이름부터 받아오기) 
                tempMap.put("user_id", 			getCellString(row.getCell(1)));
                tempMap.put("name", 			getCellString(row.getCell(2)));
                tempMap.put("team", 			getCellString(row.getCell(3)));
                tempMap.put("organization", 	getCellString(row.getCell(4)));
                tempMap.put("position",			getCellString(row.getCell(5)));
                tempMap.put("phone_num", 		getCellString(row.getCell(6)));
                tempMap.put("sex", 				getCellString(row.getCell(7)));
                tempMap.put("birth", 			getCellString(row.getCell(8)));
                

                log.debug(" getCellString(row.getCell(1) : " + getCellString(row.getCell(1)));
                log.debug(" getCellString(row.getCell(6) : " + getCellString(row.getCell(6)));
                
                
                //예외처리 
                tempMap.put("user_id", tempMap.get("user_id").toString().replace(".0", ""));
               
                
                String tempSex = (String) tempMap.get("sex");
                
                if("".equals( tempMap.get("user_id"))) {
                	 tempMap.put("result", "사용자 아이디가 없습니다.");
                     arrayList.add(tempMap);
                     continue;
                }
                
                if("".equals( tempMap.get("name"))) {
                	tempMap.put("result", "사용자 이름이 없습니다.");
                    arrayList.add(tempMap);
                    continue;
                }
                
                if("".equals( tempMap.get("birth"))) {
                	
                	 
                	tempMap.put("result", "사용자 셍년월일이 없습니다.");
                    arrayList.add(tempMap);
                    continue;
                }
                else {
                	tempMap.put("birth", tempMap.get("birth").toString().replace(".0", ""));
                }
                
                if("".equals( tempMap.get("sex"))) {
                	tempMap.put("sex", "T");
                }
                else {
                	
                	if(tempSex.indexOf("남") != -1) {
                    	tempMap.put("sex", "M");
                	}
                	else if(tempSex.indexOf("여") != -1) {
                    	tempMap.put("sex", "F");
                	}
                	else {
                		tempMap.put("sex", "T");
                	}
                }
                if(!"".equals( tempMap.get("phone_num"))) {
                	String tempphone_num = (String) tempMap.get("phone_num");
                	if(tempphone_num.equals("false")) {
                		tempMap.put("phone_num", "");
                	}
                	log.debug("tempphone_num : " + tempphone_num);
                	tempMap.put("phone_num", tempphone_num.replaceAll("-", ""));
                }
                	
                
                
                tempMap.put("reg_user", "admin");
                int result = sqlSession.insert("UserDAO.upsertUser", tempMap);
                if(result == -1) {
                	tempMap.put("result", "원인불명");
                	arrayList.add(tempMap);
                }
                tempMap.put("result", result);
                
            }
            
            
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		*/
		// TODO Auto-generated method stub
		response.put("resultCode", "0000");
		response.put("message", "정상적으로 저장되었습니다.");
		response.put("list", arrayList);
		
		
		return response;
	}
	
	
	public Map<String, Object> updateTeamReader( Map<String, Object> reqMap ) {	
		
		Map<String, Object> response = new HashMap<String, Object>();

		
		int result = sqlSession.insert("UserDAO.updateTeamReader", reqMap);
		if(result == 1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 저장되었습니다.");
		}
		else {
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 저장에 실패하였습니다.");
		}
		return response;
	}
	
	public Map<String, Object> selectTeamUserList( Map<String, Object> reqMap ) {	
		
		List<Object> list = sqlSession.selectList("UserDAO.selectTeamUserList", reqMap);
		
//		position
		Map<String, Object> response = new HashMap<String, Object>();
		if(list.size() != -1) { 
			response.put("resultCode", "0000");
			response.put("message", "정상적으로 조회되었습니다.");
			response.put("list", list);
		}
		else {
			
			response.put("resultCode", "0001");
			response.put("message", "정상적으로 조회에 실패했습니다.");
		}
		return response;
	}
	//
}
