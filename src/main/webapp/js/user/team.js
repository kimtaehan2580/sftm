/*
 * @author  kimtaehan
 * @version 1.0
 * @see     js
 */

//Team, user table obj
var teamTable , userTable;

//user popup table obj
var userTableModal ;

/*
 * html loding complete funtion
 */
var initDoucument = function(){
	
	//teat list 전체 조회
//	ajaxTranCall("user/selectTeamList.do", {}, callbackS, callbackE);
	basicInquiry();
	
	//role list 조회
	ajaxTranCall("user/searchRoleList.do", {}, callbackS, callbackE);
	
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			ajaxTranCall("user/insertNewTeam.do", dataJson, callbackS, callbackE);
		}
		
	});
	
	//기존 팀 업데이트 이벤트
	$("#btnUpdate").click(function(e){
		
		if(modal.modalCheckInputData("teamTableModal")){
			var id = "";
			$('#teamTable tr').each(function(){
				 if ( $(this).hasClass('selected') ){
					 id = teamTable.row($(this)).data().id;
				 }
			});
			var dataJson = modal.convertModalToJsonObj("teamTableModal" );
			dataJson["id"] = id;
			ajaxTranCall("user/updateTeamInfo.do", dataJson, callbackS, callbackE);
		}
	});
	
	//전체역할 select box 값 체인지
	$("#role_code_main").on('change', function(){
//		ajaxTranCall("user/selectTeamList.do", {role_code : $(this).val()}, callbackS, callbackE);
		basicInquiry();
	});
	
 
	//1개의 팀 선택시 팀장/팀원 정보 조회 	
	//서브시스템 Table click event
	$('#teamTable').on('click', function(){
		setTimeout(function() {
			$('#teamTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = teamTable.row($(this)).data();
					
					ajaxTranCall("user/selectTeamUserList.do", dataJson, callbackS, callbackE);
					$("#team_id").val(dataJson.id);
					$("#team_code_main").val(dataJson.id);
					$("#team_id_select").val(dataJson.id);
					$("#team_id_select").trigger("change");
				}
			});
		}, 100);
		
//		selectDefectList();
	});
	
	
	$('#userTableModal').on('click', function(){
		setTimeout(function() {
			$('#userTableModal tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = userTableModal.row($(this)).data();
					var isConfirm = confirm(dataJson.name + "을(를) 팀장으로 지정하시겠습니까?");
					if(isConfirm){
						var jsonObj = {
								"team_id" : $("#team_id").val(),
								"user_id" : dataJson.user_id
						};
						ajaxTranCall("user/updateTeamReader.do", jsonObj, callbackS, callbackE);
					}
				}
			});
		}, 100);
	});
	
	//조회버튼
	$('#btnSelect').on('click', function(){
		basicInquiry()
	});
	
	
	$("#team_id_select").on('change', function(){
		var json = {
			team_id : $("#team_id_select").val()		
		};
		ajaxTranCall("user/selectUserList.do", json, callbackS, callbackE);
	});
	
	
	
	
}

/*
 * 기본 조회 로직 
 */
var basicInquiry = function(){
	
	ajaxTranCall("user/selectTeamList.do", 
		{
			role_code : $("#role_code_main").val()
		}, 
	callbackS, callbackE);
}


var callbackS = function(tran, data){
	
	switch(tran){
	
	//팀장변경 서비스
	case "user/updateTeamReader.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('#modalTeamReader').modal("hide"); //닫기 
			ajaxTranCall("user/selectTeamList.do", {}, callbackS, callbackE);
			
			var jsonObj = {
					"id" : $("#team_id").val() 
			};
			ajaxTranCall("user/selectTeamUserList.do", jsonObj, callbackS, callbackE);
			
		}
		
		
		break;
	case "user/selectUserList.do":
		var list = data["list"];
		userTableModal = $('#userTableModal').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	        	{ "mDataProp" : "team_name" } ,
	        	{ "mDataProp" : "user_id" },
	        	{ "mDataProp" : "name" } 
	        ], 
			"columnDefs": [
				{ "targets": 0, "className": "text-center" },
				{ "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" }
		
	        ],
			"language": {
		        "emptyTable": "조회된 데이터가 없습니다." , "search": ""
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
		common.tableMappingAfterProcess();
		break; 
		
		
	case "user/selectTeamUserList.do":
		var list = data["list"];
		//userTable
		userTable = $('#userTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : "team_state" },
	        	{ "mDataProp" : "position" } ,
	            { "mDataProp" : "organization" },
	            { "mDataProp" : "user_id" },
	            { "mDataProp" : "name" } 
	            
	        ],
 			 "columnDefs": [
				{ "targets": 0, "className": "text-center"  },
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" },
			    { "targets": 4,"className": "text-center" },
	        ],
			"language": {
		         "emptyTable": "조회된 데이터가 없습니다." , "search": ""
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
//	        
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '팀장 변경',
	                className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("3", e, dt, node, config )
	                }
	            } 
	        ]
			
	    });

		common.tableMappingAfterProcess();
		break;
		
		
	case "user/selectTeamList.do":
	
		var list = data["list"];
		
		htmlSelectBox2($("#team_id_select"), '', "전체");
		htmlSelectBox2($("#team_code_main"), '', "미선택");
		
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#team_id_select"), list[i].id, list[i].name);
			appendSelectBox2($("#team_code_main"), list[i].id, list[i].name);
		}
		
		
		callbackS("user/selectTeamUserList.do", {"list":[]});
		$("#team_id").val("");
			
		teamTable = $('#teamTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : "name" },
	        	{ "mDataProp" : "id" } ,
	            { "mDataProp" : "description" },
	            { "mDataProp" : "rolename" },
	            { "mDataProp" : "reader_name" },
	            { "mDataProp" : "user_cnt" },
	            { "mDataProp" : "reg_date_str" }  
	            
	        ],
			  "columnDefs": [
				{ "targets": 0, "width":"15%" , "className": "text-center" },
	            {
	                "targets": [ 1 ],
	                "visible": false,
	                "searchable": false
	            },
			    { "targets": 2, "width":"30%"},
			    { "targets": 3, "width":"15%", "className": "text-center" },
			    { "targets": 4, "width":"20%", "className": "text-center" },
			    { "targets": 5, "width":"10%", "className": "text-center", "render": function ( data, type, row ) {return data +'명';} },
			    { "targets": 6, "className": "text-center" }
	        ],
			"language": { 
				"emptyTable": "조회된 데이터가 없습니다." , "search": ""
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
//	        //컬럼속성
	       
			
			
	        dom : 'Bfrtip',
	        buttons: [
//	        	 {
//	                text: '조회',
//	                className: 'btn btn-outline-secondary all',
//	                action: function ( e, dt, node, config ) {
//						basicInquiry();
//	                }
//	            },
	            {
	                text: '등록',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						
	                	modalOpen("1", e, dt, node, config )
	                }
	            },
	            {
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
		
	                	modalOpen("2", e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
		
	                	var isSelected = false;
	                    $('#teamTable tr').each(function(){
	           			 if ( $(this).hasClass('selected') ){
	           				 isSelected = true;
	           				 
	           				 if(teamTable.row($(this)).data().user_cnt > 0){
	           				 	alert("팀에 소속된 사용자가 있는 경우 삭제가 불가합니다.");
	           				 	return;
	           				 }
           					var dataJson = {
       							id : teamTable.row($(this)).data().id
       						};
       						ajaxTranCall("user/deleteTeamInfo.do", dataJson, callbackS, callbackE);
	           			 }
	           			 
	           			
	                  });
                    if(!isSelected) alert("삭제할 대상을 선택해주세요.");
	                }
	            }
//				,{
//	        		extend:'excel',
//	        		text:'다운로드',
//	        		bom:true
//	        	}
	        ]
			
	    });
		
		common.tableMappingAfterProcess();
		break;
		
	case "user/searchRoleList.do":

		var list = data["list"];
		for(var i=0; i<list.length; i++){
			
			if( list[i].code == 'ADMIN' &&  !common.isAdmin() ){
				continue;
			}
			appendSelectBox("role_code", list[i].code, list[i].name);
			appendSelectBox("role_code_main", list[i].code, list[i].name);
		}
		
		
		break;
		
	case "user/insertNewTeam.do":
	case "user/updateTeamInfo.do":
	case "user/deleteTeamInfo.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('#modalTeam').modal("hide"); //닫기 
			basicInquiry();
		}
		break;
	}
}


var modalOpen = function(type, e, dt, node, config ) {
	
//	 $("#inputTeamNm").val( ""  );
//	 $("#inputTeamDesc").val( "" );
//	 $("#selectbox").val( "" );

	 modal.modalClear("teamTableModal");
	if(type == "1"){
		$('#modalTitle').text("신규 팀 추가");
		$('#btnSave').show();
		$('#btnUpdate').hide();
		$('#description').val("");
		
		$('#modalTeam').modal();
	}
	else if(type == "2"){
		$('#modalTitle').text("팀 정보 수정");
		$('#btnSave').hide();
		$('#btnUpdate').show();
		var isSelected = false;
		$('#teamTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 isSelected = true;
				 modal.convertJsonObjToModal("teamTableModal", teamTable.row($(this)).data() );
			 }
       });
		
		if(!isSelected){
			alert("수정할 대상을 선택해주세요.");
			return;
		}
		
		$('#modalTeam').modal();
	}
	else{
		
		if($("#team_id").val() == ""){
			return;
		}
		
		
//		$('#modalTeamReaderTitle').val($("#team_id").val());
		$('#modalTeamReader').modal();
	}
	
	
}

function callbackE(tran,data){
//	alert("callbackE");
}