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

