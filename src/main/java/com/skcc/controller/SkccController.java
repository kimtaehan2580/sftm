package com.skcc.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.skcc.service.BorderService;
import com.skcc.service.CodeService;
import com.skcc.service.CommonService;
import com.skcc.service.DefectService;
import com.skcc.service.ExcelService;
import com.skcc.service.PushService;
import com.skcc.service.ScenarioService;
import com.skcc.service.StatService;
import com.skcc.service.UserService;
import com.skcc.util.ExcelUtil;

/**
 * @author Barack Obama
 * @version 1.0
 * @see Controller
 */
@Controller
public class SkccController {

	/**
	 * log4j 선언
	 * 
	 * @see none
	 */
	private Logger log = LoggerFactory.getLogger(SkccController.class);

	/**
	 * Service 전체
	 * @see Autowired
	 */
	@Autowired
	private UserService userService;
	@Autowired
	private DefectService defectService;
	@Autowired
	private ScenarioService scenarioService;
	@Autowired
	private CodeService codeService;
	@Autowired
	private CommonService commonService;
	@Autowired
	private StatService statService;
	@Autowired
	private ExcelService excelService;
	@Autowired
	private PushService pushService;
	@Autowired
	private BorderService boderService;

	//첨부파일 저장공간
	@Value("${file.path}") private String file_Path;
	
	//excel download 임시 저장 공간
	@Value("${excelfile.path}") private String excelFile_Path;
	
	/**
	 * .do 트랜잭션 기본이 되는 서비스 형태
	 *
	 * @param reqMap http요청 request
	 * @return http요청 response
	 * @exception @see
	 */
	@RequestMapping("/*/*.do")
	@ResponseBody
	public HashMap<String, Object> doRequest(HttpServletRequest req, @RequestBody Map<String, Object> reqMap) {

		HashMap<String, Object> response = null;
		Class<?>[] paramTypes = { Map.class };
		try {

			String reqUrl = req.getRequestURI();

			String funcName = reqUrl.substring(reqUrl.lastIndexOf("/") + 1).replace(".do", "");
			String subDir = reqUrl.split("/")[2];

			Object service = null;

			if ("code".equals(subDir)) {
				service = codeService;
			} else if ("defect".equals(subDir)) {
				service = defectService;
			} else if ("scenario".equals(subDir)) {
				service = scenarioService;
			} else if ("user".equals(subDir)) {
				service = userService;
			} else if ("stat".equals(subDir)) {
				service = statService;
			} else if ("excel".equals(subDir)) {
				service = excelService;
			} else if ("push".equals(subDir)) {
				service = pushService;
			} else if ("border".equals(subDir)) {
				service = boderService;
			} else {
				// 잘못된 서브 디렉토리 오류
				service = commonService;
			}
			Method getNameMethod = service.getClass().getMethod(funcName, paramTypes);
			response = (HashMap<String, Object>) getNameMethod.invoke(service, reqMap);

			/*
			 * login 인터페이스 세션 처리
			 */
			if ("login".equals(funcName)) {
				if (response != null && "0000".equals(response.get("resultCode"))) {
					
					Map<String, String> authMap = new HashMap<String, String>();
					authMap.put("userId", (String) response.get("user_id"));
					authMap.put("userName", (String) response.get("name"));
					
					req.getSession(false).setAttribute("user", authMap);
				}
			}

		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}

		return response;
	}

	@RequestMapping("/*/*.file")
	@ResponseBody
	//public HashMap<String, Object> fileRequest(MultipartHttpServletRequest mtfRequest) throws IOException {
	public String fileRequest(MultipartHttpServletRequest mtfRequest) throws IOException {
		return commonService.uploadMutipartFile(mtfRequest);
	}
	
	
	
	
	@RequestMapping("/*/*.filedown")
	@ResponseBody
	public void fileDownload(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		Map<String, Object> reqMap = new HashMap<String, Object>();
		
		int id 	= Integer.parseInt(request.getParameter("imgkey"));
		int seq = Integer.parseInt(request.getParameter("seq"));
		reqMap.put("id",id);
		reqMap.put("seq", seq);
		reqMap = commonService.selectImg(reqMap);
		
		ArrayList list = (ArrayList) reqMap.get("list");
		Map<String, Object> imgmap =  (Map<String, Object>) list.get(0);
		
		
		String saveFileName = (String) imgmap.get("savefilename");
		String originfilename = (String) imgmap.get("originfilename");
		
//		if(ie){
//            fileName = URLEncoder.encode(saveFileName, "utf-8");
//        } else {
//             
//            fileName = new String(saveFileName.getBytes("utf-8"));
//             
//        }// end if;
//
//		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName +"\" ;");
		
		File file =new File(file_Path + "//" + saveFileName);
		if (file.exists() && file.isFile()) {
			response.setContentType("image/jpeg; charset=utf-8");
			response.setContentLength((int) file.length());
//
			String userAgent = request.getHeader("User-Agent");
			boolean ie = userAgent.indexOf("MSIE") > -1;
	        String fileName = null;
	        if(ie){
	             
	            fileName = URLEncoder.encode(originfilename, "utf-8");
	                         
	        } else {
	             
	            fileName = new String(originfilename.getBytes("utf-8"));
	             
	        }// end if;

			response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName +"\" ;");
			response.setHeader("Content-Transfer-Encoding", "binary");
//			response.setHeader("Content-Type", "image/jpg");
			OutputStream out = response.getOutputStream();
			FileInputStream fis = null;
			fis = new FileInputStream(file);
			FileCopyUtils.copy(fis, out);
			if (fis != null)
				fis.close();
			out.flush();
			out.close();
		}
		
	}
	
	//
	@RequestMapping("/*/*.exceldown")
	@ResponseBody
	public void excelfileDownload(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		log.debug("액셀파일 다운로드 시작");
		
		Map<String, Object> reqMap = new HashMap<String, Object>();
		String  saveFileName 	=  request.getParameter("fileName");
		
		reqMap.put("saveFileName", saveFileName);
		
		File file =new File(excelFile_Path + saveFileName);
		log.debug("액셀파일 위치 : " + excelFile_Path + saveFileName);
		log.debug("파일 존재 유무 : " + file.exists());
		if (file.exists() && file.isFile()) {
			
//			response.setContentType("image/jpeg; charset=utf-8");
			response.setContentLength((int) file.length());
			String userAgent = request.getHeader("User-Agent");
			boolean ie = userAgent.indexOf("MSIE") > -1;
	        String fileName = null;
	        if(ie){
	            fileName = URLEncoder.encode(saveFileName, "utf-8");
	        } else {
	             
	            fileName = new String(saveFileName.getBytes("utf-8"));
	             
	        }// end if;

			response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName +"\" ;");
			response.setHeader("Content-Transfer-Encoding", "binary");
			OutputStream out = response.getOutputStream();
			FileInputStream fis = null;
			fis = new FileInputStream(file);
			FileCopyUtils.copy(fis, out);
			if (fis != null)
				fis.close();
			out.flush();
			out.close();
	
//			file.delete();
		}
		else {
			log.error("파일이 존재하지 않습니다.");
		}
		
	}
	
	
	/*
	 * 액셀파일 업로드 로직 TODO 분리 필요합니다.
	 */
	@RequestMapping("/*/*.excel")
	@ResponseBody
    public HashMap<String, Object> fileRequest(HttpServletRequest request, @RequestParam("file1") MultipartFile  uploadFile) throws IOException {   
		
		//1. 업로드된 액셀 파일을 데이터 구조로 변경
		//xls, xlsx 구분해서 처리 해야되는데 일단 xls 파일만 할려구 함
		
		log.debug("업로드 파일명 : " + uploadFile.getOriginalFilename());
		String originalFilename = uploadFile.getOriginalFilename();
		HashMap<String, Object> response = new HashMap<String, Object>();
		
		
		ArrayList< Map<String, String> > arrayList = null;
		if(originalFilename.indexOf(".xlsx")!= -1) {
			response.put("message", "지원하지 않는 파일 형태 입니다.");
			response.put("resultCode", "0001");
			return response;
		}
		else if(originalFilename.indexOf(".xls")!= -1) {
			 arrayList = ExcelUtil.convertExcelToData(uploadFile);
		}
		else {
			response.put("message", "지원하지 않는 파일 형태 입니다.");
			response.put("resultCode", "0001");
			return response;
		}
		
		log.debug("array 길이 : " + arrayList.size());
		//arrayList
		
		
		Class<?>[] paramTypes = { ArrayList.class };

		String reqUrl = request.getRequestURI();

		String funcName = reqUrl.substring(reqUrl.lastIndexOf("/") + 1).replace(".excel", "");
		String subDir = reqUrl.split("/")[2];

		log.debug("funcName :" + funcName);
			try {
				Method getNameMethod = excelService.getClass().getMethod(funcName, paramTypes);
				response = (HashMap<String, Object>) getNameMethod.invoke(excelService, arrayList);
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		return response;
		//HashMap<String, Object> response = null;
        //return (HashMap<String, Object>) userService.saveUserExcel(uploadFile);
    }
	
	
	@RequestMapping("/*.at")
	@ResponseBody
	public HashMap<String, Object> atRequest(HttpServletRequest req, @RequestBody Map<String, Object> reqMap) {

		log.info((String) reqMap.get("htmlFileStr"));
		log.info((String) reqMap.get("sftm_id"));
//		
//		HashMap<String, Object> response = new HashMap<String, Object>();
		return commonService.insertAutoRecording(reqMap);
	}
}