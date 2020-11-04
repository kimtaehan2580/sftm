/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var c_window = {};
var selectPushMsg = function (){
	
	if( getCookie("user_id") != "" && getCookie("user_id") != null){
		ajaxTranCall("push/selectPushListById.do", {}, c_window.callbackS, c_window.callBackE, false);
	}
	
};

//enterkey 입력시 호출됩니다.
//각화면에 정의가 되어 있을떄 호출합니다.
var WebForm_KeyUp = function (){
	if(typeof WebForm_KeyUp_js == "function"){
		WebForm_KeyUp_js();
	}
	
}

c_window.callbackS = function(tran, data){
	
	switch(tran){
	
	//selectPushMsg 
	case "push/selectPushListById.do":
		
		var list = data["list"]; 
		
		for(var i=list.length-1; i>=0; i--){
			var title = "["+list[i].push_code_name+"] " + list[i].title;
			skInterface.pushCall(title, list[i].msg, list[i].what_day);
		}
		break;
	}
};
c_window.callBackE = function(tran, data){
	
};

c_window.autoTestRecording = function(id){
	skInterface.autoTestRecording(id);
}

//
c_window.autoTestShow = function(title, html, type, user_info, time){
	
	if(typeof skInterface != "undefined"){
		skInterface.autoTestShow(title, html, type, user_info, time);
	}
	
}

c_window.setUserInfo = function(user_id, yn){
	if(typeof skInterface != "undefined"){
		skInterface.setUserInfo(user_id, yn);
	}
}