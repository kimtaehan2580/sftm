/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var groupTable, codeTable;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	//팀정보 조회합니다.
	ajaxTranCall("code/selectCodeGroupList.do", {}, callbackS, callBackE);
	
	//서브시스템 Table click event
	$('#groupTable').on('click', function(){

		setTimeout(function() {
			$('#groupTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = groupTable.row($(this)).data(); 
					ajaxTranCall("code/selectCodeList.do", dataJson, callbackS, callBackE);
				}
			});
		}, 100);
	});
	
	//Group modal event
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalGroupTable" );
		ajaxTranCall("code/insertCodeGroup.do", dataJson, callbackS, callBackE);
	});
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalGroupTable" );
		ajaxTranCall("code/updateCodeGroup.do", dataJson, callbackS, callBackE);
	});
	//Group modal event
	//신규 저장버튼 click event
	$("#btnSaveCode").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalCodeTable" );
		dataJson["description"] = dataJson["descriptionCode"];
		dataJson["use_yn"] = dataJson["use_ynCode"];
		
		$('#groupTable tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson2 = groupTable.row($(this)).data(); 
				dataJson["code_group"] = dataJson2.code_group;
			}
		});
		
		ajaxTranCall("code/insertCode.do", dataJson, callbackS, callBackE);
	});
	$("#btnUpdateCode").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalCodeTable" );
		dataJson["description"] = dataJson["descriptionCode"];
		dataJson["use_yn"] = dataJson["use_ynCode"];
		
		$('#groupTable tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson2 = groupTable.row($(this)).data(); 
				dataJson["code_group"] = dataJson2.code_group;
			}
		});
		ajaxTranCall("code/updateCode.do", dataJson, callbackS, callBackE);
	});
	
	
}


var callbackS = function(tran, data){
	
	switch(tran){
	
	case "code/insertCodeGroup.do":
	case "code/updateCodeGroup.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			ajaxTranCall("code/selectCodeGroupList.do", {}, callbackS, callBackE);
		}
		break;
		
	case "code/insertCode.do":
	case "code/updateCode.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
			$('#groupTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = groupTable.row($(this)).data(); 
					ajaxTranCall("code/selectCodeList.do", dataJson, callbackS, callBackE);
				}
			});
		}
		break;
	case "code/selectCodeList.do":
		
		var list = data["list"];
		codeTable = $('#codeTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'code_id' } ,
	            { "mDataProp" : 'code_name' },
	            { "mDataProp" : 'use_yn' } ,
	            { "mDataProp" : 'priority' } ,
	            { "mDataProp" : 'reg_user' } ,
	            { "mDataProp" : 'reg_date_str' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" },
			    { "targets": 4, "className": "text-center" },
			    { "targets": 5, "className": "text-center" }
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
	        dom : 'Bfrtip',
	        buttons: [
//	           	{
//	                text: '조회',
//					className: 'btn btn-outline-secondary',
//	                action: function ( e, dt, node, config ) {
//						$('#groupTable tr').each(function(){
//							if($(this).hasClass('selected') ){
//								var dataJson = groupTable.row($(this)).data(); 
//								ajaxTranCall("code/selectCodeList.do", dataJson, callbackS, callBackE);
//							}
//						});
//	                }
//	            },
	            {
	                text: '수정',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	codeModalOpen("2", e, dt, node, config )
	                }
	            } 
	            
	        ]
			
	    });

		common.tableMappingAfterProcess();
		break;
	case "code/selectCodeGroupList.do":
		
		var list = data["list"];
		groupTable = $('#groupTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'code_group' } ,
	            { "mDataProp" : 'code_group_name' },
	            { "mDataProp" : 'use_yn' } ,
	            { "mDataProp" : 'code_cnt' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
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
	        dom : 'Bfrtip',
	        buttons: [
		
//				{
//	                text: '조회',
//					className: 'btn btn-outline-secondary',
//	                action: function ( e, dt, node, config ) {
//						ajaxTranCall("code/selectCodeGroupList.do", {}, callbackS, callBackE);
//	                }
//	            },
	            
	            {
	                text: '수정',
					className: 'btn btn-outline-secondary',
	                action: function ( e, dt, node, config ) {
	                	groupModalOpen("2", e, dt, node, config )
	                }
	            } 
	            
	        ]
			
	    });
		common.tableMappingAfterProcess();
		
		callbackS("code/selectCodeList.do", {"list":[]});
		
		
		break;
	}
	
}

var callBackE = function(tran, data){
	
}

var groupModalOpen = function(type, e, dt, node, config ){
	
	//팝업 내용 초기화
	$("#code_group").val("");
	$("#code_group_name").val("");
	$("#description").val("");
	$("#use_yn").val("Y");
	
	if(type == "1"){
		$("#btnSave").show();
		$("#btnUpdate").hide();
		$("#modalGroupTitle").text("코드그룹 등록");
		$("#code_group").attr("readonly", false);

	}
	else if(type == "2"){
		$("#code_group").val("");
		$("#btnSave").hide();
		$("#btnUpdate").show();
		$("#modalGroupTitle").text("코드그룹 수정");
		$("#code_group").attr("readonly", true);

		$('#groupTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 modal.convertJsonObjToModal("modalGroupTable", groupTable.row($(this)).data() )
			 }
		});
	}
	else{
		return;
	}
	$('#modalGroup').modal();
}


var codeModalOpen = function(type, e, dt, node, config ){
	
	//팝업 내용 초기화
	$("#code_id").val("");
	$("#code_name").val("");
	$("#descriptionCode").val("");
	$("#use_ynCode").val("Y");
	$("#priority").val("");
	
	if(type == "1"){
		$("#btnSaveCode").show();
		$("#btnUpdateCode").hide();
		$("#modalCodeTitle").text("코드 등록");
		$("#code_id").attr("readonly", false);
		
		$('#groupTable tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson2 = groupTable.row($(this)).data(); 
				$("#code_id").val(dataJson2.code_group + "_");
			}
		});

	}
	else if(type == "2"){
		$("#btnUpdateCode").show();
		$("#btnSaveCode").hide();
		$("#modalCodeTitle").text("코드 수정");
		$("#code_id").attr("readonly", true);
		$('#codeTable tr').each(function(){
			 if ( $(this).hasClass('selected') ){
				 
				 var dataModal = codeTable.row($(this)).data()
				 modal.convertJsonObjToModal("modalCodeTable", dataModal )
				 
				 $("#descriptionCode").val( dataModal.description);
				 $("#use_ynCode").val( dataModal.use_yn);
			 }
		});
	}
	else{
		return;
	}
	$('#modalCode').modal();
}
