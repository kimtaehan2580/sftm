/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

//테스트유형 그룹 테이블 선언
var projectTable;


/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
function initDoucument(){
	
	//단위/통합테스트 리스트 조회
	ajaxTranCall("code/selectProjectList.do", {}, callbackS, callBackE);
	
	
	//팝업 저장 button click event handler
	$("#btnSave").click(function(e){
		
		var dataJson = modal.convertModalToJsonObj("modalProjectTable" );
		if(!checkProjectDate(dataJson)){
			return;
		}
		ajaxTranCall("code/insertProject.do", dataJson, callbackS, callBackE);
	});
	
	//팝업 수정 button click event handler
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("modalProjectTable" );
		if(!checkProjectDate(dataJson)){
			return;
		}
		ajaxTranCall("code/updateProject.do", dataJson, callbackS, callBackE);
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
		
	//단위/통합테스트 리스트 조회
	case "code/selectProjectList.do":
	
		var list = data["list"];
		var i = 0;
		list.forEach(function(element){
			if(element.start_date.length == 8){
				list[i].start_date_format = element.start_date.substring(0,4) + "/" + element.start_date.substring(4,6) + "/" + element.start_date.substring(6,8);	
			}
			else{
				list[i].start_date_format = element.start_date;
			}
			if(element.end_date.length == 8){
				list[i].end_date_format = element.end_date.substring(0,4) + "/" + element.end_date.substring(4,6) + "/" + element.end_date.substring(6,8);	
			}
			else{
				list[i].end_date_format = element.end_date;
			}
			i++;
		});
		
		projectTable = $('#projectTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'project_name' } ,
	            { "mDataProp" : 'use_yn' },
	            { "mDataProp" : 'start_date_format' } ,
	            { "mDataProp" : 'end_date_format' } ,
	            { "mDataProp" : 'sc_count' } ,
	            { "mDataProp" : 'reg_user' } ,
	            { "mDataProp" : 'reg_date' } 
	        ],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    'columnDefs': [
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" },
			    { "targets": 4, "className": "text-center" },
			    { "targets": 5, "className": "text-center" },
			    { "targets": 6, "className": "text-center" },
			],
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
//	           {
//	                text: '조회',
//	                className: 'btn btn-outline-info all',
//	                action: function ( e, dt, node, config ) {
//						ajaxTranCall("code/selectProjectList.do", {}, callbackS, callBackE);
//	                }
//	            },
	            {
					text: '등록',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
	                	projectModalOpen("add");
	                }
	            },
				{
	                text: '수정',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
	                	projectModalOpen("update" );
	                }
	            },
				{
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
	                	projectModalOpen("delete");
	                }
	            } 
	            
	        ]
			
	    });
	
		common.tableMappingAfterProcess();
	 
		break;
		
	//단위/통합테스트 CRUD	
	case "code/insertProject.do":
	case "code/updateProject.do":
	case "code/deleteProject.do":
		
		alert(data["message"])
		
		//단위/통합테스트 리스트 조회
		ajaxTranCall("code/selectProjectList.do", {}, callbackS, callBackE);
	
	
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
 * project insert/update 전에 validation check 
 * @param {tran} 서비스명
 * @param {data} 결과 Json 데이터
 * @returns {} 
 */ 
var checkProjectDate = function(data){
	
	if(!modal.modalCheckInputData("modalProjectTable")) return false;
	
	
	if(data.start_date == null || data.start_date.length != 10){
		alert("시작일자가 잘못되었습니다.");
		return false;
	}
	if(data.end_date == null || data.end_date.length != 10){
		alert("종료일자가 잘못되었습니다.");
		return false;
	}
	
	let id = data.id;
	var start_date 	= data.start_date.replace(/-/gi, "");
	var end_date 	= data.end_date.replace(/-/gi, "");
	
	if(start_date > end_date){
		alert("종료일자가 시작일자보다 빠릅니다.");
		return false;
	}
	
	if(data.use_yn == "N") return true;
	
		
	for(var i=0; i< projectTable.data().length; i++){
		
		var tempJson =projectTable.data()[i];
		if(tempJson.id == id) continue;
		if(tempJson.use_yn == "N") continue;
		
		
		if(start_date == tempJson.start_date || start_date == tempJson.end_date){
			alert("시작일시가 다른테스트와 겹칩니다.")	
			return false;
		}
		
		if(end_date == tempJson.start_date || end_date == tempJson.end_date){
			alert("종료일시가 다른 테스트와 겹칩니다.")	
			return false;
		}
		if( start_date < tempJson.start_date && end_date > tempJson.end_date ){
			alert("다른 테스트기간을 포함하고 있습니다.")	
			return false;
		}
		
		if( start_date > tempJson.start_date && end_date < tempJson.end_date ){
			alert("다른 테스트기간에 포함되어 있습니다.")	
			return false;
		}
		if(start_date < tempJson.end_date && start_date > tempJson.start_date ){
			alert("시작일시가 다른테스트기간에 있습니다.")	
			return false;
		}
		
		if( end_date > tempJson.start_date && end_date < tempJson.end_date ){
			alert("종료일시가 다른테스트기간에 있습니다.")	
			return false;
		}
		
		
		
	}		
	
	return true;
	
	
}


/**
 * 프로젝트 신규/변경 팝업 호출 함수
 * @param {type} add 신규, update 변경, delete 삭제
 * @returns {} 
 */ 
var projectModalOpen = function(type){
	
	
	var selectedJsonData = null;
	$('#projectTable tr').each(function(){
		 if ( $(this).hasClass('selected') ){
			selectedJsonData = projectTable.row($(this)).data();
		 }
	});
		
	//신규
	if(type=="add"){
		
		//팝업 내용 초기화
		$("#modalProjectTitle").text("프로젝트 추가");
		$("#project_name").val("");
		$("#use_yn").val("Y");
		$("#start_date").val(new Date().toISOString().substring(0, 10));
		$("#end_date").val(new Date().toISOString().substring(0, 10));
		
		$("#btnSave").show();
		$("#btnUpdate").hide();
	}
	//수정
	else if(type == "update"){
		
		if(selectedJsonData == null){
			alert("수정할 데이터를 선택해주세요");
			return;
		}
		
		$("#modalProjectTitle").text("프로젝트 수정");
		
		modal.convertJsonObjToModal("modalProjectTable",selectedJsonData);
		var start_date 	= selectedJsonData.start_date;
		var end_date 	= selectedJsonData.end_date;
		if(start_date.length == 8 && end_date.length == 8){
			start_date = start_date.substring(0,4) + "-" + start_date.substring(4,6) + "-" + start_date.substring(6,8);
			end_date = end_date.substring(0,4) + "-" + end_date.substring(4,6) + "-" + end_date.substring(6,8);
			$("#start_date").val(start_date);
			$("#end_date").val(end_date);
		}
		
		$("#btnSave").hide();
		$("#btnUpdate").show();
	}
	//삭제
	else if(type == "delete"){
		
		if(selectedJsonData == null){
			alert("수정할 데이터를 선택해주세요");
			return;
		}
		
		ajaxTranCall("code/deleteProject.do", selectedJsonData, callbackS, callBackE);
		return;	
	}
	
	
	$('#modalProject').modal();
}

//