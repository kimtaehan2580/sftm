/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
function ajaxTranCall(tran, jsonBody, succeesCallback, errorCallback, progrssbar){
	
	jsonBody["cookieUserId"] = getCookie("user_id");
	if(progrssbar != false){
		$("#loader").show();
	}
	 
	
	$.ajax({
		url : location.protocol + "//" + location.host + "/ntm/" + tran,
		method: "POST", 
		dataType: "json", 
		contentType : 'application/json',  
		data : JSON.stringify(jsonBody),
		statusCode: {
			999:function(data) {
				//setCookie("user_id", "");
				
				setTimeout(() => location.href = "/ntm", 500);
//				alert("세션이 만료되었습니다.\n로그인 화면으로 이동합니다.");
				
			}
		},
		success : function(data){
			
			if(progrssbar != false){
				$("#loader").hide();
			}
			if(data["resultCode"] == "0000"){
				succeesCallback(tran, data);
			}
			else{
				alert(data["message"]);
				errorCallback(tran, data);
			}
			
		},
		error : function(xhr, status, error){
//			alert("전문 통신에 오류가 발생하엿습니다.");

			if(progrssbar != false){
				$("#loader").hide();
			}
			
		}
	});
	
}

/*
 * 파일도 같이 보낼때..
 */
var ajaxTranCallWithFile = function(tran, data,  succeesCallback, errorCallback){
	$("#loader").show();
	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: tran,
        data: data,
        processData: false,
        contentType: false,
        timeout: 600000,
        success: function (resData) {
        	$("#loader").hide();
        	
    		var tempJson = {
    			"imgkey":	resData,
    			"crud"   : data["crud"]
    		}
    		succeesCallback(tran, tempJson);
        },
        error: function (e) {
	$("#loader").hide();
        	alert("시스템 오류");
        }

    });
}


/*
 * 액셀 업로드만 
 */
var ajaxExcelDownLoad = function (tran , data, succeesCallback, errorCallback){
	
} 


/*
 * 액셀 업로드만 
 */
var ajaxFormExcel = function (tran , id, func, key){


	$("#loader").show();
	var data = new FormData();
	
	if(key != null) data.append("key", key);
	data.append(id, $('#'+ id).prop('files')[0]);				

	$.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: tran,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
	$("#loader").hide();
        	
        	if(data["resultCode"] == "0000"){
        		func(tran, data);
			}
			else{
				alert(data["msg"]);
			}
        	
        },
        error: function (e) {
	$("#loader").hide();
        	alert("시스템 오류");
        }

    });
}



/**
 * 인터페이스 성공 Callback
 * @param {tran} 서비스명
 * @param {data} 결과 Json 데이터
 * @returns {} 
 */ 
var jspcallbackS = function(tran, data){
	 
	if(tran == "code/selectProjectList.do"){
		
		var today = new Date().toISOString().substring(0, 10).replace(/-/gi, "");
		
		var isSelected = getCookie("selectedProject");
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			
			if(list[i].use_yn != "Y") continue;
			appendSelectBox2( $("#selectProject"), list[i].id, list[i].project_name);
			if(isSelected == null){
				if(list[i].start_date<=today && list[i].end_date>=today){
					isSelected = list[i].id;
				}
			}
		}
		$("#selectProject").val(isSelected);
		$("#selectProject").on('change', function(){
			
			setCookie("selectedProject", $("#selectProject").val(), 1);
			location.href="/ntm?path="+ $("#htmlName").val();

		});
		
		initDoucument();
	
	}
	 
}

 /**
  * 인터페이스 성공 Callback
  * @param {tran} 서비스명
  * @param {data} 결과 Json 데이터
  * @returns {} 
  */ 
 var jspcallbackE = function(tran, data){
 	 
 } 



