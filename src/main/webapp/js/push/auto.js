/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */
 
 var autoTable = null;
 var autoDetailTable = null;
 var autoTestHistoryTable = null;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){

	ajaxTranCall("push/selectAutoList.do", {}, callbackS, callbackE);
	
	$('#autoTable tbody').on('dblclick', 'tr', function () {
	
	    var data = autoTable.row( this ).data();
		ajaxTranCall("push/selectAutoDetail.do", {"id": Number(data.id)}, callbackS, callbackE);

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
	        
        ajaxFormExcel("excel/uploadExcelAuto.excel", "file1", callbackS, $("#id").val());

	});
	
	
} 
var jsonObj = null;
/**
 * Interface success
 * @param {}
 * @returns {} 
 */
var callbackS = function(tran, data){
	
	switch(tran){
	
	case "push/selectAutotest_detail.do":
		
		//c_window.autoTestShowList = function(autotest_id, seq, htmlList){
		/**************************************************************************
		c_window.autoTestShow(
			"test"					//결함제목
			, data.list[0].html						//html json list
			, "auto"		//녹화재생 유형 (auto : 자동수행, manual : 수동수행)
			, "admin"
			, "202010421"
		);
		**************************************************************************/
		c_window.autoTestShowList(
			 data.list
		);
		
		break;
	
	case "excel/uploadExcelAuto.excel":
		
		alert(data.message);
		ajaxTranCall("push/selectAutoDetail.do", {"id":Number($("#id").val())}, callbackS, callbackE);
		
		break;
	
	//테스트 이력 상세 조회
	case "push/selectAutoDetail.do":
		
		$("#id").val(data.id);
		$("#h6_title").text(data.title);
		jsonObj = JSON.parse(data.html);
		
		$("#panal_list").hide();
	    $("#panal_detail").show();
	    
			    
		autoDetailTable = $('#autoDetailTable').DataTable ({
		
			destroy: true,
	        "aaData" : jsonObj.list,
	        "columns" : [
	            { "mDataProp" : '0' },
	            { "mDataProp" : '1' },
	            { "mDataProp" : '2' }
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "15%"},
			    { "targets": 1, "width": "45%"},
			    { "targets": 2, "width": "40%"}
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        dom : 'Bfrtip',
	        buttons: [
				{
	                text: '다운로드',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
		
						//downlod 할 json 타입 만들기 
						var size = autoDetailTable.data().length;
						var list = new Array();
						if(size == 0){
							
						}
						else{
							for(var i=0; i<size; i++){
								list.push(autoDetailTable.data()[i]);
							}
						}
						ajaxTranCall("excel/downloadAutoExcel.do", {"list": list} ,callbackS, callbackE);
					}
				}
	        ]
			
	    });
	    
		var list = data["list"];
	    autoTestHistoryTable = $('#autoTestHistoryTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'name' },
	            { "mDataProp" : 'reg_date' },
	            { "mDataProp" : 'count' },
	            { "mDataProp" : 'excute_yn' },
	            { "mDataProp" : 'excute_date' }
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "20%", "className": "text-center" },
			    { "targets": 1, "width": "25%", "className": "text-center" },
			    { "targets": 2, "width": "10%", "className": "text-center" },
			    { "targets": 3, "width": "20%", "className": "text-center" },
			    { "targets": 4, "width": "25%", "className": "text-center" }
			],
	        "language": {
		        "emptyTable": "데이터가 존재하지 않습니다." , "search": ""
		    },
		    pageLength:15, //기본 데이터건수
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			"scrollY":        550,
	        "scrollCollapse": false,
	        dom : 'Bfrtip',
	        buttons: [
				{
	                text: '업로드',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						$('#file1').trigger('click');
					}
				},
				{
	                text: '[재]수행',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						
						var isSelected = false;
	                    $('#autoTestHistoryTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){ 
		           			 	var json = {
		           			 		"id":autoTestHistoryTable.row($(this)).data().id
		           			 	};
								ajaxTranCall("push/selectAutotest_detail.do", json, callbackS, callbackE);
								isSelected = true;
		           			 }
	                    });
	                    if(!isSelected) alert("수행할 데이터를 선택해주세요.");
					}
				},
				{
	                text: '결과확인',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						
						var isSelected = false;
	                    $('#autoTestHistoryTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){ 
		           			 	var json = {
		           			 		"id": autoTestHistoryTable.row($(this)).data().id
		           			 	};
								ajaxTranCall("excel/downloadAutoResultExcel.do", json ,callbackS, callbackE);
								isSelected = true;
		           			 }
	                    });
	                    if(!isSelected) alert("수행할 데이터를 선택해주세요.");
						
					}
				}
	        ]
			
	    });
	    
		
		common.tableMappingAfterProcess();
		
	
		break;
		
		
	//테스트 이력 리스트 조회
	case "push/selectAutoList.do":
	
		var list = data["list"];
		autoTable = $('#autoTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'title' },
	            { "mDataProp" : 'case_name' },
	            { "mDataProp" : 'defect_name' },
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'reg_date' }     
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "25%"},
			    { "targets": 1, "width": "20%"},
			    { "targets": 2, "width": "25%"},
			    { "targets": 3, "width": "15%", "className": "text-center" },
			    { "targets": 4, "width": "15%", "className": "text-center" },
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
			"scrollY":        550,
	        "scrollCollapse": false
	    });
		
		common.tableMappingAfterProcess();
		break;
	
	case "excel/downloadAutoResultExcel.do":
	case "excel/downloadAutoExcel.do":
		
		if(data["filePath"] == ""){
			alert("파일 다운로드에 실패했습니다.");
			return;
		}
		else{
			var temp = getExcelFileUrl( data["filePath"]);
			$("#fileDownObj").attr('src',  temp);
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



