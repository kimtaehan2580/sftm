/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 * @desc    현업이 테스트를 수행하는 화면
 */
var testDefectTable;

//팝업 호출 타입  1 신규, 2업데이트
var imgkey = -1;
var crud = "I";
var preJson;

var btnType = "";

/*
 * html 초기화
 */
function initDoucument (){
	
	
	preJson = getUrlParams();
	$("#scenario_id").val(preJson.scenario_id);
	$("#case_id").val(preJson.case_id);
	
	//test case 상태코드 조회 
	ajaxTranCall("code/selectCodeList.do", {"code_group":"C001"}, callBackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"A001"}, callBackS, callBackE);
	ajaxTranCall("code/selectCodeList.do", {"code_group":"B001"}, callBackS, callBackE);
	
	
	//btnStateUpdate : event
	//테스트케이스 상태 변경하기
	$('#btnStateUpdate').on('click', function(){
		
		var jsonObject = {
			"state"			:$("#state").val(), 
			"case_id"		:$("#case_id").val(), 
			"scenario_id"	:$("#scenario_id").val()
		}
		if($("#state").val() == "C001_02"){
			var allClear = true;
			$('#testDefectTable tr').each(function(){
				var dataJson = testDefectTable.row($(this)).data();
				if(dataJson == null){
					isFirst = false;
				}
				else{
					
					if( dataJson.defect_code != "B001_06" ){
						allClear = false;
					}
				}
			});
			if(!allClear)
			{
				alert("완료되지 않은 결함건이 존재합니다.");
				return;
			} 
		}
		ajaxTranCall("scenario/updateTestCaseOnlyState.do", jsonObject, callBackS, callBackE);
	});
	//http://localhost:8080/ntm/?path=defect/excuteDefect&scenario=ANDROID&case=android_002&
	
	//testCase 결함 리스트 조회
	//case "scenario/selectTestCaseList.do":
		
	
	//첨부파일 리스트 변경시 호출됩니다.
	$('#files').on('change', function(e){
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		
		$("#imgs").html("");
		
		var i = 0;
		filesArr.forEach(function(f){
				
			var fs = f.name.split(".");
			var htmlStr = '<img id="img'+f.lastModified+'" style="height:100px;"/>';
			
			//확장자를 추출해서 사용 필요합니 
			$("#imgs").append(htmlStr);
			var reader = new FileReader();
			reader.onload = function(e){
				var fs = f.name.split(".");
				$("#img"+f.lastModified).attr("src", getimgUrl(f.name, e.target.result));
				
			}
			reader.readAsDataURL(f);
		});
	});
	
	
	$("#btnSave").on('click', function(){
		
		//필수값 체크 로직
		if( !modal.modalCheckInputData("defectTableModal")){
			return;
		}

		var fileList = $("#files").prop('files');
		//첨부파일 없는 경우 바로 저장
		if(fileList.length < 1){
			insertDefectCall("-1");
		}
		//첨부파일 있는 경우 첨부파일부터 등록합니다.
		else{
			var data = new FormData();
			for(var i=0; i<fileList.length; i++){
				data.append( "file"+i, fileList[i] );
			}
			
			if(fileList == null){
				data.append("fileLength", "0");
			}
			else{
				data.append("fileLength", fileList.length+"");
			}
			
			data.append("tbname", "itm_defect");
			data.append("user_id", getCookie("user_id"));
			crud = "I";
			data.append("crud", crud);
			
			ajaxTranCallWithFile ("common/uploadFile.file", data,  callBackS, callBackE);
		}
		
		
	});
	
	
	//"location.href='PAGENAME.html'"
	//서브시스템 Table click event
	$('#testDefectTable').on('click', function(){
		
		setTimeout(function() {
			$('#testDefectTable tr').each(function(){
				if($(this).hasClass('selected') ){
					
					//파일 초기화
					$("#files2").val("");
					
					var dataJson = testDefectTable.row($(this)).data();
					$("#titleU").val(dataJson.title);
					$("#test_typeU").val(dataJson.test_type);
					$("#defect_codeU").val(dataJson.defect_code);
					$("#descriptionU").val(dataJson.description);
					$("#defect_resultU").val(dataJson.defect_result);
					$("#defect_user_nameU").val(dataJson.defect_user_name);
					$("#defect_dateU").val(dataJson.reg_date_str);
					$("#defect_id").val(dataJson.defect_id);
					
					$("#imgkey").val(dataJson.imgkey);
					//저장된 이미지 조회 
					ajaxTranCall("defect/selectDefectDetail.do", dataJson, callBackS, callBackE);
					
					//결함이력 조회 
					ajaxTranCall("defect/selectDefectHistory.do", {"defect_id": dataJson["defect_id"]}, callBackS, callBackE);
					
					//테스트자동화 List 조회
					ajaxTranCall("auto/selectAutoList.do", {"defect_id": dataJson["defect_id"]}, callBackS, callBackE);
					
					if($("#state").val() == "C001_03"){
						$("#btnUpdate").hide();
						$("#btnClose").hide();
						$("#btnReject").hide();
						$("#btnAutoTestExcute").hide();
						$("#spanClose").show();
						
						return;
					}
					
					//결함상태에 따라서 처리가능한 버튼 변경합니다. 
//					"B001_01";"결함등록"
//					"B001_02";"배정완료"
//					"B001_03";"조치완료"
//					"B001_04";"미조치건"
//					"B001_05";"개발지연"
//					"B001_06";"결함종료"
//					"B001_07";"결함반려"
					
//					 <button type="button" class="btn btn-success" id="btnUpdate" >변경내용 저장</button>
//					 <button type="button" class="btn btn-success" id="btnClose" style="display:none;">결함종료처리</button>
//					 <button type="button" class="btn btn-danger" id="btnReject" style="display:none;">결함반려처리</button>
					$("#spanClose").hide();
					switch(dataJson.defect_code){
					
					//결함종료
					case "B001_06":
						$("#spanClose").show();
						$("#btnUpdate").hide();
						$("#btnClose").hide();
						$("#btnReject").hide();
						$("#btnAutoTestExcute").hide();
						break;
					//결함등록, 배정완료, 결함반려
					case "B001_01":
					case "B001_02":
					case "B001_07":
						$("#btnUpdate").show();
						$("#btnClose").hide();
						$("#btnReject").hide();
						$("#btnAutoTestExcute").show();
						break;
						
					//조치완료, 미조치건
					case "B001_03":
					case "B001_04":
						$("#btnUpdate").hide();
						$("#btnClose").show();
						$("#btnReject").show();
						$("#btnAutoTestExcute").show();
						break;
						
					//개발지연	
					case "B001_05":
						$("#btnUpdate").show();
						$("#btnClose").show();
						$("#btnReject").hide();
						$("#btnAutoTestExcute").show();
						break;
						
					}
				}
			});
		}, 100); //
	});
	
	$('#btndefectHistory').on('click', function(){
		
		if($("#defect_id").val() != ""){
			$('#modalDefactHistory').modal();
		}
		
		//modalTabledefectHistroty
	});
	
	//modal 3 자동테스트
	$('#btnAutoTest').on('click', function(){
		if($("#defect_id").val() != ""){
			$('#modalAutoTest').modal();
		}
	});
	 
	//변경내용 저장 
	$('#btnUpdate, #btnReject, #btnClose').on('click', function(){
		
		btnType =  $(this).attr('id');
		//추가 파일 업로드건 먼저 체크 필요
		var fileList = $("#files2").prop('files');
		//첨부파일 없는 경우 바로 저장
		if(fileList.length < 1){
			updateDefectCall($("#imgkey").val());
		}
		//첨부파일 있는 경우 첨부파일부터 등록합니다.
		else{
			var data = new FormData();
			for(var i=0; i<fileList.length; i++){
				data.append( "file"+i, fileList[i] );
			}
			
			if(fileList == null){
				data.append("fileLength", "0");
			}
			else{
				data.append("fileLength", fileList.length+"");
			}
			
			data.append("tbname", "itm_defect");
			data.append("user_id", getCookie("user_id"));
			
			if($("#imgkey").val() == "-1"){
				crud = "U";
			}
			else{
				crud = "U";
			}
			
			data.append("imgkey", 	$("#imgkey").val());
			data.append("crud", crud);
			
			ajaxTranCallWithFile ("common/uploadFile.file", data,  callBackS, callBackE);
		}
	});
	
	
	
	//test 자동화 버튼 클릭
	$('#btnAutoTestExcute').on('click', function(){
		
		if(typeof skInterface != "undefined"){
			skInterface.autoTestRecording(getCookie("user_id"),$("#defect_id").val(), $("#titleU").val() );
		}
		else{
			
		}
		
	});
	
	
	//modal user table click 
	$('#modalTableautoTest').on('click', function(){
		setTimeout(function() {
			$('#modalTableautoTest tr').each(function(){
				if($(this).hasClass('selected'	) ){
					var dataJson = modalTableautoTest.row($(this)).data(); 
					ajaxTranCall("auto/selectAutoDetail.do", {"id": dataJson["id"]}, callBackS, callBackE);
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

 

var callBackS = function(tran, data){
	
	switch(tran){
		
	case "auto/selectAutoDetail.do":
		var list = data["list"];
		
		
		c_window.autoTestShow(
			$("#title").val()					//결함제목
			, list[0].html						//html json list
			, $("#selectViewType").val()  		//녹화재생 유형 (auto : 자동수행, manual : 수동수행)
			, list[0].name + " (" + list[0].user_id + ")"
			, list[0].what_day
		);
//		skInterface.autoTestShow(
//			$("#titleU").val(), 
//			list[0].html, 
//			$("#selectViewType").val()
//		);
		
		break;
	
	//테스트케이스 상태 변경하기
	case "scenario/updateTestCaseOnlyState.do":
		
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
//			ajaxTranCall("defect/selectDefectList.do", 		preJson, callBackS, callBackE);
			ajaxTranCall("scenario/selectTestCaseList.do", 	preJson, callBackS, callBackE);
		}
		break;
	
	//테스트 자동화 목록 조회시 (defect_id로 조회 가능)
	case "auto/selectAutoList.do":
		var list = data["list"];
		$("#spanAutoTestCnt").text(list.length + "건");
		modalTableautoTest = $('#modalTableautoTest').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'name' },
	            { "mDataProp" : 'reg_date' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" } 
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
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
	//결함 이력 
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
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" },
			    { "targets": 2, "className": "text-center" },
			    { "targets": 3, "className": "text-center" }

			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    pageLength:5, //기본 데이터건수
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
		        "language": {
			        "emptyTable": "데이터가 없어요." , "search": ""
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
				$("#existingImgs").append(htmlStr);
				
				var ext = list[i].ext;
				debugger;
				
				$("#img"+i).attr("tag", list[i].seq );
				$("#img"+i).attr("src", getimgUrl(originfilename, getFileUrl( list[i].id, list[i].seq)) );
				
				
				//click 이벤트 
				$("#img"+i).on('click', function(e){
					
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
							
//							$(this).addClass('selected');
//							setTimeout(() => $("#modalTableImg").trigger('click'), 500);
						}
						
					});
					$("#modalImg").modal();
				});
				
			}
		}
		break;	
		
	case "code/selectCodeList.do":
		
		var list = data["list"];
		var code_group = data["code_group"];
		
		
		if(code_group == "A001"){
			for(var i=0; i<list.length; i++){
				
				if(list[i].code_id == "A001_03") continue;
				appendSelectBox2( $("#test_typeU"), list[i].code_id, list[i].code_name);
				appendSelectBox2( $("#test_type"), list[i].code_id, list[i].code_name);
				
			}
		}
		else if(code_group == "B001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#defect_codeU"), list[i].code_id, list[i].code_name);
			}
		}
		else if(code_group == "C001"){
			for(var i=0; i<list.length; i++){
				appendSelectBox2( $("#state"), list[i].code_id, list[i].code_name);
			}
			
			
			
			ajaxTranCall("scenario/selectTestCaseList.do", 	preJson, callBackS, callBackE);
		}
		
		
		
		break;
	/*
	 * defect/selectDefectList.do -> 결함리스트 조회 
	 */
	case "defect/selectDefectList.do":
		
		var list = data["list"];
		testDefectTable = $('#testDefectTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'rnum' } ,
	            { "mDataProp" : 'title' },
	            { "mDataProp" : 'test_type_name' },
	            { "mDataProp" : 'defect_name' }  ,
	            { "mDataProp" : 'reg_date_str' } ,
	            { "mDataProp" : 'resolve_date_str' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
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
			 pageLength:5, //기본 데이터건수
			"scrollY":       230,
	        "scrollCollapse": false,
	        dom : 'Bfrtip',
	        buttons: [
	            {
	                text: '결함 등록',
	                className: 'btn btn-outline-secondary test',
	                action: function ( e, dt, node, config ) {
	                	
	                	if($("#state").val() == "C001_03"){
	                		alert("테스트케이스가 종료된 상태입니다.");
	                	}
	                	else{
	                		modal.modalClear("modalNewDefect");
	                		$("#imgs").html('<img id="img2" style="height:100px;"/>');
		                	$('#modalNewDefect').modal();
	                	}
	                	 
	                }
	            }
	            
	        ]
			
	    });
		
		common.tableMappingAfterProcess();
		
		//우측 테이블 초기화 로직
		initDevDefectModalTable();
		
		if($("#state").val() == 'C001_02'){
			var isAllDefectComplete = true;
			for(var i=0; i<list.length; i++){
				
				if(list[i].defect_code != 'B001_06'){
					isAllDefectComplete = false;
				}
			}
			
			if(isAllDefectComplete && list.length > 0){
//				if(confirm("모든결함이 종료되었습니다. 테스트케이스를 완료처리 하시겠습니까?")){
//					$('#btnStateUpdate').trigger('click');
//				}
			}
		}
		
		
		
		break;
	/*
	 * scenario/selectTestCaseList.do -> 테스트케이스 조회
	 */
	case "scenario/selectTestCaseList.do":
		
		var list = data["list"][0];
		
		$("#depth").val(list["depth1"] + " -> " + list["depth2"] + " -> " + list["depth3"]);
		$("#dev_name").val(list["dev_name"]);
		$("#test_name").val(list["test_name"]);
		$("#case_name").val(list["case_name"]);
		$("#scenario_name").val(list["scenario_name"]);
		$("#descriptionT").val(list["description"]);
		$("#state").val(list["state"]);
		
		if($("#state").val() == "C001_01"){
			$("#btnStateUpdate").text("테스트 시작하기");
		}
		else if($("#state").val() == "C001_02"){
			$("#btnStateUpdate").text("테스트 완료처리");
		}
		else{
			$("#btnStateUpdate").text("테스트 완료처리 취소");
		}
		
		
		ajaxTranCall("defect/selectDefectList.do", 		preJson, callBackS, callBackE);
		break;
		
	/*
	 * common/uploadFile.file -> 첨부파일 등록하기
	 */
	case "common/uploadFile.file":
		imgkey = data.imgkey;
		if(crud == "I")
			insertDefectCall(data.imgkey);
		else
			updateDefectCall(data.imgkey);
		break;
		
		
		
		
	case "defect/insertDefect.do":
	case "defect/updateDefect.do":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			
			ajaxTranCall("defect/selectDefectList.do", 		preJson, callBackS, callBackE);
			ajaxTranCall("scenario/selectTestCaseList.do", 	preJson, callBackS, callBackE);
			$('#modalNewDefect').modal("hide"); 
		}
	}
};

var callBackE = function(tran, data){
	
};


var updateDefectCall = function(_imgkey){
	
	var data = {
		"title": $("#titleU").val(),
		"test_type": $("#test_typeU").val(),
		"description": $("#descriptionU").val(),
		"scenario_id": $("#scenario_id").val(),
		"case_id": $("#case_id").val(),
		"defect_code":$("#defect_codeU").val(),
		"imgkey": _imgkey,
		"defect_id":$("#defect_id").val(),
	};
	
	//결함종료 처리
	if(btnType == "btnClose"){
		data["defect_code"] = "B001_06";
	}
	//결함 반려 처리
	else if(btnType == "btnReject"){
		data["defect_code"] = "B001_07";
	}
	
	ajaxTranCall ("defect/updateDefect.do", data,  callBackS, callBackE);
	
}
var insertDefectCall= function(_imgkey){
	
	var data = {
		"title": 			$("#title").val(),
		"test_type": 		$("#test_type").val(),
		"description": 		$("#description").val(),
		"user_id":		 	$("#user_id").val(),
		"scenario_id":	$("#scenario_id").val(),
		"case_id": 		$("#case_id").val(),
		"defect_code":		"B001_01",
		"imgkey": _imgkey,
		"state" : $("#state").val()
	};
	ajaxTranCall ("defect/insertDefect.do", data,  callBackS, callBackE);
}


/*
 * 결함상세 테이블 초기화 로직
 */
var initDevDefectModalTable = function (){
	
	$("#titleU").val("");
	$("#test_typeU").val("");
	$("#defect_codeU").val("");
	$("#descriptionU").val("");
	$("#defect_resultU").val("");
	$("#defect_user_nameU").val("");
	$("#defect_dateU").val("");
	$("#defect_id").val("");
	
	$("#imgkey").val("");
	

	$("#spanDefectHistoryCnt").text("-건");
	$("#spanAutoTestCnt").text("-건");
	
	$("#btnUpdate").hide();
	$("#btnClose").hide();
	$("#btnReject").hide();
	$("#btnAutoTestExcute").hide();
	$("#spanClose").hide();
	
	
}
