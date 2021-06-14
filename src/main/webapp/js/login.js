/*
 * @author  kimtaehan
 * @version 1.0
 * @see     js
 */

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	/*
	 * 테스트 버트 이벤트 스윙에 맞게 전문 발송해보자 
	 */
	$("#btTest").click(function(){
		
		alert("Test");
		
		var input1 = '{"input1": [{"func_ident_id": "ordf_cre_acnt_numb", "svc_mgmt_num": "", "svc_gu": "", "svc_sel_gu": "", "svc_num": "", "can_gu": "", "ctz_num": "", "valid_type": "", "numng_type_cd": "", "id_no": "", "gubun": "", "rowStatus": "C"}], "HEAD": {"Trx_Code": "ZORDSCOM01050_TR01", "Ngms_UserId": "1000938566", "Ngms_LogInId": "D150800362", "Ngms_EmpNum": "", "Ngms_OrgId": "1000165781", "Ngms_HrOrgCd": "", "Ngms_PostOrgCd": "D15080A000", "Ngms_PostSaleOrgCd": "D15080A000", "Ngms_SupSaleOrgCd": "C099770000", "Ngms_IpAddr": "150.28.79.196", "Ngms_BrTypCd": "530", "Ngms_AuthId": "", "Ngms_ConnOrgId": "1000165782", "Ngms_ConnOrgCd": "D15080", "Ngms_ConnSaleOrgId": "1000165782", "Ngms_ConnSaleOrgCd": "D15080", "Ngms_AuthTypPermCd": "EQ", "Ngms_PostSaleOrgId": "1000165781", "Ngms_SupSaleOrgId": "C099770000", "Term_Type": "0", "User_Term_Type": "", "St_Stop": "0", "St_Trace": "", "Stx_Dt": "", "Stx_Tm": "", "Etx_Dt": "", "Etx_Tm": "", "Rt_Cd": "", "Screen_Name": "ZORDSS01S0010", "Msg_Cnt": "0", "Handle_Id": "311690760 ", "Ngms_Filler1": "", "Ngms_CoClCd": "T", "Screen_Call_Trace": "m:ZORDSS01S0010", "Pgm_Typ_Cd": "001", "rowStatus": "C"},"str_key":"str_value"}';
		
		$.ajax({
		url : location.protocol + "//" + location.host + "/ntm/user/login.do",
			method: "POST", 
			dataType: "json", 
			contentType : 'application/json',  
			data : input1,
			success : function(data){
				$("#loader").hide();
				if(data["resultCode"] == "0000"){
					//USER 정보 설정 
//					setCookie('user_id',  data.user_id, '1');
//					setCookie('name',  data.name, '1');
//					setCookie('position',  data.position, '1');
//					setCookie('team_id',  data.team_id, '1');
//					setCookie('team_name',  data.team_name, '1');
//					setCookie('role_code',  data.role_code, '1');
					
//					if($("input:checkbox[name='autoLogin']").is(":checked")){
//						setCookie('autoLogin', "Y", "1");
//						c_window.setUserInfo(data.user_id, "Y");
//					}
//					else{
//						setCookie('autoLogin', "N", "1");
//						c_window.setUserInfo(data.user_id, "N");
//					}
//					location.href = "/ntm?path=main";
				}
				else{
					alert(data["message"] );
				}
				
			},
			error : function(xhr, status, error){
				$("#loader").hide();
			}
		});
	});
	
	/*
	 * btLogin_onClick
	 */
	$("#btLogin").click(function(){ 
		
		var inputLoginId  = $("#inputLoginId").val();
		var inputPassword = $("#inputPassword").val();
		
		if(inputLoginId == null || inputLoginId == ""){
			alert("사용자 아이디를 입력해주세요.");
			$("#inputLoginId").focus();
			return;
		}
		if(inputPassword == null || inputPassword == ""){
			
			if(getCookie('autoLogin') != "Y"){
				alert("패스워드를 입력해주세요.");
				$("#inputPassword").focus();
				return;
			}
		}
		
		
		$("#loader").show();
		
		var dataJson = {
			user_id : inputLoginId,
			password : inputPassword
		};
		
		$.ajax({
		url : location.protocol + "//" + location.host + "/ntm/user/login.do",
			method: "POST", 
			dataType: "json", 
			contentType : 'application/json',  
			data : JSON.stringify(dataJson),
			success : function(data){
				$("#loader").hide();
				if(data["resultCode"] == "0000"){
					//USER 정보 설정 
					setCookie('user_id',  data.user_id, '1');
					setCookie('name',  data.name, '1');
					setCookie('position',  data.position, '1');
					setCookie('team_id',  data.team_id, '1');
					setCookie('team_name',  data.team_name, '1');
					setCookie('role_code',  data.role_code, '1');
					
					if($("input:checkbox[name='autoLogin']").is(":checked")){
						setCookie('autoLogin', "Y", "1");
						c_window.setUserInfo(data.user_id, "Y");
					}
					else{
						setCookie('autoLogin', "N", "1");
						c_window.setUserInfo(data.user_id, "N");
					}
					location.href = "/ntm?path=main";
				}
				else{
					alert(data["message"] );
				}
				
			},
			error : function(xhr, status, error){
				$("#loader").hide();
			}
		});
	});
	
	
	
	//web에서 쿠키로 조회
	var user_id 	= getCookie('user_id');
	//귀찮다 그냥 Y, N으로 구분할께
	var autoLogin 	= getCookie('autoLogin');
	
	
	if(user_id != null){
		$("#inputLoginId").val(user_id);
		if(autoLogin == "Y"){
			$("input:checkbox[name='autoLogin']").prop("checked", true);
				setTimeout(() => $("#btLogin").trigger('click'), 500);
		}
	}
	else{
		
		//C#은 쿠키를 못쓰기 떄문에 음..
		var preJson = getUrlParams();
		if(preJson.user_id != null){
			 $("#inputLoginId").val( preJson.user_id );
		
			if(preJson.auto_login == 'Y'){
				$("input:checkbox[name='autoLogin']").prop("checked", true);
				setCookie('autoLogin', "Y", "1");
				setTimeout(() => $("#btLogin").trigger('click'), 500);
			}
		}
	}
	
	$("#inputPassword").keyup(function(){ 
		
	    if (window.event.keyCode == 13) {
             $("#btLogin").trigger('click');
        }
	});
	
	$("input:checkbox[name='autoLogin']").keyup(function(){ 
		
	    if (window.event.keyCode == 13) {
             $("#btLogin").trigger('click');
        }
	});
	
}


var WebForm_KeyUp_js = function(){
	
	$("#btLogin").trigger('click');
}

