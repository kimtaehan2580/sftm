/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var isFirstLoad = true;

var devDefectTable;
var teamUserModalTable;
var testAutoModalTable;

var modalTableDevUpdate; //teamUserModalTable

var modalTabledefectHistroty;


var modalTableImg;

var b001List;

 /**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	isFirstLoad = true;
	
	// URL에 특정 파라메터가 존재시에 자동으로 맵핑하는 작업입니다.
	if(getUrlParams().selectDefectCode != null){
		$("#selectDefectCode").val(
			getUrlParams().selectDefectCode
		);
		
		//미배정건의 경우 개발자가 지정되지 않기 떄문에 세팅하지 않습니다.
		if(getUrlParams().selectDefectCode == "1"){
			isFirstLoad = false;
		}
	}
		
	//팀정보 조회합니다.
	ajaxTranCall("user/selectTeamList.do", {role_code:"DEV"}, callbackS, callbackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"A001"}, callbackS, callbackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"B001"}, callbackS, callbackE);
	
	
	//조회 버튼  선택시
	$('#btnSelect').on('click', function(){
		selectDefectByDevIdList();
	});
	
	$("#selectTeam").on('change', function(){
		isFirstLoad = false;
		selectUserList($(this).val());
		selectDefectByDevIdList();
	});	
	
	$("#selectUser").on('change', function(){
		selectDefectByDevIdList();
	});
	
	$("#selectDefectCode").on('change', function(){
		selectDefectByDevIdList();
	});
	
	
	$("#selectTeam2").on('change', function(){
		ajaxTranCall("user/selectUserList.do", {team_id:$(this).val(), role_code:"DEV"}, callbackPupupS, callbackE);
	});
	
	
	$("#defect_code").on('change', function(){
		
		//미조치건 안내
		if($(this).val() == "B001_04" ){
			alert("미조치건은 테스터와 협의 후에 진행해주세요 \n테스터가 결함종료를 선택해야지 결함에서 제외됩니다.");
		}
		//개발지연건 안내
		else if($(this).val() == "B001_05" ){
			alert("개발지연건은 솔루션 또는 타업무와 연관된 지연건만 가능합니다. \n관리자가 반려할 수 있습니다.");
		}
		
	});
	
	
	//개발자 결함 이력 Table click event
	$('#devDefectTable').on('click', function(){
		setTimeout(function() {
			$('#devDefectTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = devDefectTable.row($(this)).data(); 
					if( common.isAdmin() || dataJson.defect_user == getCookie("user_id")){
						
//						$("#btnSave").show();
					}
					else{
//						$("#btnSave").hide();
					}
					//결함상태 select box 초기화 및 선택값에 따른 처리 내용 정리
					$("#defect_code").html("");
					for(var i=0; i<b001List.length; i++){
						
						//결함 상태건은 항상 보여줍니다. 
						if(dataJson.defect_code == b001List[i].code_id){
							appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
						}
						//결함이 결함등록, 결함종료, 조치완료, 미조치건은  개발자가 건들수 없습니다. 
						else if(dataJson.defect_code == "B001_01" 
							|| dataJson.defect_code == "B001_03"
							|| dataJson.defect_code == "B001_04"
							|| dataJson.defect_code == "B001_06"){
						}
						else if(b001List[i].code_id == "B001_03" 
							|| b001List[i].code_id == "B001_04"  
							|| b001List[i].code_id == "B001_05"){
							appendSelectBox2( $("#defect_code"), b001List[i].code_id, b001List[i].code_name);
						}
					}
					//결함이  결함종료, 조치완료, 미조치건은  개발자변경불가 
					if(  dataJson.defect_code == "B001_03"
						|| dataJson.defect_code == "B001_04"
						|| dataJson.defect_code == "B001_06"){
						$("#btnDevUpdate").hide();
					}
					else{
						$("#btnDevUpdate").show();
					}
					
					
					//기본데이터 설정
					modal.convertJsonObjToModal("devDefectModalTable", dataJson)
					
					//저장된 이미지 조회 
					ajaxTranCall("defect/selectDefectDetail.do", dataJson, callbackS, callbackE);
					
					//결함이력 조회 
					ajaxTranCall("defect/selectDefectHistory.do", {"defect_id": dataJson["defect_id"]}, callbackPupupS, callbackE);
					
					//테스트자동화 List 조회
					ajaxTranCall("auto/selectAutoList.do", {"defect_id": dataJson["defect_id"]}, callbackPupupS, callbackE);
					
					//개발자 목록 조회
					ajaxTranCall("user/selectUserList.do", { role_code:"DEV"}, callbackPupupS, callbackE);
					
					
					
				}
			});
		}, 100);
	});
	
	/*
	 * 개발자가 결함 변경내용 저장시 호출 됩니다.
	 */
	$("#btnSave").on('click', function(){
		var dataJson = modal.convertModalToJsonObj("devDefectModalTable" );
		dataJson["defect_code_nm"] = $("#defect_code option:checked").text();
		ajaxTranCall("defect/updateDefectByDev.do", dataJson, callbackS, callbackE);
	});
	
	//modal 1 개발자 변경 관련 이벤트 모음
	$('#btnDevUpdate').on('click', function(){
		$('#modalUser').modal();
	});
	
	//modal user table click 
	$('#modalTableDevUpdate').on('click', function(){
		setTimeout(function() {
			$('#modalTableDevUpdate tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = modalTableDevUpdate.row($(this)).data(); 
					if(confirm("선택한 개발자를 조치자로 변경하시겠습니까?")){
						$("#defect_user").val(dataJson["user_id"]);
						$("#defect_user_name").val(dataJson["name"] );
						
						var json =  {
							"defect_user" : $("#defect_user").val(), 
							"defect_id" : $("#defect_id").val()
						}
						
						//개발자 변경 로직
						ajaxTranCall("defect/updateDefectDev.do", json, callbackS, callbackE);
					
//						$('#modalUser').modal("hide"); //닫기 
					}
				}
			});
		}, 100);
	});
	
	
	//modal 2 결함 히스토리 확인 
	$('#btndefectHistory').on('click', function(){
		$('#modalDefactHistory').modal();
		//modalTabledefectHistroty
	});
	
	//modal 3 자동테스트
	$('#btnAutoTest').on('click', function(){
		$('#modalAutoTest').modal();
	});
	
	
	//modal user table click 
	$('#modalTableautoTest').on('click', function(){
		setTimeout(function() {
			$('#modalTableautoTest tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = modalTableautoTest.row($(this)).data(); 
					ajaxTranCall("auto/selectAutoDetail.do", {"id": dataJson["id"]}, callbackPupupS, callbackE);
				}
			});
		}, 100);
	});
	
	$('#modalTableImg').on('click', function(){
		setTimeout(function() {
			$('#modalTableImg tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = modalTableImg.row($(this)).data(); 
					var ext = dataJson.ext.toLocaleLowerCase();
					if(ext == "jpg" || ext == "png"){
						$("#selectedImg").attr("src", getFileUrl( dataJson.id, dataJson.seq));
					}
					else{
						$("#selectedImg").attr("src", getimgUrl(dataJson.originfilename, getFileUrl( dataJson.id, dataJson.seq)) );
					}
					
					$("#selectedImg").attr("tag", getFileUrl( dataJson.id, dataJson.seq));
					
					$("#selectedFileName").text(dataJson.originfilename);
					$("#selectedName").text(dataJson.name);
					$("#selectedDate").text(dataJson.reg_date_str);
					
					var filesize = Number(dataJson.filelength);
					$("#selectedSize").text(bytesToSize(filesize));
				}
			});
		}, 100);
	});
	
	
	$('#btnDown').on('click', function(){
		$("#fileDownObj").attr('src', $("#selectedImg").attr("tag") );
	});
}


var selectUserList = function(team_id){
	
	
	
	var jsonObj = {};
	if(team_id == null || team_id == ""){
		jsonObj["team_id"] = "";
		jsonObj["role_code"] = "DEV";
	}
	else{
		$("#selectTeam").val(team_id);
		$("#selectTeam2").val(team_id);
		
		if($("#selectTeam").val() == null){
			$("#selectTeam").val("");
			$("#selectTeam2").val("");
			jsonObj["team_id"] = "";
			jsonObj["role_code"] = "DEV";
		}
		else{
			jsonObj["team_id"] = team_id;
			jsonObj["role_code"] = "DEV";
			
		}
	}
	ajaxTranCall("user/selectUserList.do", jsonObj, callbackS, callbackE);
}


/*
 * modal에서 동일한 전문 호출시 응답처리 따로 하기 위해 제작
 */
var callbackPupupS = function(tran, data){
	switch(tran){
	
	case "auto/selectAutoDetail.do":
		var list = data["list"];
		
		
//		select  at.id
//		 		,at.defect_id
//				,at.html
//				,sftm.GET_WHAT_DAY(at.reg_date) as what_day
//				,us.name 
//				,us.user_id 
//				, TO_CHAR(at.reg_date, 'YYYY-MM-DD HH24:MI')  reg_date_str
				
		c_window.autoTestShow(
			$("#title").val()					//결함제목
			, list[0].html						//html json list
			, $("#selectViewType").val()  		//녹화재생 유형 (auto : 자동수행, manual : 수동수행)
			, list[0].name + " (" + list[0].user_id + ")"
			, list[0].what_day
		);		
//		skInterface.autoTestShow($("#title").val(), list[0].html, $("#selectViewType").val());
		
		break;
		
	case "defect/selectDefectHistory.do":
		
		var list = data["list"];
		$("#spanDefectHistoryCnt").text(list.length + "건");
		
		modalTabledefectHistroty = $('#modalTabledefectHistroty').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'test_type' },
	            { "mDataProp" : 'defect_code' } ,
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'reg_date' } 
	        ],
			'columnDefs': [
				{ "targets": 0,  "className": "text-center" },
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" }
			  
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    pageLength:5, //기본 데이터건수
//		    pageLength:15, //기본 데이터건수
//	        "scrollCollapse": false,
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
		
		
//		
	//테스트 자동화 목록 조회시 (defect_id로 조회 가능)
	case "auto/selectAutoList.do":
		var list = data["list"];
		$("#spanAutoTestCnt").text(list.length + "건");
		modalTableautoTest = $('#modalTableautoTest').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'reg_date' } 
	        ],
'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" } 
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    pageLength:5, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			"scrollCollapse": false,
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
		
	case "user/selectUserList.do":
		var list = data["list"];
		
		modalTableDevUpdate = $('#modalTableDevUpdate').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'name' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    pageLength:5, //기본 데이터건수
//		    pageLength:15, //기본 데이터건수
//	        "scrollCollapse": false,
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		break;
	}
}
var callbackS = function(tran, data){
	
	
	switch(tran){
	//개발자 변경 로직
	case "defect/updateDefectDev.do":
		if(data["resultCode"] == "0000" ){
			alert(data["message"]);
			$('#modalUser').modal("hide"); //닫기 
			
			
			selectDefectByDevIdList();
		}
		break;
	
	case "defect/updateDefectByDev.do":
		if(data["resultCode"] == "0000" ){
			alert(data["message"]);
			$('div.modal').modal("hide"); //닫기 
			
			//결함이력 재조회 
			ajaxTranCall("defect/selectDefectHistory.do", {"id": $("#id").val()}, callbackPupupS, callbackE);
			
			selectDefectByDevIdList();
		}
		break;
	case "code/selectCodeList.do":
		
		var code_group = data["code_group"];
		var list = data["list"];
		
		if(code_group == "B001"){
			
//			appendSelectBox2( $("#selectDefectCode"), '', "결함상태 전체");
			
			b001List = list;
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_code"), list[i].code_id, list[i].code_name);
				
				//20200812 조회조건 값 추가함
//				appendSelectBox2( $("#selectDefectCode"), list[i].code_id, list[i].code_name);
			}
		}	
		
		else if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#test_type"), list[i].code_id, list[i].code_name);
			}
		}
		break;
		
		
	case "scenario/selectDefectByDevIdList.do":
		
//		$("#btnSave").hide();
		var list = data["list"];
		
		var scenario_case = "";
		for(var i=0; i<list.length; i++){
			
			list[i].scenario_case = list[i].scenario_name + "<br/>" + list[i].case_name
		}
		
		devDefectTable  = $('#devDefectTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'rnum' },
//	            { "mDataProp" : 'scenario_name' } ,
	            { "mDataProp" : 'scenario_case' } ,
//	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'title' } ,
	            { "mDataProp" : 'test_type_name' } ,
	            { "mDataProp" : 'defect_name' } ,
	            { "mDataProp" : 'reg_name' },
	            { "mDataProp" : 'defect_user_name' },
	            { "mDataProp" : 'reg_date' } ,
//	            { "mDataProp" : 'resolve_date' } 
	            //
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
//			    { "targets": 1, "className": "text-center" },
//			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" },
			    { "targets": 4, "className": "text-center" },
			    { "targets": 5, "className": "text-center" },
			    { "targets": 6, "className": "text-center" },
			    { "targets": 7, "className": "text-center" },
//, 
//			    { "targets": 9, "className": "text-center" }
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
	
		//팀 정보 전체 조회
		case "user/selectTeamList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectTeam"), 	"", 	"개발팀 전체");
			htmlSelectBox2($("#selectTeam2"),	"", 	"개발팀 전체");
			
			for(var i=0; i<list.length; i++){
					appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
					appendSelectBox2( $("#selectTeam2"), list[i].id, list[i].name);
			}
			
			var team_id = getCookie('team_id');
//			isFirstLoad = true;
			selectUserList(team_id);
			break;
			
		//user 정보 조회함
		case "user/selectUserList.do":
			var list = data["list"];
			htmlSelectBox2($("#selectUser"), "", "전체");
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#selectUser"), list[i].user_id, list[i].name);
			}
			
			var user_id = getCookie('user_id');
			if( isFirstLoad ){
				$("#selectUser").val(user_id);
				if($("#selectUser").val() == null){
					$("#selectUser").val("");
				}
			}
			else{
			}
			
			selectDefectByDevIdList();
			
			break;
		case "defect/selectDefectDetail.do":
			
			var list = data["list"];
			$("#existingImgs").html("");
			
			modalTableImg = $('#modalTableImg').DataTable ({
				destroy: true,
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'originfilename' },
		            { "mDataProp" : 'what_day' } 
		        ],
				'columnDefs': [
				{ "targets": 0,  },
			    { "targets": 1, "className": "text-center" }
			  
			],
		        "language": {
			        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
			    },
// 			
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching:false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
//			"scrollY":        230,
//			"scrollCollapse": false,
//			pageLength:10, //기본 데이터건수
			select: {
	            style: 'single' //single, multi
			}
				
		    });


			if(list.length > 0){
				
				for(var i=0 ; i<list.length; i++){
					
					var originfilename = list[i].originfilename;
					
				
					var htmlStr = '<img id="img'+i+'" alt="'+originfilename+'"; title="'+originfilename+'"; style="height:80px; padding:5px; max-width:100px;"/>';
//					var htmlStr = '<div style="width:100px; align:left; "><img id="img'+i+'" alt="'+originfilename+'"; title="'+originfilename+'"; style="max-height:100px; max-width:100px; "/></div>';
					$("#existingImgs").append(htmlStr);
					
					var ext = list[i].ext;
					
					
					$("#img"+i).attr("tag", list[i].seq );
					$("#img"+i).attr("src", getimgUrl(originfilename, getFileUrl( list[i].id, list[i].seq)) );
					
					//click 이벤트 
					$("#img"+i).on('click', function(e){
//						$("#fileDownObj").attr('src', $(this).attr("tag"));
						
						var seq = $(this).attr("tag");
						
						$('#modalTableImg tbody tr').each(function(){
							var dataJson = modalTableImg.row($(this)).data(); 
							console.log(dataJson);
							$(this).removeClass('selected');
							if(seq == dataJson.seq){
								
								var dataJson = modalTableImg.row($(this)).data(); 
								var ext = dataJson.ext.toLocaleLowerCase();
								if(ext == "jpg" || ext == "png"){
									$("#selectedImg").attr("src", getFileUrl( dataJson.id, dataJson.seq));
								}
								else{
									$("#selectedImg").attr("src", getimgUrl(dataJson.originfilename, getFileUrl( dataJson.id, dataJson.seq)) );
								}
								
								$("#selectedImg").attr("tag", getFileUrl( dataJson.id, dataJson.seq));
								
								$("#selectedFileName").text(dataJson.originfilename);
								$("#selectedName").text(dataJson.name);
								$("#selectedDate").text(dataJson.reg_date_str);
								
								var filesize = Number(dataJson.filelength);
								$("#selectedSize").text(bytesToSize(filesize));
								
								
//								$(this).addClass('selected');
//								setTimeout(() => $("#modalTableImg").trigger('click'), 500);
							}
//							
						});
						$("#modalImg").modal();
					});
				
				
				}
			}
			
			
			
			
			break;	
			
		
		
	}
}

var callbackE = function(tran, data){
	
}

var selectDefectByDevIdList = function(){
	var jsonObj = {
		"dev_id" : $("#selectUser").val(),
		"team_id" : $("#selectTeam").val(), 
		"defect_code_type" : $("#selectDefectCode").val(),
		"project_id" : $("#selectProject").val()
	}
	
	if($("#selectDefectCode").val() == "1"){
		jsonObj.dev_id = "";
	}
	
	ajaxTranCall("scenario/selectDefectByDevIdList.do", jsonObj, callbackS, callbackE);
}



var modalOpen = function(type, e, dt, node, config ) {
	
//	modal.modalClear("userTableModal");	
	
	if(type == "1"){
		$('#modalTitle').text("신규결함 등록");
//		$('#btnSave').show();
		$('#btnUpdate').hide();
		
		//초기화 작업 필요
		$("#title").val("");
		$("#test_type").val("0");
		$("#description").val("");
		$("#description").val("");
		$("#files").val("");

		$("#imgs").html("");
		$("#existingImgsTr").hide();
		

        // readonly 삭제
        $("#test_type").removeAttr("readonly");
		
	}
	else{
		
		$('#modalTitle').text("결함 수정");
//		$('#btnSave').hide();
		$('#btnUpdate').show();
		$("#test_type").val("0");
		
		 // 텍스트 박스 readonly 처리
        $("#test_type").attr("readonly",true);
		$('#defectTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 var datajson = defectTable.row($(this)).data();
				 modal.convertJsonObjToModal("defectTableModal", datajson );
				 
				 $("#existingImgs").html("");
				 
				 //상세조회 이미지 + 자동테스트건
				 ajaxTranCall("defect/selectDefectDetail.do", datajson, callbackS, callbackE);
			 }
		});
		$("#imgs").html("");

		$("#existingImgsTr").show();
		
		
		
		
	}
	
	$('div.modal').modal();
}
