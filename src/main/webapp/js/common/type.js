/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

//테스트유형 그룹 테이블 선언
var groupTable, typeTable;


/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
function initDoucument(){
	
	//테스트케이스 유형 전체 조회
	$("#selected_type_group_id").val();
	$("#selected_type_group").val();
		
	ajaxTranCall("code/selectTypeGroupList.do", {}, callbackS, callBackE);
	
	//테스트 케이스 유형 팝업 버튼 
	$("#btnSave").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalGroupTable" );
		ajaxTranCall("code/insertTypeGroup.do", dataJson, callbackS, callBackE);
	});
	
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalGroupTable" );
		dataJson.id = $("#type_group_id").val();
		ajaxTranCall("code/updateTypeGroup.do", dataJson, callbackS, callBackE);
	});
	
	//테스트 케이스 유형 테이블 클릭시 
	$('#groupTable').on('click', function(){
		setTimeout(function() {
			$('#groupTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = groupTable.row($(this)).data(); // modal.convertModalToJsonObj("groupTable" );
					ajaxTranCall("code/selectTypeList.do", dataJson, callbackS, callBackE);
					
					$("#selected_type_group_id").val(dataJson.id);
					$("#selected_type_group").val(dataJson.type_group);
				}
			});
		}, 100);
	});
	
	
	//테스트케이스 유형 상제 파법버튼
	//테스트 케이스 유형 팝업 버튼 
	$("#btnSave2").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalTypeTable" );
		dataJson.type_group_id = $("#selected_type_group_id").val();
		ajaxTranCall("code/insertType.do", dataJson, callbackS, callBackE);
	});
	
	$("#btnUpdate2").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalTypeTable" );
		dataJson.type_group_id = $("#selected_type_group_id").val();
		ajaxTranCall("code/updateType.do", dataJson, callbackS, callBackE);
	});
}

/**
 * 인터페이스 성공 Callback
 * @param {tran} 서비스명
 * @param {data} 결과 Json 데이터
 * @returns {} 
 */ 
var callbackS = function(tran, data){
	
	switch(tran){
		
	
	case "code/insertTypeGroup.do":
	case "code/updateTypeGroup.do":
	case "code/deleteTypeGroup.do":
	
		$("#selected_type_group_id").val();
		$("#selected_type_group").val();
		
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			ajaxTranCall("code/selectTypeGroupList.do", {}, callbackS, callBackE);
		}
		break;
		
		
	//테스트케이스 유형  CRUD
	case "code/insertType.do":
	case "code/updateType.do":
	case "code/deleteType.do":
		
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			ajaxTranCall("code/selectTypeGroupList.do", {}, callbackS, callBackE);
			ajaxTranCall("code/selectTypeList.do", {"id": $("#selected_type_group_id").val() }, callbackS, callBackE);
		}
		
		
		
		break;
	
	//테스트케이스 유형 전체 조회
	case "code/selectTypeGroupList.do":
	
		var list = data["list"];
		
		
		groupTable = $('#groupTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'type_group' } ,
	            { "mDataProp" : 'use_type_name' },
	            { "mDataProp" : 'cnt' }
	          
	        ],
		'columnDefs': [
//			    { "targets": 0, "className": "text-center" },
//			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" }
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        pageLength:15, //기본 데이터건수
	        dom : 'Bfrtip'
	        ,buttons: [
//	             {
//	                text: '조회',
//	                className: 'btn btn-outline-info all',
//	                action: function ( e, dt, node, config ) {
//						ajaxTranCall("code/selectTypeGroupList.do", {}, callbackS, callBackE);
//	                }
//	            },
				{
	                text: '등록',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	groupTypeModalOpen("1")
	                }
	            },
				{
	                text: '수정',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	groupTypeModalOpen("2" )
	                }
	            },
				{
	                text: '삭제',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
						var isSelected = false;
						$('#groupTable tr').each(function(){
							 if ( $(this).hasClass('selected') ){
								
								isSelected = true;
								var dataJson = groupTable.row($(this)).data();
								if(confirm(dataJson.type_group + " 을(를) 삭제하시겠습니까?\n삭제시에 상세내용도 전부 삭제됩니다.")){
									ajaxTranCall("code/deleteTypeGroup.do", dataJson, callbackS, callBackE);
								}
								
								
							 }
						});
	                    
	                    if(!isSelected) alert("삭제할 테스트 케이스 유형을 선택해주세요.");
	                }
	            } 
	            
	        ]
			
	    });
		common.tableMappingAfterProcess();
		
		callbackS("code/selectTypeList.do", {"list":[]});
//		ajaxTranCall("code/selectTypeList.do", {}, callbackS, callBackE);
		break;
		
		
		////////////////////////////////////////////////////1
		//테스트케이스 유형 상세 조회
		case "code/selectTypeList.do":
		
			var list = data["list"];
			
			for(var i=0; i<list.length;i++){
				var case_desc_format = list[i].case_desc;
				if(case_desc_format.length > 20){
					case_desc_format = case_desc_format.substring(0,20) +"..."; 
				}
				
				list[i].case_desc_format = case_desc_format;
			}
			typeTable = $('#typeTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'type_group' },
	            { "mDataProp" : 'case_name' } ,
	            { "mDataProp" : 'case_desc_format' },
	            { "mDataProp" : 'reg_date_str' }
	          
	        ],
			'columnDefs': [
//			    { "targets": 0, "className": "text-center" },
//			    { "targets": 1, "className": "text-center" },
			    { "targets": 3, "className": "text-center" }
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: true,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        pageLength:15, //기본 데이터건수
	        dom : 'Bfrtip'
	        ,buttons: [
//				{
//	                text: '조회',
//					className: 'btn btn-outline-secondary',
//	                action: function ( e, dt, node, config ) {
//		
//						ajaxTranCall("code/selectTypeList.do", {"id": $("#selected_type_group_id").val() }, callbackS, callBackE);
//	                }
//	            },
	            {
	               text: '등록',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	typeModalOpen("1")
	                }
	            },
				{
	                 text: '수정',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	typeModalOpen("2" )
	                }
	            },
				{
	                text: '삭제',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
						var isSelected = false;
						$('#typeTable tr').each(function(){
							 if ( $(this).hasClass('selected') ){
								isSelected = true;
								var dataJson = typeTable.row($(this)).data();
								if(confirm(dataJson.case_name + " 을(를) 삭제하시겠습니까?\n삭제시에 상세내용도 전부 삭제됩니다.")){
									ajaxTranCall("code/deleteType.do", dataJson, callbackS, callBackE);
								}
								
								
							 }
						});
						
	                }
	            } 
	            
	        ]
			
	    });



		
		common.tableMappingAfterProcess();
		
		
		break;
	}
	
}

/**
 * 인터페이스 실패 Callback
 * @param {tran} 서비스명
 * @param {data} 결과 Json 데이터
 * @returns {} 
 */ 
var callBackE = function(tran, data){
	
}


/**
 * 테스트케이스 유형 등록/수정 팝업 호출
 * @param {type} 1 등록 2 수정 
 * @returns {} 
 */ 
var groupTypeModalOpen = function(type){
	
	
	//팝업 내용 초기화
	$("#type_group").val("");
	$("#type_group_id").val("");
	$("#description").val("");
	$("#use_type").val("A");
	 
	//신규
	if(type == "1"){
		$("#btnSave").show();
		$("#btnUpdate").hide();
		$("#modalGroupTitle").text("테스트 케이스 유형 등록");
//		$("#code_group").attr("readonly", false);
	}
	//수정
	else if(type == "2"){
		$("#btnSave").hide();
		$("#btnUpdate").show();
		$("#modalGroupTitle").text("테스트 케이스 유형 수정");
		$('#groupTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 modal.convertJsonObjToModal("modalGroupTable", groupTable.row($(this)).data() );
				 $("#type_group_id").val(groupTable.row($(this)).data().id	);
			 }
		});
		if($("#type_group_id").val() == null || $("#type_group_id").val() == ""){
			alert("수정할 유형을 먼저 선택해주세요.");
			return;	
		}
		
		
	}
	else{
		return;
	}
	$('#modalGroup').modal();
}


/**
 * 테스트케이스 상세 유형 등록/수정 팝업 호출
 * @param {type} 1 등록 2 수정 
 * @returns {} 
 */ 
var typeModalOpen = function(type){
	
	
	$("#id").val("");
	$("#case_name").val("");
	$("#case_desc").val("");
	
	//신규
	if(type == "1"){
		$("#btnSave2").show();
		$("#btnUpdate2").hide();
		$("#type_group2").val($("#selected_type_group").val());
		
		$("#modalTypeTitle").text("테스트 케이스 상세 유형 등록");
	}
	else if(type == "2"){
		$("#btnSave2").hide();
		$("#btnUpdate2").show();
		$("#modalTypeTitle").text("테스트 케이스 상세 유형 수정");
		
		$('#typeTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 modal.convertJsonObjToModal("modalTypeTable", typeTable.row($(this)).data() );
			 }
		});
		$("#type_group2").val($("#selected_type_group").val());
		if($("#id").val() == null || $("#id").val() == ""){
			alert("수정할 유형을 먼저 선택해주세요.");
			return;	
		}
		
		
	}
	
	$('#modalType').modal();
}
