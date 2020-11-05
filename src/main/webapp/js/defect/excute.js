/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 * @desc    현업이 테스트를 수행하는 화면
 */
var isFirstLoding = true;
//onload 함수 입니다.
var isCheckTest = false;
 /**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	//현업인 팀들 조회 로직입니다.
	ajaxTranCall("user/selectTeamList.do", {role_code:"TEST"}, callBackS, callBackE);
	
	
	if(getUrlParams().isCheckTest != null){
		isCheckTest = true;	
	}
	
	//event
	//조회버튼
	$('#btnSelect').on('click', function(){
		selectTestCaseList();
	});
	
	$("#selectTeam").on('change', function(){
		isFirstLoding = false;
		selectUserList();
	});
	
	$("#selectUser").on('change', function(){
		selectTestCaseList();
	});
	
	$("#selectState").on('change', function(){
		selectTestCaseList();
	});
	
	//"location.href='PAGENAME.html'"
	//서브시스템 Table click event
	$('#caseTable').on('click', function(){
		setTimeout(function() {
			$('#caseTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = caseTable.row($(this)).data();
					
					
					//20200831 ADMIN이 아닌 경우 본인 아이디로 등록된 건만 가져가게 변경
					if(getCookie("role_code")=='ADMIN' || dataJson.tester_id == getCookie("user_id")){
						location.href='/ntm?path=defect/excuteDefect&scenario_id='+dataJson.scenario_id+"&case_id=" +dataJson.case_id ;
					}
					else{
						alert("담당현업만 상세 화면으로 이동가능합니다.");
					}
					
				}
			});
		}, 100);
	});
	
	
}



var callBackS = function(tran, data){
	
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
		ajaxTranCall("code/selectCodeList.do", {"code_group":"C001"}, callBackS, callBackE);
		
		
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
		var list = data["list"];
		
		if(code_group == "C001"){
			for(var i=0; i<list.length; i++){
//				appendSelectBox2( $("#state"), list[i].code_id, list[i].code_name);
				appendSelectBox2( $("#selectState"), list[i].code_id, list[i].code_name);
			}
			
		}
		
		if(getUrlParams().state != null){
			$("#selectState").val(getUrlParams().state);
		}

		//사용자 조회
		selectUserList();
		
		break;
		
		
	case "scenario/selectTestCaseList.do":
		
		var list = data["list"];
		var listTemp = new Array();
		
		
		for(var i=0; i<list.length;i++){
			
			var div = list[i].depth1 + "->" + list[i].depth2 + "->" + list[i].depth3;
			var div = list[i].depth2 + "->" + list[i].depth3;
			if(div == "->"){
				div = "N/A";
			}
			list[i].div = div;
			
			list[i].scenario_name_c =  list[i].scenario_name + " ("+list[i].scenario_code + ")";
			if(isCheckTest){
				var test_check_cnt = Number(list[i].test_check_cnt);
				if(test_check_cnt > 0){
					listTemp.push(list[i]);
				}
			}
			else{
				listTemp.push(list[i]);
			}
			
		}
		isCheckTest = false;
		caseTable = $('#caseTable').DataTable ({
			destroy: true,
	        "aaData" : listTemp,
	        "columns" : [
	            { "mDataProp" : 'rnum' },
	            { "mDataProp" : 'div_name' },
	            { "mDataProp" : 'scenario_name_c' },
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'test_name' } ,
	            { "mDataProp" : 'dev_name' }  ,
	            { "mDataProp" : 'statestr' } ,
	            { "mDataProp" : 'defect_cnt' },
	            { "mDataProp" : 'test_check_cnt' },
	            { "mDataProp" : 'dev_check_cnt' },
	            { "mDataProp" : 'b001_06' },
	            { "mDataProp" : 'b001_05' }
	        ],
			'columnDefs': [
				
			    { "targets": 0, "width":"3%", "className": "text-center" },
			    { "targets": 1, },
			    { "targets": 2, },
			    { "targets": 3,   },
			    { "targets": 4, "className": "text-center" },
			    { "targets": 5, "className": "text-center" },
			    { "targets": 6, "className": "text-center" },
			    { "targets": 7, "width":"5%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 8, "width":"5%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 9, "width":"5%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 10, "width":"5%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 11, "width":"5%","className": "text-center" , "render": function ( data, type, row ) {return data +'건';}}
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
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
	}
};

var callBackE = function(tran, data){
	
};

/*
 * selectTestCaseList -> select box 데이터로 테스트 케이스 목록 조회합니다.
 */
var selectTestCaseList = function(){
	
	var jsonObj = {
		"tester_id" : $("#selectUser").val(),
		"state"	    : $("#selectState").val(), 
		"project_id":$("#selectProject").val()
	}
	ajaxTranCall("scenario/selectTestCaseList.do", jsonObj, callBackS, callBackE);
}

var selectUserList = function(){
	
	//3. 로그인사번에 팀원들 조회 로직
	var jsonObj = {
		"role_code" : "TEST",
		"team_id"   : $("#selectTeam").val()
	};
	ajaxTranCall("user/selectUserList.do", jsonObj, callBackS, callBackE);
}