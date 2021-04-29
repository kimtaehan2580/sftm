/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */ 


//Table 변수 
var devDefectTable;  	//결함 테이블 (메인) 
var defectSubTable;  	//결함이력 테이블 (상세)
var testSubTable; 		//녹화이력 테이블 (상세)

var b001List = null //결함 상태 코드값 저장


//상세조회 데이터 저장
var selectedData = null;


 /**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){

	ajaxTranCall("user/selectTeamList.do", {role_code:"DEV"}, callbackS, callbackE);
	ajaxTranCall("user/selectUserList.do", {}               , callbackS, callbackE);
	
	ajaxTranCall("code/selectCodeList.do", {"code_group":"B001"}, callbackS, callbackE, false);
	
	$("#selectTeam").on('change', function(){
	
		if( $("#selectTeam").val() == ""){
			$("#selectTest").show();
			$("#selectDev").show();
			$("#selectTestLabel").show();
			$("#selectDevLabel").show();
		}
		else{
			$("#selectTest").hide();
			$("#selectDev").hide();
			$("#selectTestLabel").hide();
			$("#selectDevLabel").hide();
		}
	});	
	
	
	//button event
	$('button').click(function(){
		
		switch($(this).attr('id')){
		
		//'조회' button
		case "btnSelect":
			selectDefectListByCond();
			break;
			
		//'취소' button
		case "btnCancle2":
			$("#panal_detail").hide();
			$("#panal_list").show();
			selectDefectListByCond();
			
			break;
			
		//'상세보기' button
		case "btnDetail":
			$('#modalDefectDetail').modal();
			break;
		
		//'저장' button 
		case "btnSave":
			// 결함 상태 변경 프로세스음.
			
			var fileList = $("#fileMain").prop('files');
			//첨부파일 없는 경우 바로 저장
			if(fileList.length < 1){
				updateDefectCall($("#imgkey").val());
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
		
		//'개발자 변경' button 
		case "btnDevUpdate":
			$('#modalUser').modal();
			break;
		
		//개발자변경 팝업 > '저장' button 
		case "btnModalSave":
		
			if($("#selectModalDev").val() == ""){
				alert("선택된 개발자가 없습니다.");
				$("#selectModalDev").focus();
				return;
			}
			$("#developer_id").val($("#selectModalDev").val());
			$("#developer_name").val($("#selectModalDev option:selected").text());
			$('#modalUser').modal('hide');
			break;	
			
		case "btnAutoTest":
			//test 자동화 버튼 클릭
			c_window.autoTestRecording(getCookie("user_id"), $("#case_id").val(), selectedData.defect_id+"", $("#defect_info").text());
		 
			break;
		
		case "btnExcute":
		
			//test 이력 재 확인
			if(typeof skInterface != "undefined"){
				ajaxTranCall("push/selectAutoDetail.do", {"id": Number($("#auto_id").val())}, callbackS, callbackE);
			}
			else{
				;
			}
			
			break;
		}
		
	}); //button event
	
	//결함 리스트 선택시 호출 함
	$('#devDefectTable').on('click', function(){
		setTimeout(function() {
			$('#devDefectTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = devDefectTable.row($(this)).data();
					console.log(dataJson);
					
					//결함 상세 조회
					selectDefectDetail(dataJson.defect_id);
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
	
	
	//개발자변경 팝업 > 프로젝트팀 select 변경시 호출 됩니다.
	$('#selectModalTeam').on('change', function(e){
		var json = {
			role_code:"DEV",
			team_id : $("#selectModalTeam").val()		
		};
		ajaxTranCall("user/selectUserList.do", json, callbackS_modal, callbackE);
	});
	 
}


//개발자변경 팝업 > 프로젝트팀 select 변경시 호출 됩니다.
var callbackS_modal = function(tran, data){

	var list = data["list"];
	 $("#selectModalDev").html("");
	appendSelectBox2( $("#selectModalDev"), "", "선택"); //개발자 변경시 사용되는 팝업에서 사용
	for(var i=0; i<list.length; i++){
		appendSelectBox2( $("#selectModalDev"), list[i].user_id, list[i].name + " (" +list[i].user_id+ ")");
	}
}


var callbackS = function(tran, data){

	switch(tran){
	
	//코드 조회
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		var list = data["list"];
		
		if(code_group == "B001"){
			b001List = list;
		}	
		
		else if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_type"), list[i].code_id, list[i].code_name);
			}
		}
		break;
		
	//팀 정보 전체 조회
	case "user/selectTeamList.do":
	
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
			appendSelectBox2( $("#selectModalTeam"), list[i].id, list[i].name); //개발자 변경시 사용되는 팝업에서 사용
		}
		firstSelectListCall("team");
		break;
		
	//사용자 정보 전체 조회
	case "user/selectUserList.do":
	
		var list = data["list"]; 
		for(var i=0; i<list.length; i++){
		
			if(list[i].role_code == "DEV"){
				appendSelectBox2( $("#selectDev"), list[i].user_id, list[i].name + " (" +list[i].team_name+ ")");
			}
			else if(list[i].role_code == "TEST"){
				appendSelectBox2( $("#selectTest"), list[i].user_id, list[i].name + " (" +list[i].team_name+ ")");
			}
		}
		
		
		firstSelectListCall("user");
		
		break;
		
	//리스트 조회시 호출	
	case "defect/selectDefectListByCond.do":
	
		var list = data["list"];
		for(var i=0;i<list.length;i++){
			list[i].scenario = list[i].scenario_name + "(" + list[i].scenario_code + ")";
		}
		devDefectTable  = $('#devDefectTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'scenario' } ,
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'defect_type_name' } ,
	            { "mDataProp" : 'defect_code_name' } ,
	            { "mDataProp" : 'tester_name' },
	            { "mDataProp" : 'developer_name' },
	            { "mDataProp" : 'reg_date' } ,
	            //
	        ],
			'columnDefs': [
			    { "targets": 0, "width":"15%", },
			    { "targets": 1, "width":"15%", },
			    { "targets": 2, "width":"20%", },
			    { "targets": 3, "width":"10%","className": "text-center" },
			    { "targets": 4, "width":"10%","className": "text-center" },
			    { "targets": 5, "width":"10%","className": "text-center" },
			    { "targets": 6, "width":"10%","className": "text-center" },
			    { "targets": 7, "width":"10%", "className": "text-center" }
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },

		 dom : 'Bfrtip',
			buttons: [
				{
	                text: '다운로드',
	                className: 'btn btn-outline-secondary all',
	                extend:'excel',
	            }
        	],
		    pageLength:10, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			"scrollY":        560,
			"scrollCollapse": false,
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		common.tableMappingAfterProcess();
	
		break;
		
		
	//리스트 조회시 호출	
	case "defect/selectDefectDetail.do":
		
		selectedData = data;
		$("#panal_detail").show();
		$("#panal_list").hide();
		
		//서브 테이블 값들 조회
		ajaxTranCall("push/selectAutoList.do", 		{ "defect_id" : data.defect_id }, callbackS, callbackE, false);
		ajaxTranCall("defect/selectDefectHistory.do", {"defect_id": data.defect_id}, callbackS, callbackE, false);
		
		//초기화
		$("#fileMain").val("");
		$("#existingMainImgs").html("");
		$("#NewMainImgs").html("");
	
		$("#comment").val("");
		// 수행결과 comment 처리 내용 (ta_comment_history)
		$("#ta_comment_history").val(common.showCommnetShape(data["commnetList"]));
		
		
		var imgList = data["imgList"];
		setEdmsModal( imgList, $("#existingMainImgs") );
		
		if(data.imgkey == null || data.imgkey == "")
			 data.imgkey = "-1";
		$("#imgkey").val(data.imgkey);
		
		
		//결함상태 콤보박스 값 설정 
		$("#defect_code").html(""); //초기화
		
		//자기값 먼저 설정
		appendSelectBox2( $("#defect_code"), data.defect_code, data.defect_code_name);
		$("#defect_code").val(data.defect_code);
		var role_code = getCookie('role_code');
		
		//결함종료의 경우 데이터 변경 불가 합니다.
		if( data.defect_code != "B001_06"){
		
			for(var i=0; i<b001List.length; i++){
			
				if(data.defect_code == b001List[i].code_id){
					continue;
				}
		
				//"B001_01"	"결함등록"
				//"B001_02"	"배정완료"
				//"B001_03"	"조치완료"
				//"B001_04"	"미조치건"
				//"B001_05"	"개발지연"
				//"B001_06"	"결함종료"
				//"B001_07"	"조치반려"
				//개발자인경우 
				if(role_code == "DEV"){
					//B001_03/B001_04/B001_05
					if(b001List[i].code_id == "B001_03" || b001List[i].code_id == "B001_04" || b001List[i].code_id == "B001_05"){
						appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
					}
				}
				//현업인 경우 
				else if(role_code == "TEST"){
					if(b001List[i].code_id == "B001_06" || b001List[i].code_id == "B001_07"){
						appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
					}
				}
				//admin인 경우 
				else if(role_code == "ADMIN"){
					appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
				}
			
			
			}
			$("#btnDevUpdate").show();
		}
		else{
			$("#btnDevUpdate").hide();
		}
		if(data.developer_id == null){
			 data.developer_id  = "";
		}
		else{
			$("#developer_id").val(data.developer_id);
			$("#developer_name").val(data.developer_name +" ("+data.developer_id+")");
		}
		
		$("#reg_date").text(data.reg_date);
		
		//상세보기 1
		$("#defect_info").text(data.title);
		$("#td_div_name").text(data.div_name_total);
		$("#td_scenario").text(data.scenario_name+ "(" + data.scenario_code + ")");
		$("#td_testcase").text(data.case_name);
		$("#case_id").val(data.case_id);
		
		//상세보기 2
		$("#td_defect_type").text(data.defect_type_name);
		$("#td_defect").text(data.title);
		$("#td_test").text(data.tester_name);
		$("#td_dev").text(data.developer_name);
		$("#td_desc").text(data.description);
		$("#td_reg_date").text(data.reg_date);
		$("#td_resolve_date").text(data.resolve_date);
		
		
		//개발자변경 modal
		$('#selectModalTeam').val("");
		$('#selectModalTeam').trigger("change");
		
	
		break;	
		
	/*
	 * push/selectAutoList.do -> 테스트케이스에 연결된 UI 테스트 
	 */
	 case "push/selectAutoList.do":
	 	
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
	 
	 //"defect/selectDefectHistory.do"
	 case "defect/selectDefectHistory.do":
	 	
	 	var list = data["list"];
//	 	{
//         "reg_date":"2021-03-23 14:16",
//         "defect_code":"배정완료",
//         "name":"자동배정",
//         "defect_id":14,
//         "seq":2,
//         "defect_type":"코딩오류"
//      }
		defectSubTable = $('#defectSubTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'defect_code' } ,
	            { "mDataProp" : 'dev_name' } ,
	            { "mDataProp" : 'name' },
	            { "mDataProp" : 'reg_date' } 
	        ],
			"columnDefs": [
			    { "targets": 0,  "width": "30%","className": "text-center" },
			    { "targets": 1,  "width": "20%","className": "text-center" },
			    { "targets": 2,  "width": "20%","className": "text-center" },
			    { "targets": 3,  "width": "30%","className": "text-center" },
	
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
	 * common/uploadFile.file -> 첨부파일 등록하기
	 */
	case "common/uploadFile.file":
		
		updateDefectCall(data.imgkey);
		break;
	
	/*
	 * defect/updateDefectState.do ->결함진행 상태 변경
	 */	
	case "defect/updateDefectState.do":
		alert(data["message"]);
		selectDefectDetail(selectedData.defect_id);
		break;
	
	/*
	 * auto/selectAutoDetail.do -> UI 녹화 상세 이력 조회 
	 */		
	case "push/selectAutoDetail.do":
	
		c_window.autoTestShow(
			$("#auto_title").text()					//결함제목
			, data.html						//html json list
			, $("#selectViewType").val()  		//녹화재생 유형 (auto : 자동수행, manual : 수동수행)
			, $("#auto_reg_user").text()	
			, $("#auto_reg_time").text()
		);		
		break;
				
	}

}
var callbackE = function(tran, data){
	
}


/*
 * 결함 상세 조회
 */
var selectDefectDetail = function(defect_id){

	var jsonObj = {
		"defect_id" : defect_id 
	}
	ajaxTranCall("defect/selectDefectDetail.do", jsonObj, callbackS, callbackE);
	
	
	
} 
/*
 * 결함 리스트 조회 함수 (최초 화면로드, 조회버튼 클릭시, 화면 갱신등)
 */
var selectDefectListByCond = function(){

	var jsonObj = {
		"dev_id" : $("#selectDev").val(),
		"test_id" : $("#selectTest").val(),
		"team_id" : $("#selectTeam").val(), 
		"defect_code_type" : $("#selectDefectCode").val(),
		"project_id" : $("#selectProject").val()
	}
	
	if($("#selectTeam").val() != ""){
		jsonObj.dev_id = "";
		jsonObj.test_id = "";
	}
	ajaxTranCall("defect/selectDefectListByCond.do", jsonObj, callbackS, callbackE);
}

/*
 * 화면 최초 로딩시 호출함 (메타 데이터 조회를 병렬로 처리하기 위해서)
 */
var firstSelectListCall = function(type){

	
	//수행상세화면에서 현업의 아이디로 결함아이디 가지고 왔을 경우처리
	if(getUrlParams().test_id != null && getUrlParams().defect_id != null){
		if(type == "user"){
			$("#selectTest").val( getUrlParams().test_id );
			selectDefectListByCond();
			selectDefectDetail(getUrlParams().defect_id)
		}
		return;
	}
	else if(getUrlParams().dev_id != null && getUrlParams().defect_id != null){
		if(type == "user"){
			$("#selectDev").val( getUrlParams().dev_id );
			selectDefectListByCond();
			selectDefectDetail(getUrlParams().defect_id)
		}
		return;
	}
	//메인화면에서 Team 별 미배정 결함 건 선택시
	else if( getUrlParams().team_id != null && getUrlParams().selectDefectCode != null ){
		
		if(type == "team"){
		
			$("#selectDefectCode").val( getUrlParams().selectDefectCode );
			$("#selectTeam").val( getUrlParams().team_id );
			
			selectDefectListByCond();
			return;
		}
	}
	//메인화면에서 현업의 아이디로 조회 하는 경우
	else if(getUrlParams().test_id != null && getUrlParams().selectDefectCode != null){
		
		if(type == "user"){
			$("#selectDefectCode").val( getUrlParams().selectDefectCode );
			$("#selectTest").val( getUrlParams().test_id );
			selectDefectListByCond();
			return;
		}
	}
	else if(getUrlParams().dev_id != null && getUrlParams().selectDefectCode != null){
		if(type == "user"){
			$("#selectDefectCode").val( getUrlParams().selectDefectCode );
			$("#selectDev").val( getUrlParams().dev_id );
			selectDefectListByCond();
			return;
		}
	}
	else if( type == "user") {
		var user_id = getCookie('user_id');
		var role_code = getCookie('role_code');
		
		if(role_code == "DEV"){
			$("#selectDev").val( user_id );
		}
		else if(role_code == "TEST"){
			$("#selectTest").val( user_id );
		}
		
		selectDefectListByCond();
		return;
	}
	
}

/*
 * 결함 내용 수정 요청
 */
var updateDefectCall= function(imgkey){
	
	//변경가능한 데이터 4개 
	//결함 상태 defect_code
	//결함 댓글
	//결함 첨부파일
	//담당 개발자
	var fileList = $("#fileMain").prop('files');
	
	//변경건 체크 
	if( $("#defect_code").val() == selectedData.defect_code 
		&&  $("#comment").val() == ""
		&&  fileList.length < 1
		&&  $("#developer_id").val() == selectedData.developer_id 
	){
		alert("변경사항이 없습니다."); 
		return;
	}
	
	var jsonObj = { 
		"defect_id"     : selectedData.defect_id,
		"defect_code" 	: $("#defect_code").val(),
		"imgkey" 		: imgkey,
		"comment" 		: $("#comment").val(),
		"developer_id" 	: $("#developer_id").val()
		
	};
	
	ajaxTranCall ("defect/updateDefectState.do", jsonObj,  callbackS, callbackE, true);
}
