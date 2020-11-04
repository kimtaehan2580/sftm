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

public class testxml {
	static Map fileMap = new HashMap();

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		File file = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\원본");
		try {
			BufferedReader inFile = new BufferedReader(new FileReader(file));
			String sLine = null;

			while ((sLine = inFile.readLine()) != null) {
				writeExcel(sLine);
//				 break;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void writeExcel(String sline) throws IOException {

		String sourceName = sline.split("\t")[0];
		String filePath = sline.split("\t")[1];
		String desc = sline.split("\t")[2];
//		String fileName = "FG05_ZZ228_" + sline.split("\t")[0] + "00.xlsx";

		filePath = filePath.replace(".OM_CLIENT.trunk.Android.HIUP.app.", "");

		if (sourceName.indexOf(".xml") == -1)
			return;

		String fileType = filePath.split("\\.")[1];
//		System.out.println(filePath + " : " + fileType + " : " + sourceName);

//		if(1==1)		return;

		String fileName = "FG76_ZZ228_" + sline.split("\t")[0] + "_00.xlsx";

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
		File f1 = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileType + "\\" + fileName);
		try {
			f1.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		f1 = null;

		fileCopy("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\xml.xlsx",
				"C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileType + "\\" + fileName);

//		 FileInputStream fis = new FileInputStream("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileName);
//		 FileOutputStream fos = new FileOutputStream("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileName);

		// 엑셀파일
		File file = new File("C:\\Users\\kimtaehan\\Desktop\\인수인계문서\\files\\" + fileType + "\\" + fileName);

//         System.out.println(file.exists());
		// 엑셀 파일 오픈
		XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream(file));

		Cell cell = null;

		CellStyle style = wb.createCellStyle();
		XSSFFont font = wb.createFont();
		font.setFontHeightInPoints((short) 9);

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
			if (row.getRowNum() == 4) {
				cell = row.createCell(6);
				cell.setCellStyle(style);
				cell.setCellValue(sourceName);
			}
			if (row.getRowNum() == 5) {
				cell = row.createCell(2);
				cell.setCellStyle(style);
//            	 cell.setCellValue(filePath.replace(".OM_CLIENT.trunk.Android.HIUP.app.src.gpsTest.java.", "") );

				cell.setCellValue(filePath);

			}
			if (row.getRowNum() == 6) {
				cell = row.createCell(2);
				cell.setCellStyle(style);
				cell.setCellValue(desc);
			}
//             \OM_CLIENT\trunk\Android\HIUP\app\src\gpsTest\java\kr\co\hi\hiup\db
			// 4번째 셀 값을 변경

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
			while ((data = fis.read()) != -1) {
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
