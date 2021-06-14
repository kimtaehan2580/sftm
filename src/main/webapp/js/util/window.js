/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var c_window = {};
var selectPushMsg = function (){
	
	if( getCookie("user_id") != "" && getCookie("user_id") != null){
		ajaxTranCall("push/selectPushListById.do", {}, c_window.callbackS, c_window.callbackE, false);
	}
	
};
//var _list = null;
var  updateAutotest_result = function (list){
	var jsonObj = JSON.parse(list);
	ajaxTranCall("push/updateAutotest_result.do", jsonObj, c_window.callbackS, c_window.callbackE, false);
};


/*
 * go_page -> C#에서 호출 (push 바로가기 있는 경우)
 */
//var _list = null;
var go_page = function (event){
	location.href="/ntm?" + event; //개인 미처리 내용 확인
};


//enterkey 입력시 호출됩니다.
//각화면에 정의가 되어 있을떄 호출합니다.
var WebForm_KeyUp = function (){
	if(typeof WebForm_KeyUp_js == "function"){
		WebForm_KeyUp_js();
	}
	
}

/*
 * c_window.autoTestRecording -> 테스트수행, 결함등록 화면에서 테스트 수행 버튼 클릭시 호출함
 */
c_window.autoTestRecording = function(user_id, case_id, defect_id, test_name){

	console.log("user_id -> " + user_id);
	console.log("case_id -> " + case_id);
	console.log("defect_id -> " + defect_id);
	console.log("test_name -> " + test_name);
	
	
	$("#modalRecord_user_id").val(user_id);
	$("#modalRecord_case_id").val(case_id);
	$("#modalRecord_defect_id").val(defect_id);
	$("#modalRecord_test_name").val(test_name);
	
	if(typeof skInterface == "undefined"){
		alert("WEB에서는 수행 불가합니다.");
		return;
	}
	
	ajaxTranCall("border/selectSitemapList.do", {"test_page_yn":"Y"}, function(tran, data){

		var list = data["list"];
		$("#modalRecordSelect").html("");
		
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#modalRecordSelect"), list[i].url, list[i].title + " (" + list[i].sub_title + ")");
		}
		$('#modalRecord').modal();

	}, callbackE);
	
//	
	
}

/*
 * c_window.autoTestGo -> 테스트 화면 선택 팝업에서 실행 버튼 이벤트입니다.
 */
c_window.autoTestGo = function(){

	skInterface.autoTestRecording(
	
		$("#modalRecordSelect").val()
		,$("#modalRecord_user_id").val()
		,$("#modalRecord_case_id").val()
		,$("#modalRecord_defect_id").val()
		,$("#modalRecord_test_name").val()
	);
}


c_window.callbackS = function(tran, data){
	
	switch(tran){
	
	//selectPushMsg 
	case "push/selectPushListById.do":
		
		var list = data["list"]; 
		
		for(var i=list.length-1; i>=0; i--){
			var title = "["+list[i].push_code_name+"] " + list[i].title;
			skInterface.pushCall(title, list[i].msg, list[i].what_day, list[i].event);
		}
		break;
	}
};
c_window.callbackE = function(tran, data){
	
};

//
c_window.autoTestShow = function(title, html, type, user_info, time){
	
	if(typeof skInterface != "undefined"){
		skInterface.autoTestShow(title, html, type, user_info, time);
	}
}

c_window.autoTestShowList = function( htmlList){
	
	if(typeof skInterface != "undefined"){
		skInterface.autoTestShowList( JSON.stringify(htmlList) );
	}
}

c_window.setUserInfo = function(user_id, yn){
	if(typeof skInterface != "undefined"){
		skInterface.setUserInfo(user_id, yn);
	}
}