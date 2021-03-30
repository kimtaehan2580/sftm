/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 * @desc    현업이 테스트를 수행하는 화면
 */
var isFirstLoding = true;
//onload 함수 입니다.

var testCaseStateList = null;

//이미지 등록시에 테스트케이스/결함 구분을 위해
var g_tbname = "";


//테스트케이스 상세 화면에 좌측하단 테이블
var defectSubTable = null; 
var testSubTable = null; 

//테스트케이스 상세 화면에 우측하단 테이블
 /**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	//현업인 팀들 조회 로직입니다.
	ajaxTranCall("user/selectTeamList.do", {role_code:"TEST"}, callbackS, callbackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"A001"}, callbackS, callbackE, false);
	ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callbackE, false);
			
			
	//button event
	$('button').click(function(){
		switch($(this).attr('id')){
		
		//'조회' button
		case "btnSelect":
			selectTestCaseList();
			break;
			
		//'취소' button
		case "btnCancle":
			$("#panal_detail").hide();
			$("#panal_list").show();
			selectTestCaseList();
			
			break;
		
		//'상세보기' button
		case "btnDetail":
			$('#modalTestDetail').modal();
			break;
		
		//'결함등록' button
		case "btnRegDefect":
			
			//결함등록 팝업 초기화하기 
			$("#fileSub").val("");
			$("#existingSubImgs").html("");
			
			$("#titleU").val("");
			$("#descriptionU").val("");
			
			$('#modalRegDefect').modal();
			break;
			
		//'결함등록 저장' button
		case "btnSubSave":
			
			//필수입력값 확인
			if(!modal.modalCheckInputData("userDetailTable")) 
				return false;
			
			var fileList = $("#fileSub").prop('files');
			//첨부파일 없는 경우 바로 저장
			if(fileList.length < 1){
				insertDefectCall("-1");
			}
			else{
				var data = new FormData();
				for(var i=0; i<fileList.length; i++){
					data.append( "file"+i, fileList[i] );
				}
				
				if(fileList == null){
					data.append("fileLength", "0");
				}
				else{
					data.append("fileLength", fileList.length+"");
				}
				
				g_tbname = "itm_defect"
				data.append("tbname", "itm_defect");
				data.append("user_id", getCookie("user_id"));
				data.append("crud", "I");
				
				ajaxTranCallWithFile ("common/uploadFile.file", data,  callbackS, callbackE);
			}
		
			break;
		
		//'테스트 케이스 저장' button 
		case "btnSave":
		
			console.log($("#selectState_choice").val());
			console.log($("#description").val());
			
			var fileList = $("#fileMain").prop('files');
			if(fileList.length < 1){
				updateTestCaseCall($("#imgkey").val());
			}
			else{
				var data = new FormData();
				for(var i=0; i<fileList.length; i++){
					data.append( "file"+i, fileList[i] );
				}
				
				if(fileList == null){
					data.append("fileLength", "0");
				}
				else{
					data.append("fileLength", fileList.length+"");
				}
				
				g_tbname = "itm_scenario"
				data.append("tbname", "itm_scenario");
				data.append("user_id", getCookie("user_id"));
				data.append("imgkey", $("#imgkey").val());
				
				
				if($("#imgkey").val() == null || $("#imgkey").val() == -1){
					data.append("crud", "I");
				}
				else{
					data.append("crud", "U");
				}
				
				
				ajaxTranCallWithFile ("common/uploadFile.file", data,  callbackS, callbackE);
			}
		
			break;
			
			
		case "btnAutoTest":
			//test 자동화 버튼 클릭
		
			if(typeof skInterface != "undefined"){
				skInterface.autoTestRecording(
					getCookie("user_id")
					,$("#case_id").val() 
					,""
					,$("#testcase_info").text()
				);
			}
			else{
				;
			}
			break;
		
		case "btnExcute":
		
		
			//test 이력 재 확인
			if(typeof skInterface != "undefined"){
				ajaxTranCall("auto/selectAutoDetail.do", {"id": $("#auto_id").val()}, callbackS, callbackE);
			}
			else{
				;
			}
			
			break;
		}
		
	}); //button event
	
	
	//업무구분 A selectbox 변경시
	$("select[name=selectA]").on('change', function(){
		$("select[name=selectA]").val($(this).val());
		htmlSelectBox2($("select[name=selectB]"), "", "전체");
		htmlSelectBox2($("select[name=selectC]"), "", "전체");
		
		if($("select[name=selectA]").val() == ""){
			htmlSelectBox("selectB", "", "전체");
			htmlSelectBox("selectC", "", "전체");
			return;
		}
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()},  callbackS, callbackE);
	});
	
	$("select[name=selectB]").on('change', function(){
		$("select[name=selectB]").val($(this).val());
		htmlSelectBox2($("select[name=selectC]"), "", "전체");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()},  callbackS, callbackE);
	});
	
	
	
	//첨부파일 리스트 변경시 호출됩니다.
	//fileMain -> 테스트케이스 파일 첨부
	$('#fileMain').on('change', function(e){
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		$("#NewMainImgs").html("");
		
		filesArr.forEach(function(f){
		
			var htmlStr = '<img id="NewMainImgs'+f.lastModified+'" style="height:80px; padding:5px; max-width:100px;"/>';
			$("#NewMainImgs").append(htmlStr);
			var reader = new FileReader();
			reader.onload = function(e){
				var fs = f.name.split(".");
				console.log(fs);
				$("#NewMainImgs"+f.lastModified).attr("src", getimgUrl(f.name, e.target.result));
			}
			reader.readAsDataURL(f);
		});
		
	});
	
	//fileSub -> 결함 파일 첨부
	$('#fileSub').on('change', function(e){
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		$("#existingSubImgs").html("");
		filesArr.forEach(function(f){
			
			var htmlStr = '<img id="existingSubImgs'+f.lastModified+'" style="height:80px; padding:5px; max-width:100px;"/>';
			$("#existingSubImgs").append(htmlStr);
			var reader = new FileReader();
			reader.onload = function(e){
				var fs = f.name.split(".");
				console.log(fs);
				$("#existingSubImgs"+f.lastModified).attr("src", getimgUrl(f.name, e.target.result));
			}
			reader.readAsDataURL(f);
			
		});
	});
	
	//"location.href='PAGENAME.html'"
	//서브시스템 Table click event
	$('#caseTable').on('click', function(){
		setTimeout(function() {
			$('#caseTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = caseTable.row($(this)).data();
					//20200831 ADMIN이 아닌 경우 본인 아이디로 등록된 건만 가져가게 변경
					
					//20210319 화면 전환이 아닌 패널 교체로 처리
					//location.href='/ntm?path=defect/excuteDefect&scenario_id='+dataJson.scenario_id+"&case_id=" +dataJson.case_id ;
					//showTestCaseDetail(dataJson);
					
					var jsonObj = {
						"case_id" : dataJson.case_id,
						"imgkey"  : dataJson.imgkey
					};
					ajaxTranCall("scenario/selectTestCaseDetail.do", jsonObj, callbackS, callbackE);
					
				}
			});
		}, 100);
	});
	
	//테스트 녹화분 확인
	$('#testSubTable').on('click', function(){
		setTimeout(function() {
			$('#testSubTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = testSubTable.row($(this)).data();
					$("#auto_title").text(dataJson.title);
					$("#auto_reg_user").text(dataJson.name);
					$("#auto_reg_time").text(dataJson.reg_date);
					$("#auto_recoding_type").val("1");
					$("#auto_id").val(dataJson.id);
					$('#modalAuto').modal();					
				}
			});
		}, 100);
	});
	
	//테스트케이스 상세화면에서 좌측하단에 결함 리스트 더블 클릭시 
	// 결함 화면으로 이동한다.
	$('#defectSubTable').on('click', function(){
		setTimeout(function() {
			$('#defectSubTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = defectSubTable.row($(this)).data();
					
					location.href='/ntm?path=defect/defect&test_id='+dataJson.test_id+"&defect_id=" +dataJson.defect_id ;
				}
			});
		}, 100);
	});
	
	
	
}

var callbackS = function(tran, data){
	
	switch(tran){
	
	/*
	 * user/selectTeamList.do -> 현업 팀들을 조회 합니다.
	 */
	case "user/selectTeamList.do":
		
		var list = data["list"];
		
		//1. select box 값 설정
		htmlSelectBox2($("#selectTeam"), "", "전체");
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
		}
		
		if(isFirstLoding){
			//2. 로그인 사번의 팀으로 강제 설정
			var team_id = getCookie('team_id'); 
			$("#selectTeam").val(team_id);
			if($("#selectTeam").val() == null) $("#selectTeam").val("");
		}
		
		//테스트케이스 상태 코드 조회합니다.	
		ajaxTranCall("code/selectCodeList.do", {"code_group":"C001"}, callbackS, callbackE);
		break;
		
	/*
	 * user/selectUserList.do -> 협업들을 조회 합니다.
	 */
	case "user/selectUserList.do":
		
		var list = data["list"];
		
		//1. select box 값 설정
		htmlSelectBox2($("#selectUser"), "", "전체");
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectUser"), list[i].user_id, list[i].name);
		}
		
		if(isFirstLoding){
			var user_id = getCookie('user_id');
			$("#selectUser").val(user_id);
			if($("#selectUser").val() == null) $("#selectUser").val("");
			
			isFirstLoding = false;
		}
		
		// 테스트 케이스 목록 조회합니다.
		selectTestCaseList();
		
		break;
		
	/*
	 * code/selectCodeList.do -> 코드조회
	 */
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		testCaseStateList = data["list"];
		if(code_group == "C001"){
			for(var i=0; i<testCaseStateList.length; i++){
				appendSelectBox2( $("#selectState"), testCaseStateList[i].code_id, testCaseStateList[i].code_name);
				appendSelectBox2( $("#selectState_choice"), testCaseStateList[i].code_id, testCaseStateList[i].code_name);
			}
			
			if(getUrlParams().state != null){
				$("#selectState").val(getUrlParams().state);
			}
	
			//사용자 조회
			selectUserList();
			
		}
		else if(code_group == "A001"){
			
			for(var i=0; i<testCaseStateList.length; i++){
				if(testCaseStateList[i].code_id == "A001_03") continue;
				appendSelectBox2( $("#defect_typeU"), testCaseStateList[i].code_id, testCaseStateList[i].code_name);
			}
		}
		
		
		break;
		
		
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
	
		var list = data["list"];
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectA]"), list[i].div_id, list[i].name);
				}
			}
			else if(detpth == "B"){
				htmlSelectBox("selectB", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectB]"), list[i].div_id, list[i].name);
				}
			}
			else if(detpth == "C"){
				htmlSelectBox("selectC", "", "전체");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectC]"), list[i].div_id, list[i].name);
				}
			}
		}
		
		break;	
		
	case "scenario/selectTestCaseList.do":
		
		var list = data["list"];
		var testCaseList = new Array();
		
		for(var i=0; i<list.length;i++){
			
			var div = list[i].depth1 + "->" + list[i].depth2 + "->" + list[i].depth3;
			var div = list[i].depth2 + "->" + list[i].depth3;
			if(div == "->"){
				div = "N/A";
			}
			list[i].div = div;
			
			list[i].scenario_name_c =  list[i].scenario_name + " ("+list[i].scenario_code + ")";
			testCaseList.push(list[i]);
		}
		caseTable = $('#caseTable').DataTable ({
			destroy: true,
	        "aaData" : testCaseList,
	        "columns" : [
	            { "mDataProp" : 'div_name' },
	            { "mDataProp" : 'scenario_name_c' },
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'test_name' } ,
	            { "mDataProp" : 'dev_name' }  ,
	            { "mDataProp" : 'statestr' } ,
	            { "mDataProp" : 'defect_cnt' },
	            { "mDataProp" : 'scenario_code' },
	            { "mDataProp" : 'case_id' }
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "18%"},
			    { "targets": 1, "width": "19%"},
			    { "targets": 2, "width": "22%" },
			    { "targets": 3, "width": "8%", "className": "text-center" },
			    { "targets": 4, "width": "8%", "className": "text-center" },
			    { "targets": 5, "width": "10%", "className": "text-center" },
			    { "targets": 6, "width":"15%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 7, "width":"0%"},
			    { "targets": 8, "width":"0%"}
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
			 dom : 'Bfrtip',
			buttons: [
				
	        	{
	        		extend:'excel',
	        		text:'다운로드',
					className: 'btn btn-outline-secondary',
	        		bom:true
	        	}
        	],

		    pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false
			
	    });
		
		common.tableMappingAfterProcess();
		break;
	
	
	/*
	 * common/uploadFile.file -> 첨부파일 등록하기
	 */
	case "common/uploadFile.file":
		
		if(g_tbname == "itm_scenario"){
			updateTestCaseCall(data.imgkey);
		}
		else if(g_tbname == "itm_defect"){
			insertDefectCall(data.imgkey);
		}
		break;
	
	/*
	 * defect/insertDefect.do -> 결함등록 인터페이스
	 */
	case "defect/insertDefect.do":
		
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			ajaxTranCall("defect/selectDefectList.do", { "case_id": $("#case_id").val() }, callbackS, callbackE, false);
			$('#modalRegDefect').modal("hide"); 
		}
		
		break;	
		
	/*
	 * auto/selectAutoList.do -> 테스트케이스에 연결된 UI 테스트 
	 */
	 case "auto/selectAutoList.do":
	 	
	 	var list = data["list"];
	 	
	 	testSubTable = $('#testSubTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'name' },
	            { "mDataProp" : 'reg_date' } 
	        ],
			"columnDefs": [
			    { "targets": 0,  "width": "60%" },
			    { "targets": 1,  "width": "20%","className": "text-center" },
			    { "targets": 2,  "width": "20%","className": "text-center" },
	
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			 pageLength:5, //기본 데이터건수
			"scrollY":       230,
	        "scrollCollapse": false
	    });
		common.tableMappingAfterProcess();
	 	break;
	/*
	 * defect/selectDefectList.do -> 테스트케이스에 연결된 결함리스트 조회
	 */		
	case "defect/selectDefectList.do":
		
		var list = data["list"];
		defectSubTable = $('#defectSubTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'defect_type_name' },
	            { "mDataProp" : 'defect_code_name' }  ,
	            { "mDataProp" : 'reg_date_str' } ,
	            { "mDataProp" : 'resolve_date_str' } 
	        ],
			"columnDefs": [
			    { "targets": 0,  "width": "45%" },
			    { "targets": 1,  "width": "15%","className": "text-center" },
			    { "targets": 2,  "width": "15%","className": "text-center" },
			    { "targets": 3,  "width": "15%","className": "text-center" },
			    { "targets": 4,  "width": "15%","className": "text-center" }
	
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			 pageLength:5, //기본 데이터건수
			"scrollY":       230,
	        "scrollCollapse": false
	    });
		common.tableMappingAfterProcess();
		
		break;
		
	case "scenario/selectTestCaseDetail.do":
		showTestCaseDetail(data);
		break;
		
	case "scenario/updateTestCaseDetail.do":
		
		alert(data["message"]);
		var jsonObj = {
			"case_id" :  $("#case_id").val(),
			"imgkey"  :  $("#imgkey").val()
		};
		ajaxTranCall("scenario/selectTestCaseDetail.do", jsonObj, callbackS, callbackE);
		break;
	
	case "auto/selectAutoDetail.do":
	
	
	 	var list = data["list"];
	 	
		c_window.autoTestShow(
			$("#auto_title").text()					//결함제목
			, list[0].html						//html json list
			, $("#selectViewType").val()  		//녹화재생 유형 (auto : 자동수행, manual : 수동수행)
			, $("#auto_reg_user").text()	
			, $("#auto_reg_time").text()
		);		
		break;
		
		
				
	}
};

var callbackE = function(tran, data){
	
};


/*
 * showTestCaseDetail -> testcase list 선택시 호출 됨 
 * 상세 테스트 케이스 화면 호출 함
 */
var showTestCaseDetail = function(data){

	$("#fileSub").val("");
	$("#existingSubImgs").html("");
	$("#fileMain").val("");
	$("#existingMainImgs").html("");
	$("#NewMainImgs").html("");
	
	$("#comment").val("");

	var detailJson = data["list"][0];
	$("#scenario_id").val(detailJson.scenario_id);
	$("#case_id").val(detailJson.case_id);
	$("#imgkey").val(detailJson.imgkey);
	
	if($("#imgkey").val() == null){
		$("#imgkey").val("-1");
	}
	
	
	//선택된 테스트 케이스의 결함리스트를 조회 
	ajaxTranCall("defect/selectDefectList.do", 	{ "case_id" : $("#case_id").val() }, callbackS, callbackE, false);
	ajaxTranCall("auto/selectAutoList.do", 		{ "case_id" : $("#case_id").val() }, callbackS, callbackE, false);

	//초기화 
	$("#panal_list").hide();
	$("#panal_detail").show();
	$("#testcase_info").text( detailJson.case_name + " ("+ detailJson.scenario_code +")" );
	
	$("#selectState_choice").val(detailJson.state);
	$("#td_div_name").text(detailJson.div_name);
	$("#td_scenario").text(detailJson.scenario_name + " (" +detailJson.scenario_code+")");
	$("#td_testcase").text(detailJson.case_name);
	$("#td_desc").text(detailJson.description);
	$("#td_test").text(detailJson.test_name);
	$("#td_dev").text(detailJson.dev_name);
	
	
	// 수행결과 comment 처리 내용 (ta_comment_history)
	$("#ta_comment_history").val(common.showCommnetShape(data["commnetList"]));
	
	
	//기존 등록된 이미지 보여주기 
	var imgList = data["imgList"];
	setEdmsModal( imgList, $("#existingMainImgs") )

}

/*
 * updateTestCaseCall -> 테스트케이스 상태/이미지/댓글 업데이트
 */
var updateTestCaseCall = function(_imgkey){
	
	var data = {
		
		"scenario_id"	: $("#scenario_id").val(),
		"case_id"		: $("#case_id").val(),
		"comment"		: $("#comment").val(),
		"state"  		: $("#selectState_choice").val(),
		"imgkey" 		: _imgkey
	}; 
	
	ajaxTranCall ("scenario/updateTestCaseDetail.do", data,  callbackS, callbackE);
}

/*
 * insertDefectCall -> 결함 등록 인터페이스 호출
 */
var insertDefectCall= function(_imgkey){
	
	var data = {
		"title": 			$("#titleU").val(),
		"defect_type": 		$("#defect_typeU").val(),
		"description": 		$("#descriptionU").val(),
		"user_id":		 	getCookie("user_id"),
		"scenario_id":		$("#scenario_id").val(),
		"case_id": 			$("#case_id").val(),
		"defect_code":		"B001_01", 
//		"state" : $("#state").val(),
		"imgkey": _imgkey
	};
	ajaxTranCall ("defect/insertDefect.do", data,  callbackS, callbackE);
}


/*
 * selectTestCaseList -> select box 데이터로 테스트 케이스 목록 조회합니다.
 */
var selectTestCaseList = function(){
	
	var jsonObj = {
		"divA" : $("select[name=selectA]").val(),
		"divB" : $("select[name=selectB]").val(),
		"divC" : $("select[name=selectC]").val(),
		"tester_id" : $("#selectUser").val(),
		"state"	    : $("#selectState").val(), 
		"project_id":$("#selectProject").val()
	}
	ajaxTranCall("scenario/selectTestCaseList.do", jsonObj, callbackS, callbackE);
}

var selectUserList = function(){
	
	//3. 로그인사번에 팀원들 조회 로직
	var jsonObj = {
		"role_code" : "TEST",
		"team_id"   : $("#selectTeam").val()
	};
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callbackE);
}