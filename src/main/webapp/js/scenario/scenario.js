/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableScenario, tableTestcase ;

var tcTableModalUser, scTableModalUser;

var isTester = "TEST";


 /**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	//업무구분 A 조회
	ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callbackS, callbackE);
	
	selectScenario();
	
	
	//조회버튼
	$('#btnSelect2').on('click', function(){
		$('#tableScenario tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableScenario.row($(this)).data(); 
				ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callbackE);
			}
		});
	});
	$('#btnSelect').on('click', function(){
		selectScenario();
	});
	
	
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
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackS, callbackE);
		selectScenario();
	});
	
	$("select[name=selectB]").on('change', function(){
		$("select[name=selectB]").val($(this).val());
		htmlSelectBox2($("select[name=selectC]"), "", "소분류");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()}, callbackS, callbackE);
		selectScenario();
	});
	
	$("select[name=selectC]").on('change', function(){
		$("select[name=selectC]").val($(this).val());
		selectScenario();
	});
	
	$("select[name=is_batch]").on('change', function(){
		ajaxTranCall("code/selectTypeGroupList.do", {is_batch : $("#is_batch").val()}, callbackModalS, callbackE);
	
	});
	
	
	$("select[name=modalSelectA]").on('change', function(){
		$("select[name=modalSelectA]").val($(this).val());
		htmlSelectBox2($("select[name=modalSelectB]"), "", "선택해주세요.");
		htmlSelectBox2($("select[name=modalSelectC]"), "", "선택해주세요.");
		
		if($("select[name=modalSelectA]").val() == ""){
			htmlSelectBox("modalSelectB", "", "전체");
			htmlSelectBox("modalSelectC", "", "전체");
			return;
		}
		
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callbackModalS, callbackE);
	});
	
	$("select[name=modalSelectB]").on('change', function(){
		$("select[name=modalSelectB]").val($(this).val());
		htmlSelectBox2($("select[name=modalSelectC]"), "", "선택해주세요.");
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": $(this).val()}, callbackModalS, callbackE);
	});
	
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		var dataJson = modal.convertModalToJsonObj("seTableModal" );
		if(modal.modalCheckInputData("seTableModal")){
			dataJson.tester_id = $("#sc_tester").val();
			dataJson.dev_id= $("#sc_developer").val();
			dataJson.project_id = $("#selectProject").val();
			ajaxTranCall("scenario/insertScenario.do", dataJson, callbackS, callbackE);
		}
		
	});
	
	//modalType
	//신규 저장버튼 click event
	$("#btnUpdate").click(function(e){
		
		//필수값 체크 로직 추가
		if(!modal.modalCheckInputData("seTableModal")) 
			return;
		var dataJson = modal.convertModalToJsonObj("seTableModal");
		ajaxTranCall("scenario/updateScenario.do", dataJson, callbackS, callbackE);
	});
	
	
	//서브시스템 Table click event
	$('#tableScenario').on('click', function(){

		setTimeout(function() {
			$('#tableScenario tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableScenario.row($(this)).data(); 
					
					ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callbackE);
					$("#spanTCName").text(dataJson.scenario_name);
					$("#tc_scenario_name").val(dataJson.scenario_name);
					$("#tc_scenario_code").val(dataJson.scenario_code);
					$("#tc_scenario_id").val(dataJson.scenario_id);
					
				}
			});
		}, 100);
	});
 
	
	
	$('#tcTableModalUser').on('click', function(){
		setTimeout(function() {
			$('#tcTableModalUser tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tcTableModalUser.row($(this)).data(); 
					if($("input[name=tc_select]:checked").val() == "TEST"){
						$("#tester").val(dataJson.user_id);
						$("#tester_nm").val("(" +dataJson.team_name + ") " +dataJson.name);
					}
					else{
						$("#developer").val(dataJson.user_id);
						$("#developer_nm").val("(" +dataJson.team_name + ") " +dataJson.name);
					}
				}
			});
		}, 100);
	});
	
	$('#scTableModalUser').on('click', function(){
		setTimeout(function() {
			$('#scTableModalUser tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = scTableModalUser.row($(this)).data(); 
					if($("input[name=sc_select]:checked").val() == "TEST"){
						$("#sc_tester").val( dataJson.user_id);
						$("#sc_tester_nm").val("(" +dataJson.team_name + ") " +dataJson.name);
					}
					else{
						$("#sc_developer").val(dataJson.user_id);
						$("#sc_developer_nm").val("(" +dataJson.team_name + ") " +dataJson.name);
					}
				}
			});
		}, 100);
	});
	
	
	$('#btnSaveTc').on('click', function(){
		var dataJson = modal.convertModalToJsonObj("tcTableModal" );
		
		if(modal.modalCheckInputData("tcTableModal")){
			ajaxTranCall("scenario/insertTestcase.do", dataJson, callbackS, callbackE);
		}
		
	});
	$('#btnUpdateTc').on('click', function(){
		var dataJson = modal.convertModalToJsonObj("tcTableModal" );
		if(modal.modalCheckInputData("tcTableModal")){
			ajaxTranCall("scenario/updateTestcase.do", dataJson, callbackS, callbackE);
		}
		
	});
	
	
	$('#file1').on('change', function(e){

		var fileBuffer = [];
        var target = $("#file1");
        
        Array.prototype.push.apply(fileBuffer, target.files);
        var html = "";
        $.each(target[0].files, function(index, file){
            var fileName = file.name;
            var fileEx = fileName.slice(fileName.indexOf(".") + 1).toLowerCase();
            if(fileEx != "xls"){
                alert("xls 파일 형식만 등록 가능합니다.");
                return false;
            }
        });
	        
        ajaxFormExcel("excel/uploadExcelScenario.excel", "file1", callbackS);

	});
	
	
	$("input[name=sc_select]").on('change', function(){
		
		var sc_select = $("input[name=sc_select]:checked").val();
		ajaxTranCall("user/selectTeamList.do", {role_code:sc_select}, callbackS, callbackE);
		ajaxTranCall("user/selectUserList.do", {role_code:sc_select}, callbackS, callbackE);
	});
	
	
	$("input[name=tc_select]").on('change', function(){
		var tc_select = $("input[name=tc_select]:checked").val();
		ajaxTranCall("user/selectTeamList.do", {role_code:tc_select}, callbackS, callbackE);
		ajaxTranCall("user/selectUserList.do", {role_code:tc_select}, callbackS, callbackE);
	});
	
	
	
	$("select[name=sc_team]").on('change', function(){
		ajaxTranCall("user/selectUserList.do", {role_code:$("input[name=sc_select]:checked").val(), team_id:$("#sc_team").val()}, callbackS, callbackE);
	});
	$("select[name=tc_team]").on('change', function(){
		ajaxTranCall("user/selectUserList.do", {role_code:$("input[name=tc_select]:checked").val(), team_id:$("#tc_team").val()}, callbackS, callbackE);
	});
	
	//케이스유형 Select change event 
	//
	$("select[name=case_pattern]").on('change', function(){
		
		var case_pattern = $("#case_pattern").val();
		if(case_pattern == ""){
			$( '#layerModalScenarioDlg' ).removeClass( 'modal-xl' );
			$( '#layerModalScenarioDlg' ).addClass( 'modal-lg' );
			$( '#layerModalScenarioDiv1' ).addClass( 'col-md-12' );
			$( '#layerModalScenarioDiv1' ).removeClass( 'col-md-7' );
			$( '#layerModalScenarioDiv2' ).removeClass( 'col-md-5' );
			$( '#layerModalScenarioDiv2' ).hide();
			
			$( '#trTest' ).hide();
			$( '#trDev' ).hide();
			
		}
		else{
			$( '#layerModalScenarioDlg' ).removeClass( 'modal-lg' );
			$( '#layerModalScenarioDlg' ).addClass( 'modal-xl' );
			$( '#layerModalScenarioDiv1' ).removeClass( 'col-md-12' );
			$( '#layerModalScenarioDiv1' ).addClass( 'col-md-7' );
			$( '#layerModalScenarioDiv2' ).addClass( 'col-md-5' );
			$( '#layerModalScenarioDiv2' ).show();
			
			$( '#trTest' ).show();
			$( '#trDev' ).show();
			
			
			//test case text 조회하기
//			sc_desc
			ajaxTranCall("code/selectTypeList.do", {id:case_pattern}, callbackS, callbackE);
//			sc_select
			
		}
		
	});
	
	
	
	//테스트케이스 추가 팝업 
	//테스터 Input box 선택시 호출
//	$('#tester_nm').on('click', function(){
//		if($('input[name=tc_select]:checked').val() != "TEST"){
//			$("#tc_select_dev").removeAttr("checked");
//			$("#tc_select_test").attr("checked", "checked");
//			$("input[name=tc_select]:checked").val("TEST");
//			setTimeout(() => $("input[name=tc_select]").trigger('change'), 500);
//		}
//	});
//	$('#developer_nm').on('click', function(){
//		if($('input[name=tc_select]:checked').val() != "DEV"){
//			$("#tc_select_test").removeAttr("checked");
//			$("#tc_select_dev").attr("checked", "checked");
//			$("input[name=tc_select]:checked").val("DEV");
//			setTimeout(() => $("input[name=tc_select]").trigger('change'), 500);
//		}
//	});
	
	
	
//	$('#sc_tester_nm').on('click', function(){
//		//$("input:radio[name='sc_select']").val()
//		
//		alert($("input[name=sc_select]:checked").val());
//		if($("input[name=sc_select]:checked").val() != "TEST"){
//			$("#sc_select_dev").removeAttr("checked");
//			$("#sc_select_test").attr("checked", "checked");
//			$("input[name=sc_select]:checked").val("TEST");
//			setTimeout(() => $("input[name=sc_select]:checked").trigger('change'), 100);
//		}
//	});
//	$('#sc_developer_nm').on('click', function(){
//		if($("input[name=sc_select]:checked").val() != "DEV"){
			$("#sc_select_test").removeAttr("checked");
			$("#sc_select_dev").attr("checked", "checked");
			$("input[name=sc_select]:checked").val("DEV");
			setTimeout(() => $("input[name=sc_select]").trigger('change'), 100);
//		}
//	});
			
	
}

/**
 * project select change event handler
 * @param {}
 * @returns {} 
 */
var selectProjectChageEvent = function(project_id){
	
	selectScenario();
	
}

//ajaxTranCall("scenario/selectScenario.do", {}, callbackS, callbackE);

var selectScenario = function (){
	var jsonObj = {
			"depthA": $("#selectA").val(),
			"depthB": $("#selectB").val(),
			"depthC": $("#selectC").val(),
			"project_id" : $("#selectProject").val()
	}
	
	
	ajaxTranCall("scenario/selectScenario.do", jsonObj, callbackS, callbackE);
}

var detpth1 = "";
var detpth2 = "";
var detpth3 = "";
var callbackModalS = function(tran, data){
	
	var list = data["list"];
	switch(tran){
		
	case "code/selectTypeGroupList.do":
		htmlSelectBox("case_pattern", "", "직접입력");
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#case_pattern"), list[i].id, list[i].type_group);
		}
		$("#case_pattern").val("");
				
		break;
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
		
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			if(detpth == "B"){
				htmlSelectBox("modalSelectB", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=modalSelectB]"), list[i].div_id, list[i].name);
				}
				
				if(detpth2 != ""){
					$('#modalSelectB').val(detpth2);
					detpth2 = "";
				}
			}
			else if(detpth == "C"){
				htmlSelectBox("modalSelectC", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=modalSelectC]"), list[i].div_id, list[i].name);
				}
				
				if(detpth3 != ""){
					$('#modalSelectC').val(detpth3);
					detpth3 = "";
				}
			}
		}
		
		break;
	
	case "scenario/selectDivDepth.do":
		
		if(data["resultCode"] == "0000" ){
			
			 detpth1 = data["detpth1"];
			 detpth2 = data["detpth2"];
			 detpth3 = data["detpth3"];
			 
			$('#modalSelectA').val(detpth1);
			

			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": detpth1 }, callbackModalS, callbackE);
			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"C", "upcode": detpth2 }, callbackModalS, callbackE);
			$("#layerModalScenario").modal();
		}
		
		break;
	}
}

var callbackS = function(tran, data){
	
	var list = data["list"];
	switch(tran){
		
	case "excel/uploadExcelScenario.excel":
		$("#file1").val("");
		
		var msg = data["message"];
		if(list.length != 0){
			msg += "\n" + list.length+ "건은 실패된 데이터는 자동으로 액셀다운로드 진행됩니다.";
			
			var arrayJson = [];
			for(var i=0; i<list.length; i++){
				var tempJson = {
					"div_name": list[i].col0,
					"project_id": list[i].col1,
					"scenario_id": list[i].col2,
					"scenario_name": list[i].col3,
					
					"is_batch": list[i].col4,
					
					"scenario_code": list[i].col5,
					
					"scenario_desc": list[i].col6,
					"type": list[i].col7,
					
					"case_id": list[i].col8,
					"case_name": list[i].col9,
					"case_desc": list[i].col10,
					"tester_id": list[i].col11,
					"developer_id": list[i].col13,
					"result":list[i].result
				};
				
				arrayJson.push(tempJson);
			}
			
			ajaxTranCall("excel/downloadScenarioExcel.do", {"list":arrayJson} ,callbackS, callbackE);
		}
		
		alert(msg);
		selectScenario();
		callbackS("scenario/selectTestCaseList.do", {list:[], "resultCode" : "0000"});
		
		break;
		
	//excel 다운로드 전문 호출시 경로만 내려줍니다.
	case "excel/downloadScenarioExcel.do":
		
		if(data["filePath"] == ""){
			alert("파일 다운로드에 실패했습니다.");
			return;
		}
		else{
			
			var temp = getExcelFileUrl( data["filePath"]);
			$("#fileDownObj").attr('src',  temp);
		}
		
		break;
	
	case "scenario/deleteScenario.do":
	case "scenario/insertScenario.do":
		callbackS("scenario/selectTestCaseList.do", {"list":[], "resultCode":"0000"});

	case "scenario/updateScenario.do":
		
		if(data["resultCode"] == "0000" ){
			
			$('div.modal').modal("hide"); //닫기 
			
			alert(data["message"]);
			selectScenario();
			callbackS("scenario/selectTestCaseList.do", {list:[], "resultCode" : "0000"});
		}
		break;
		
	case "scenario/deleteTestcase.do":
	case "scenario/insertTestcase.do":
	case "scenario/updateTestcase.do":
		
		if(data["resultCode"] == "0000" ){
			
			$('div.modal').modal("hide"); //닫기 
			alert(data["message"]);
			
			$('#tableScenario tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableScenario.row($(this)).data(); 
					ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callbackE);
				}
			});
		}
		break;
		
		
	case "user/selectTeamList.do":
		
		if(list[0].role_code == "TEST"){
			htmlSelectBox2($("#tc_team"), "", "테스터팀 전체");
			htmlSelectBox2($("#sc_team"), "", "테스터팀 전체");
		}
		else{
			htmlSelectBox2($("#tc_team"), "", "개발팀 전체");
			htmlSelectBox2($("#sc_team"), "", "개발팀 전체");
		}
		
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#tc_team"), list[i].id, list[i].name);
			appendSelectBox2($("#sc_team"), list[i].id, list[i].name);
		}
		break;
		 
		case "user/selectUserList.do":
		scTableModalUser = $('#scTableModalUser').DataTable ({
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
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			}
			
	    });
		tcTableModalUser = $('#tcTableModalUser').DataTable ({
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
//	ajaxTranCall("scenario/selectTestCaseList.do", dataJson, callbackS, callbackE);
//	tableScenario
	//testCase list 조회완료 
	case "scenario/selectTestCaseList.do":
		if(data["resultCode"] == "0000" ){
			//{"scenario_code":"CLUZ0922U","reg_date":1589049872316,"case_code":"A_CASE_0001",
			//"project_id":0,"reg_user":"admin","modify_user":"admin","case_name":"화면 일반 테스트",
			//"description":"화면 일반 테스트","modify_date":1589049872316}
			tableTestcase = $('#tableTestcase').DataTable ({
				destroy: true,
		        "aaData" : list,
		        "columns" : [
		            { "mDataProp" : 'case_name' },
		            { "mDataProp" : 'test_name' },
		            { "mDataProp" : 'dev_name' },
		            { "mDataProp" : 'statestr' }
		        ],
				'columnDefs': [
//				    { "targets": 0, "width":"55%", "className": "text-center" },
				    { "targets": 1, "width":"15%", "className": "text-center" },
				    { "targets": 2, "width":"15%", "className": "text-center" },
				    { "targets": 3, "width":"15%", "className": "text-center" }
				],
		        "language": {
			        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
			    },

			    pageLength:15, //기본 데이터건수
				lengthChange: false, 	// 표시 건수기능 숨기기
				searching: true,  		// 검색 기능 숨기기
				ordering: false,  		// 정렬 기능 숨기기
				info: false,			// 정보 표시 숨기기
				paging: true, 			// 페이징 기능 숨기기
				select: {
		            style: 'single' //single, multi
				},
				"scrollY":        560,
		        "scrollCollapse": false,
		       
		        dom : 'Bfrtip',
		        buttons: [
		            {
		                text: '등록',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) {
		                	modalOpen("3", detpth, e, dt, node, config );
		                	
		                }
		            },
		            {
		                text: '수정',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) {
		                	modalOpen("4", detpth, e, dt, node, config );
		                }
		            },
		            {
		                text: '삭제',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) { 
		                	
		                	var isSelected = false;
		                	
		                	
		                	$('#tableTestcase tr').each(function(){
		        				if($(this).hasClass('selected') ){
		        					isSelected = true;
		        					if(confirm("선택된 테스트 케이스를 삭제하시겠습니까?")){
		        						var dataJson = tableTestcase.row($(this)).data(); 
			        					ajaxTranCall("scenario/deleteTestcase.do", dataJson, callbackS, callbackE);
		        					}
		        				}
		        			});
		                	
		                	if(!isSelected){
		                		alert(MSG.SELETED_DELETE_OBJ);
		                	}
		                }
		            },
					{
		                text: '다운로드',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) {
		
							//////////////////////////
							var isSelected = false;
							var jsonData = { };
							var dataJson;
							$('#tableScenario tr').each(function(){
								if($(this).hasClass('selected') ){
									dataJson = tableScenario.row($(this)).data();
									isSelected = true;
								}
							});
							
							if(isSelected ){
								var isAll = confirm("전체 데이터를 다운로드 하시겠습니까?\n(확인 : 전체, 취소 : 선택건만)");
					        	if(!isAll){
									//
									jsonData.scenario_id = dataJson.scenario_id
								}
							}
					    	
							ajaxTranCall("excel/downloadScenarioExcel.do", jsonData ,callbackS, callbackE);
		                	
		                }
		            },
					{
		                text: '업로드',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) {
//		                	if( getCookie("role_code") != "ADMIN" && getCookie("role_code") != "TEST"){
//								alert("권한이 없습니다. \n관리자에게 문의하세요");
//								return;
//							}
//							
							$('#file1').trigger('click');
		                	
		                }
		            }
		        ]
				
		    });
			
		}
		common.tableMappingAfterProcess();
//		$('.dt-button').attr("type", "button");
//		$('.dt-button').removeClass('dt-button');
		
		
		break;
	//시나리오 상단 업무구분 정보 조회
	case "scenario/searchDivListWithCombo.do":
	
	
		
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "전체");
				htmlSelectBox("modalSelectA", "", "선택해주세요.");
				for(var i=0; i<list.length; i++){
					appendSelectBox2($("select[name=selectA]"), list[i].div_id, list[i].name);
					appendSelectBox2($("select[name=modalSelectA]"), list[i].div_id, list[i].name);
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
	case "scenario/selectScenario.do":
		
		tableScenario = $('#tableScenario').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'div_name_total' },
	            { "mDataProp" : 'scenario_name' },
	            { "mDataProp" : 'scenario_code' },
	            { "mDataProp" : 'is_batch' } 
	            
	        ],
			'columnDefs': [
//				    { "targets": 0, "className": "text-center" },
//				    { "targets": 1, "className": "text-center" },
				    { "targets": 2, "className": "text-center" },
				    { "targets": 3, "className": "text-center" }
				],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    
			pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			"scrollY":        560,
			"scrollCollapse": false,
			select: {
				style: 'single' //single, multi
			},
			"language": { "search": "" },
	       
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '등록',
	                className: 'btn btn-outline-secondary test',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("1", detpth, e, dt, node, config )
	                }
	            },
	            {
	               text: '수정',
	                className: 'btn btn-outline-secondary test',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("2", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary test',
	                action: function ( e, dt, node, config ) {
	                	
	                	var isSelected = false;
	                	if(!confirm("시나리오 삭제시에 하위 테스트 케이스도 삭제됩니다.")){
	                		return;
	                	}
	                	
	                	$('#tableScenario tr').each(function(){
	        				if($(this).hasClass('selected') ){
	        					var dataJson = tableScenario.row($(this)).data(); 
	        					isSelected = true;
	        					ajaxTranCall("scenario/deleteScenario.do", dataJson, callbackS, callbackE);
	        				}
	        			});
	                	
	                	if(!isSelected){
	                		alert(MSG.SELETED_DELETE_OBJ);
	                		return;
	                	}
	                }
	            } 
	        ]
			
	    });

		callbackS("scenario/selectTestCaseList.do", {"list":[], "resultCode":"0000"});
		common.tableMappingAfterProcess();
//		$('.dt-button').attr("type", "button");
//		$('.dt-button').removeClass('dt-button');
		break;
		
		
	case "code/selectTypeList.do":
		var tempStr = "";
		for(var i=0; i<list.length; i++){
			if(i!=0)tempStr +="\n"
			tempStr += (i+1)+". "+list[i].case_name; 
		}
		$("#sc_desc").val(tempStr);
		
		break;
		
	}
}

var callbackE = function(tran, data){
	
	if(data["message"] != null && data["message"] != "")
	alert(data["message"]);
	$("#file1").val("");
}


var modalOpen = function( crType , e, dt, node, config ) {
	
	$( '#layerModalScenarioDlg' ).removeClass( 'modal-xl' );
	$( '#layerModalScenarioDlg' ).addClass( 'modal-lg' );
	$( '#layerModalScenarioDiv1' ).addClass( 'col-md-12' );
	$( '#layerModalScenarioDiv1' ).removeClass( 'col-md-7' );
	$( '#layerModalScenarioDiv2' ).removeClass( 'col-md-5' );
	$( '#layerModalScenarioDiv2' ).hide();
	
	$( '#trTest' ).hide();
	$( '#trDev' ).hide();
	
		
	//1. 시나리오 추가
	if(crType == "1"){
		//테스트케이스 유형 조회 
		ajaxTranCall("code/selectTypeGroupList.do", {is_batch : $("#is_batch").val()}, callbackModalS, callbackE);
		
		var sc_select = $("input[name=sc_select]:checked").val();
		ajaxTranCall("user/selectTeamList.do", {role_code:sc_select}, callbackS, callbackE);
		ajaxTranCall("user/selectUserList.do", {role_code:sc_select}, callbackS, callbackE);
	
		$("#modalTitle").text("시나리오 추가");
		$("#trCasetype").show();
		$("#case_pattern").attr("readonly", false);
		
		$('#btnSave').show();
		$('#btnUpdate').hide();
		$('#scenario_code').val("");
		$('#scenario_name').val("");
		$('#description').val("");
		$('#id').val("");
		
		$('#sc_developer').val("");
		$('#sc_developer_nm').val("");
		
		$('#sc_tester').val(getCookie('user_id'));
		$('#sc_tester_nm').val("("+getCookie('team_name')+")" + getCookie('name'));
		
		
		//시나리오 등록의 경우 그냥 메인화면 selectbox 덮어쓰자
		$('#modalSelectA').html($('#selectA').html());
		$('#modalSelectB').html($('#selectB').html());
		$('#modalSelectC').html($('#selectC').html());
		
		
		$('#modalSelectA').val($('#selectA').val());
		$('#modalSelectB').val($('#selectB').val());
		$('#modalSelectC').val($('#selectC').val());
		
		$("#layerModalScenario").modal();
	}
	//2. 시나리오 수정
	else if(crType == "2"){
		
		var isSelected = false;
		$("#trCasetype").hide();
		var div_id = ""
		$("#modalTitle").text("시나리오 수정");
		
		$('#sc_developer').val("");
		$('#sc_developer_nm').val("");
		$('#sc_tester').val("");
		$('#sc_tester_nm').val("");
		
		
		$('#btnSave').hide();
		$('#btnUpdate').show();
		$('#tableScenario tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 isSelected = true;
				 var dataJson = tableScenario.row($(this)).data();
				 div_id = dataJson.div_id;
				 modal.convertJsonObjToModal("seTableModal", dataJson );
			 }
		});
		
		if(isSelected){
			
			if(div_id == ""){
				$('#modalSelectA').val("");
				$('#modalSelectB').val("");
				$('#modalSelectC').val("");
				
				$("#layerModalScenario").modal();
			}
			else{
				
				ajaxTranCall("scenario/selectDivDepth.do", {div_id:div_id}, callbackModalS, callbackE);
			}
			
		}
		else{
			alert("수정할 대상을 선택해주세요.");
		}
	}
	//3. 테스트케이스 추가
	else if(crType == "3"){
		
		var tc_select = $("input[name=tc_select]:checked").val();
		ajaxTranCall("user/selectTeamList.do", {role_code:tc_select}, callbackS, callbackE);
		ajaxTranCall("user/selectUserList.do", {role_code:tc_select}, callbackS, callbackE);
		
		$('#developer').val("");
		$('#developer_nm').val("");
		$('#tester').val(getCookie('user_id'));
		$('#tester_nm').val("("+getCookie('team_name')+")" + getCookie('name'));
		
		
	
		$("#tc_description").val("");

		$("#testcase_code").val("");
		$("#testcase_name").val("");
		
		
		$("#modalTitleTc").text("테스트케이스 추가");
    	$("#layerModalTestCase").modal();
    	
    	$('#btnSaveTc').show();
		$('#btnUpdateTc').hide();
	}
	//4. 테스트케이스 수정
	else if(crType == "4"){
    	
		$('#developer').val("");
		$('#developer_nm').val("");
		$('#tester').val(getCookie('user_id'));
		$('#tester_nm').val("("+getCookie('team_name')+")" + getCookie('name'));
		
		
		
		var isSelected = false;
    	$('#tableTestcase tr').each(function(){
			 if ( $(this).hasClass('selected') ){
//				 modal.convertJsonObjToModal("tcTableModal",  )
				 
				 var dataJson = tableTestcase.row($(this)).data();
				 //{"dev_name":"","case_code":"A_CASE_0002","reg_user":"admin","modify_user":"admin",
				 //"case_name":"화면 일반 테스트2","tester_id":"N00001","description":"화면 일반 테스트2 설명","dev_id":"",
				 //"scenario_code":"CLUZ0922U","reg_date":1589065643270,"project_id":0,
				 //"reg_name":"","state":"0","modify_date":1589065643270,"test_name":"홍길동"}
				 isSelected = true;
			
				 $("#tester").val(dataJson["tester_id"]);
				 $("#tester_nm").val(dataJson["test_name"]);
				 $("#developer").val(dataJson["dev_id"]);
				 $("#developer_nm").val(dataJson["dev_name"]);
				 $("#tc_description").val(dataJson["description"]);

				 $("#testcase_id").val(dataJson["case_id"]);
				 $("#testcase_name").val(dataJson["case_name"]);
				 
			 }
		});
    	if(isSelected){
			
			var tc_select = $("input[name=tc_select]:checked").val();
		ajaxTranCall("user/selectTeamList.do", {role_code:tc_select}, callbackS, callbackE);
		ajaxTranCall("user/selectUserList.do", {role_code:tc_select}, callbackS, callbackE);
    		$("#modalTitleTc").text("테스트케이스 수정");
        	$("#layerModalTestCase").modal();
        	
        	$('#btnSaveTc').hide();
    		$('#btnUpdateTc').show();
		}
    	else{
    		alert(MSG.SELETED_UPDATE_OBJ);
    	}
    	
				
	}
	
}




