/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var borderTable = null;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	ajaxTranCall("code/selectCodeList.do", {"code_group":"D001"}, callbackS, callbackE, false);
	
	//button event
	$('button').click(function(){
		
		switch($(this).attr('id')){
			
		//'조회' button (메인)
		case "btnSelect":
			ajax_selectBorderList();
			break;
			
			
		//'목록으로' button (상세)
		case "btnPrePage":
		
			$("#panal_detail").hide();
			$("#panal_list").show();
			ajax_selectBorderList();
			
			break;
			
		//'첨부파일' button (상세)
		case "btnAddFile":
			$("#modalImg").modal();
			break;
		}
		
	}); //button event
	
	//border list table double click event handler
	$('#borderTable tbody').on('dblclick', 'tr', function () {
	    var data = borderTable.row( this ).data();
		
		//상세조회 선택
		ajax_selectBorderDetail(data.id);
	});


}

/**
 * Interface success
 * @param {}
 * @returns {} 
 */
var callbackS = function(tran, data){
	
	switch(tran){
	
	//코드 조회
	case "code/selectCodeList.do":
		
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectType"), list[i].code_id, list[i].code_name);
		}
		
		ajax_selectBorderList();
		
		
		break;
		
	
	//border/selectBorderList.do -> 게시판 글 리스트 조회
	case "border/selectBorderList.do":
	
		var list = data["list"];
		borderTable = $('#borderTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'type_name' },
	            { "mDataProp" : 'title' },
	            { "mDataProp" : 'manager_user_name' } ,
	            { "mDataProp" : 'reg_user_name' } ,
	            { "mDataProp" : 'reg_date' }   
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "15%", "className": "text-center" },
			    { "targets": 1, "width": "40%"},
			    { "targets": 2, "width": "15%", "className": "text-center" },
			    { "targets": 3, "width": "15%", "className": "text-center" },
			    { "targets": 4, "width": "15%", "className": "text-center" }
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
			dom : 'Bfrtip',
			buttons: [
				{
	                text: '등록',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						 
	                }
	            },
				{
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						 
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
		
	                }
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
	
	//border/selectBorderDetail.do -> 게시판 글 상세 조회
	case "border/selectBorderDetail.do":	
	
		$("#panal_detail").show();
		$("#panal_list").hide();
		
		return;
		
	}
	
}

/**
 * Interface Fail
 * @param {}
 * @returns {} 
 */
var callbackE = function(tran, data){
	
}

/**
 * ajax_selectBorderList -> 게시판 글 리스트 조회
 * @param {}
 * @returns {} 
 */
var ajax_selectBorderList = function(){
	
	ajaxTranCall("border/selectBorderList.do", {type_code:$("#selectType").val()}, callbackS, callbackE);
}


/**
 * ajax_selectBorderDetail -> 게시판 글 상세조회
 * @param {}
 * @returns {} 
 */
var ajax_selectBorderDetail = function(id){
	
	ajaxTranCall("border/selectBorderDetail.do", {"id":id}, callbackS, callbackE);
}

