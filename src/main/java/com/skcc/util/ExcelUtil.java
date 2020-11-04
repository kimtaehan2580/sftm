package com.skcc.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.skcc.service.CommonService;

public class ExcelUtil {
	

	private Logger log = LoggerFactory.getLogger(ExcelUtil.class);
	
	
	public static void setCellData(HSSFSheet mySheet, int row, int col, String text, HSSFCellStyle style) {
		
		HSSFCell cell;
		if(mySheet.getRow(row) == null) {
			cell = mySheet.createRow(row).createCell(col);
		}
		else {
			cell = mySheet.getRow(row).createCell(col);
		}
		cell.setCellValue(text); 	//3열 1행
		cell.setCellStyle(style);
	}
	
	public static void setCellData(HSSFSheet mySheet, HSSFRow row, int col, String text, HSSFCellStyle style) {
		
		HSSFCell cell = row.createCell(col);
		cell.setCellValue(text); 	//3열 1행
		cell.setCellStyle(style);
	}
	/*
	 * 
	 */
	public static HSSFDataValidation getCellDropBox(String[] listStr, int firstRow, int firstCol, int lastRow, int lastCol ) {
			
		
		CellRangeAddressList addressList = new CellRangeAddressList();
//      addressList.addCellRangeAddress(3, 3, 1000, 3);
		addressList.addCellRangeAddress(firstRow, firstCol, lastRow, lastCol);
        DVConstraint constraing = DVConstraint.createExplicitListConstraint(listStr);
        HSSFDataValidation dataValidation = new HSSFDataValidation(addressList, constraing);
      
        //공백무시 옵션 true : 무시, false: 무시안함
        dataValidation.setEmptyCellAllowed(false);

        //cell 선택시 설명메시지 보이기 옵션  true: 표시, false : 표시안함
        dataValidation.setShowPromptBox(true);

        //cell 선택시 드롭다운박스 list 표시여부 설정 true : 안보이게, false : 보이게
        dataValidation.setSuppressDropDownArrow(false);

        //오류메시지 생성. 형식에 맞지 않는 데이터 입력시  createErrorBox(String title,String text)
        dataValidation.createErrorBox("Invalid input !", "입력 불가능한 데이터가 입력되엇습니다.");
        
		return dataValidation;
	}
	 
	
	public static ArrayList< Map<String, String> > convertExcelToData(MultipartFile uploadFile) {
		
		ArrayList< Map<String, String> > arrayList = new ArrayList<Map<String, String> >();
		
		//1. xls 파일만 일단 준비하장 
		//파일을 읽기위해 엑셀파일을 가져온다
		FileInputStream fis;
		
		int rowindex=0;
		int columnindex=0;

		try {
			HSSFWorkbook workbook=new HSSFWorkbook( uploadFile.getInputStream());
			
			HSSFSheet sheet=workbook.getSheetAt(0);

			//행의 수
//			int rows = sheet.getPhysicalNumberOfRows();
			int rows = sheet.getLastRowNum() ;
			for(rowindex=4;rowindex<rows+2;rowindex++){
			    //행을 읽는다
			    HSSFRow row=sheet.getRow(rowindex);
			    if(row !=null){
			        //셀의 수
			        int cells=row.getPhysicalNumberOfCells();
			        
			        Map tempMap = new HashMap<String, String>();
			        for(columnindex=0;columnindex<=20;columnindex++){
			            //셀값을 읽는다
			            HSSFCell cell=row.getCell(columnindex);
			            String value="";
			            
			            if(cell==null){
			            	value = "";
			            }else{
			                //타입별로 내용 읽기
//			            	try {
//			            		value=cell.getStringCellValue()+"";
//		            	    } catch(IllegalStateException e) {
//		            	    	value = Integer.toString((int) cell.getNumericCellValue());            
//		            	    }
			            	try {
			            		value=cell.getStringCellValue()+"";
		            	    } catch(IllegalStateException e) {
		            	    	try {
		            	    		value = Integer.toString((int) cell.getNumericCellValue());     
		            	    	}catch(Exception e2) {
		            	    		value = "";
		            	    	}

	            	    	}

			            }
			            tempMap.put("col"+ columnindex, value);
			            
			        }
			        
			        arrayList.add(tempMap);
			        
			    }
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return arrayList;
	}
}
