package ntm;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class test2 {
	static Map fileMap = new HashMap ();
	
	static int count=0;
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		File file = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\원본2"); 
		try {
			BufferedReader inFile = new BufferedReader(new FileReader(file));
			String sLine = null;
			
			
			while ((sLine = inFile.readLine()) != null) {
				 writeExcel(sLine);
				 count++;
				 
//				 if(count > 5)
//				 break;
			}
			
			
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	private static void writeExcel(String sline) throws IOException {
		
		String sourceName = sline.split("\t")[0];
		String filePath = sline.split("\t")[1];
		String desc = sline.split("\t")[2];
//		String fileName = "FG05_ZZ228_" + sline.split("\t")[0] + "00.xlsx";
		
//		filePath = filePath.replace(".OM_CLIENT.trunk.Android.HIUP.app.", "");

		if(sourceName.indexOf(".xml") != -1) return;
		
		String fileType = filePath.split("\\.")[1];
//		System.out.println(filePath + " : " + fileType + " : " + sourceName);
		
//		if(1==1)		return;
		
		String fileName = "FG05_ZZ228_"  + sline.split("\t")[0] + "_00.xlsx";
		
		System.out.println(fileType + "\t" + fileName);
		if(1==1) return;
//		if( fileMap.get(fileName) == null) {
//			fileMap.put(fileName, "1");
//		}
//		else {
//			System.out.println(fileName);
//		}
//		filePath = filePath.split("HIUP\\app\\")[1];
		
//		System.out.println(fileName);
	
		
//		System.out.println(fileName);
		
//		File OriginFile = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\sample.xlsx"); 
//		System.out.println(fileType + "-" + filePath);
		 File f1 = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\"+fileType+"\\" + fileName);
		 try {
		   f1.createNewFile();
		  } catch (IOException e) {
		   // TODO Auto-generated catch block
		   e.printStackTrace();
		  }
		 f1 = null;
		 
		 
		 fileCopy("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\sample.xlsx", "C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\"+fileType+"\\" + fileName);
		 
//		 FileInputStream fis = new FileInputStream("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileName);
//		 FileOutputStream fos = new FileOutputStream("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileName);
		 
         // 엑셀파일
         File file = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\"+fileType+"\\" + fileName);
         
//         System.out.println(file.exists());
         // 엑셀 파일 오픈
         XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(file));
         
         Cell cell = null;
         
         CellStyle style = wb.createCellStyle();
         XSSFFont font = wb.createFont();
         font.setFontHeightInPoints((short)9);
         
         font.setFontName("굴림체");
         
         
         style.setFont(font);
         // 첫번재 sheet 내용 읽기
         for (Row row : wb.getSheetAt(0)) { 
             // 셋째줄부터..
             if (row.getRowNum() == 2) {
            	 cell = row.createCell(2);
            	 cell.setCellStyle(style);
            	 
            	 cell.setCellValue(desc);
            	 
             }
             if (row.getRowNum() == 1) {
            	 cell = row.createCell(6);
            	 cell.setCellStyle(style);
            	 cell.setCellValue(sourceName);
             }
             if (row.getRowNum() == 4) {
            	 cell = row.createCell(2);
            	 cell.setCellStyle(style);
//            	 cell.setCellValue(filePath.replace(".OM_CLIENT.trunk.Android.HIUP.app.src.gpsTest.java.", "") );
            	 
            	 cell.setCellValue(filePath);
            	 
             }
             if (row.getRowNum() == 5) {
            	 cell = row.createCell(2);
            	 cell.setCellStyle(style);
            	 cell.setCellValue(desc);
             }
//             \OM_CLIENT\trunk\Android\HIUP\app\src\gpsTest\java\kr\co\hi\hiup\db
             // 4번째 셀 값을 변경
             
             if(count % 5 == 0) {
            	 
            	 if (row.getRowNum() == 10) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("boolean");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("isInitialized");
                	 
                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("최초 수행인지 체크");
                 }
            	 
            	 if (row.getRowNum() == 19) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("checkAgent");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("이미수행중인지 확인");
                 }
            	 if (row.getRowNum() == 20) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("checkLatestStoreApp");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("업무앱 최신버전 체크");
                 }
            	 if (row.getRowNum() == 21) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("showApkDownloadAlert");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("버전업데이트 알림");
                 }
            	 
             }
             else if(count % 5 == 1) {
            	 
            	 if (row.getRowNum() == 10) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("LocationDao");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("locationDao");
                	 
                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("Logcation DB 객체");
                 }
            	 
            	 if (row.getRowNum() == 19) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("onCreate");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("activitiy 생성시 호출");
                 }
            	 if (row.getRowNum() == 20) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("startLocationService");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("위치측위 시작");
                 }
            	 if (row.getRowNum() == 21) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("showUploadCounts");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("전송통계 측위");
                 }
            	 if (row.getRowNum() == 22) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("showLocations");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("로케이션 정보 조회");
                 }
            	 
             }
             	else if(count % 5 == 2) {
            	 
            	 if (row.getRowNum() == 10) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("intentFilter");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("intentFilter");
                	 
                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("인텐트 필터");
                 }
            	 if (row.getRowNum() == 11) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("MutableLiveData");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("onReceive");
                	 
                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("리시버 객체 ");
                 }
            	 if (row.getRowNum() == 19) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("registerReceiver");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("리시버 할당");
                 }
            	 if (row.getRowNum() == 20) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("unregisterReceiver");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("리시버 할당취소");
                 }
            	 if (row.getRowNum() == 21) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("onActive");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("리시버 생성시 호출");
                 }
            	 if (row.getRowNum() == 22) {
                	 cell = row.createCell(0);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("onInactive");

                	 cell = row.createCell(2);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("public");
                	 
                	 cell = row.createCell(3);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("void");
                	 

                	 cell = row.createCell(4);
                	 cell.setCellStyle(style);
                	 cell.setCellValue("리시버 종료시 호출");
                 }
            	 
             }
            
             	else if(count % 5 == 3) {
               	 
               	 if (row.getRowNum() == 10) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Int");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("state");
                   	 
                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("블루투스 상태");
                    }
               	 if (row.getRowNum() == 11) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Boolean");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("isSupported");
                   	 
                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("블루투스 기능이 지원이 되는지  ");
                    }
               	 
             	 if (row.getRowNum() == 12) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Boolean");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("isEnabled");
                   	 
                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("블루투스 기능이 사용 가능한지");
                    }
             	 
            	 if (row.getRowNum() == 13) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Boolean");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("isDiscovering");
                   	 
                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("장치 검색 중인지");
                    }
            	 
            	 
               	 if (row.getRowNum() == 19) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("getBondedDevice");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("public");
                   	 
                   	 cell = row.createCell(3);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Object");
                   	 

                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("본드된 장치중에서 특정 주소를 찾음");
                    }
               	 if (row.getRowNum() == 20) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("asAdapterStateLiveData");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("public");
                   	 
                   	 cell = row.createCell(3);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Object");
                   	 

                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("어뎁터 상태 LiveData");
                    }
               	 if (row.getRowNum() == 21) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("asBondStateChangedDeviceLiveData");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("public");
                   	 
                   	 cell = row.createCell(3);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Object");
                   	 

                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("장치 본드 상태 변화 LiveData");
                    }
               	 if (row.getRowNum() == 22) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("asIsDiscoveringLiveData");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("public");
                   	 
                   	 cell = row.createCell(3);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("void");
                   	 

                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("장치검색 상태 변화 LiveData");
                    }
               	 if (row.getRowNum() == 23) {
                   	 cell = row.createCell(0);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("asDiscoveredDeviceLiveData");

                   	 cell = row.createCell(2);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("public");
                   	 
                   	 cell = row.createCell(3);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("Object");
                   	 

                   	 cell = row.createCell(4);
                   	 cell.setCellStyle(style);
                   	 cell.setCellValue("장치 발견시 LiveData");
                    }
                }
             	else {
             		
             		 if (row.getRowNum() == 10) {
                       	 cell = row.createCell(0);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("context");

                       	 cell = row.createCell(2);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("context");
                       	 
                       	 cell = row.createCell(4);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("안드로이드 context");
                        }
             		 if (row.getRowNum() == 19) {
                       	 cell = row.createCell(0);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("buildModels");

                       	 cell = row.createCell(2);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("public");
                       	 
                       	 cell = row.createCell(3);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("Object");
                       	 

                       	 cell = row.createCell(4);
                       	 cell.setCellStyle(style);
                       	 cell.setCellValue("블루투스 디바이스 초기화 클래스");
                        }
             	}
         }
         
         // 엑셀 파일 저장
         FileOutputStream fileOut = new FileOutputStream(file);
         wb.write(fileOut);




	}
	
	public static void fileCopy(String inFileName, String outFileName) {
		  try {
		   FileInputStream fis = new FileInputStream(inFileName);
		   FileOutputStream fos = new FileOutputStream(outFileName);
		   
		   int data = 0;
		   while((data=fis.read())!=-1) {
		    fos.write(data);
		   }
		   fis.close();
		   fos.close();
		   
		  } catch (IOException e) {
		   // TODO Auto-generated catch block
		   e.printStackTrace();
		  }
		 }


}
