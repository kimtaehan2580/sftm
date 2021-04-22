/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
var sitemapTable = null;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	
//	use_yn
	if(getCookie('role_code') == "ADMIN"){
		ajaxTranCall("border/selectSitemapList.do", {"use_yn":"y"}, callbackS, callbackE);
	}
	else{
		ajaxTranCall("border/selectSitemapList.do", {}, callbackS, callbackE);
	}
	
	
	//button event
	$('button').click(function(){
		
		switch($(this).attr('id')){
			
		//'저장' button (팝업)
		case "btnModalSave":
			
			if(!modal.modalCheckInputData("modalSitemapTable")) return false;
			var jsonObj = modal.convertModalToJsonObj("modalSitemapTable");
			//insert
			if($("#id").val() == "-1"){
				ajaxTranCall("border/insertSitemap.do", jsonObj, callbackS, callbackE);
			}
			else{
				ajaxTranCall("border/updateSitemap.do", jsonObj, callbackS, callbackE);
			}
			
			break;
		 
		}
		
	}); //button event
	
	//border list table double click event handler
	$('#sitemapTable tbody').on('click', 'td', function () {
 		var col = $(this).parent().children().index($(this));
	 	var row = $(this).parent().parent().children().index($(this).parent());
	 
	 	var data = sitemapTable.row( row ).data();
	 	if(col == 2){
	 		window.open(data.url, '_blank'); 
	 	}
	});
	
}

/**
 * Interface success
 * @param {}
 * @returns {} 
 */
var callbackS = function(tran, data){
	
	switch(tran){
	
	//팀 정보 전체 조회
	case "border/selectSitemapList.do":
	
		var list = data["list"];
		sitemapTable = $('#sitemapTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'title' },
	            { "mDataProp" : 'sub_title' },
	            { "mDataProp" : 'url' },
	            { "mDataProp" : 'login_info' } ,
	            { "mDataProp" : 'priority' }     
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "15%", "className": "text-center" },
			    { "targets": 1, "width": "25%" },
			    { "targets": 2, "width": "30%", "className": "text-blue" },
			    { "targets": 3, "width": "20%", "className": "text-center" },
			    { "targets": 4, "width": "10%", "className": "text-center" },
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
	                	
	                	//초기화 
						$("#hearderTitle").text("사이트맵 등록");
	                	modal.modalClear("modalSitemapTable");
						$("#use_yn").val("y");	   
						$("#id").val("-1");             	
						$("#modalSiteMap").modal();

	                }
	            },
				{
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						
						var isSelected = false;
	                    $('#sitemapTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){ 
		           			 	$("#hearderTitle").text("사이트맵 수정");
		           				isSelected = true;
		           				modal.convertJsonObjToModal("modalSitemapTable", sitemapTable.row($(this)).data());
								$("#modalSiteMap").modal();
							
		           			 }
	                    });
	                    if(!isSelected) alert("수정할 데이터를 선택해주세요.");	
						
						 
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
	
	case "border/insertSitemap.do":
	case "border/updateSitemap.do":
		alert(data["message"]);
		$('#modalSiteMap').modal('hide');
		
		if(getCookie('role_code') == "ADMIN"){
			ajaxTranCall("border/selectSitemapList.do", {"use_yn":"y"}, callbackS, callbackE);
		}
		else{
			ajaxTranCall("border/selectSitemapList.do", {}, callbackS, callbackE);
		}
		break;
	
		
	}
}

/**
 * Interface Fail
 * @param {}
 * @returns {} 
 */
var callbackE = function(tran, data){
	
}



