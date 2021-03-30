/*
 * @author  kimtaehan
 * @version 1.0
 * @see     js
 */

//사용자 테이블
var userTable;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){

	//Team list 조회 (select 박스 용)
	ajaxTranCall("user/selectTeamList.do", {}, calBackS, callbackE);

	//사용자 리스트 조회
	basicInquiry();
	
	
	//event 처리
	//조회버튼
	$('#btnSelect').on('click', function(){
		basicInquiry()
	});
	
	
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
		
		//필수값 체크 
		if(!modal.modalCheckInputData("userDetailTable")) return;
		var birth = $("#birth").val() ;
		//생년월일은 div 1 depth 더 들어가서 처리 불가 
		//공통소스 고치기 귀찮아 그냥 추가
		if( birth == ""){
			alert("필수 입력값을 입력해주세요.");
			$("#birth").focus();
			return;
		}
//		var userIdCheck = RegExp(/([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/);

//		if(userIdCheck.test(birth)){
//			alert("생년월일을 확인하세요.");
//			$("#birth").focus(); return;
//		}
			
		var dataJson = modal.convertModalToJsonObj("userDetailTable" );
		
		
		if($("#phone_num2").val() != ""){
			dataJson.phone_num = $("#phone_num1").val() + $("#phone_num2").val();
		}
		
		ajaxTranCall("user/insertUser.do", dataJson, calBackS, callbackE);
	});
	
	//
	$("#btnUpdate").click(function(e){
		
		if(!modal.modalCheckInputData("userDetailTable")) return;
		
		var birth = $("#birth").val() ; 
		
		//생년월일은 div 1 depth 더 들어가서 처리 불가 
		//공통소스 고치기 귀찮아 그냥 추가
		if( birth == ""){
			alert("필수 입력값을 입력해주세요.");
			$("#birth").focus();
			return;
		}
//		var userIdCheck = RegExp(/^[A-Za-z0-9_\-]{5,20}$/);
//		if(userIdCheck.test(birth)){
//			alert("생년월일을 확인하세요.");
//			$("#birth").focus(); return;
//		}
		
		var dataJson = modal.convertModalToJsonObj("userDetailTable" );
		if($("#phone_num2").val() != ""){
			dataJson.phone_num = $("#phone_num1").val() + $("#phone_num2").val();
		}
		
		
		ajaxTranCall("user/updateUser.do", dataJson, calBackS, callbackE);
	});
	
	$("#team_id_main").on('change', function(){
		basicInquiry();
	});
	
	//사용자 컬럼 선택시
	$('#userTable').on('click', function(){
		
		
//		selectDefectList();
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
	        
        ajaxFormExcel("excel/uploadExcelUser.excel", "file1", calBackS);

	});
	
	
	 
	 
	$("#btnExcelDownFail").on('click', function(){
		
		//downlod 할 json 타입 만들기 
		var size = userTable2.data().length;
		var list = new Array();
		if(size == 0){
			
		}
		else{
			for(var i=0; i<size; i++){

				var jsonTemp = {
					"user_id":userTable2.data()[i].col0,
					"password":userTable2.data()[i].col1,
					"name":userTable2.data()[i].col2,
					"team_name":userTable2.data()[i].col3,
					"organization":userTable2.data()[i].col4,
					"position":userTable2.data()[i].col5,
					"phone_num_fomatting":userTable2.data()[i].col6,
					"sex_fomatting":userTable2.data()[i].col7,
					"birth":userTable2.data()[i].col8
				};
				list.push(jsonTemp);
			}
		}
		ajaxTranCall("excel/downloadUserExcel.do", {"list": list} ,calBackS, callbackE);
	});
	
	
			        	 
	
}



var basicInquiry = function( ) {

	var json = {
		team_id : $("#team_id_main").val()		
	};

	ajaxTranCall("user/selectUserList.do", json, calBackS, callbackE);
} 

var calBackS = function(tran, data){
	
	switch(tran){
		
	case "excel/downloadUserExcel.do":
		
		if(data["filePath"] == ""){
			alert("파일 다운로드에 실패했습니다.");
			return;
		}
		else{
			
			var temp = getExcelFileUrl( data["filePath"]);
			$("#fileDownObj").attr('src',  temp);
		}
		
		break;
	
	case "user/insertUser.do":
	case "user/deleteUser.do":
	case "user/updateUser.do":
	
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			basicInquiry();
			$('#modalUser').modal("hide"); //닫기 
		}
		
		
		
		break;
	case "excel/uploadExcelUser.excel":
		alert(data["message"]);
		if(data["resultCode"] == "0000" ){
			basicInquiry();
			var list = data["list"];
			
		
			//파일 업로드 파일 초기화
			$("#file1").val("");
			if(list.length > 0 ){
				
				for(var i=0;i<list.length; i++) {
					list[i].rnum = i+1
				}
				
				userTable2 = $('#userTable2').DataTable ({
					destroy: true,
			        "aaData" : data["list"],

			        "columns" : [
			            { "mDataProp" : "rnum" },
			        	{ "mDataProp" : "col0" } ,
			            { "mDataProp" : "col1" },
			            { "mDataProp" : "col2" },
			            { "mDataProp" : "col3" },
			            { "mDataProp" : "col4" },
			            { "mDataProp" : "col5" },
			            { "mDataProp" : "col6" },
			            { "mDataProp" : "col7" },
			            { "mDataProp" : "col8" },
			            { "mDataProp" : "result" }
			            
			            
			        ],
					"language": {
				        "emptyTable": "데이터가 존재하지 않습니다." 
				    },
				    pageLength:10, //기본 데이터건수
					lengthChange: false, 	// 표시 건수기능 숨기기
					searching: false,  		// 검색 기능 숨기기
					ordering: false,  		// 정렬 기능 숨기기
					info: false,			// 정보 표시 숨기기
					paging: true, 			// 페이징 기능 숨기기
					select: {
			            style: 'single' //single, multi
					},
					
			        dom : 'Bfrtip',
			        buttons: [
			        ]
				 });
				$('#modalExcel').modal(); //닫기 
			}
		}
		
		break;
	case "user/selectTeamList.do":
		
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			
			if( list[i].role_code == 'ADMIN' &&  !common.isAdmin()){
				continue;	
			}
			
			appendSelectBox("team_id", 		list[i].id, list[i].name  );
			appendSelectBox("team_id_main", list[i].id, list[i].name);
		}
		
		break;
	
	case "user/selectUserList.do":
		if(data.resultCode != "0000"){
			return;
		}
		
		var list = data["list"];
		for(var i=0 ; i< list.length; i++){
			
			list[i].rnum = i+1;
			var phone_num = list[i].phone_num;
			
			if(phone_num != ""){
				list[i].phone_num_fomatting = phoneFomatter(phone_num);
			}
			else{
				list[i].phone_num_fomatting = "";
			}
			
			var sex = list[i].sex;
			if(sex == "M") list[i].sex_fomatting = "남성";
			else if(sex == "F") list[i].sex_fomatting = "여성";
			else list[i].sex_fomatting = "미상";
			
			var birth = list[i].birth;
			if(birth != ""){
				var birthday = new Date(birth.substring(0,2) + "/" + birth.substring(2, 4) + "/" +  birth.substring(4) );
				var today = new Date();
				var years = today.getFullYear() - birthday.getFullYear();
				 
				// Reset birthday to the current year.
				birthday.setFullYear(today.getFullYear());
				
				if (today < birthday)
				{
				    years--;
				}
				list[i].age =  years + "세";
			}
			else {
				list[i].age =  "";
			}
			
			
		}
			//phoneFomatter('01000000000')
		
		userTable = $('#userTable').DataTable ({
			
			destroy: true,
	        "aaData" : data["list"],
	        "columns" : [
	        	{ "mDataProp" : "user_id" } ,
	            { "mDataProp" : "name" },
	            { "mDataProp" : "team_name" },
	            { "mDataProp" : "organization" },
	            { "mDataProp" : "position" },
	            { "mDataProp" : "phone_num_fomatting" },
	            { "mDataProp" : "sex_fomatting" },
	            { "mDataProp" : "birth" },
	            { "mDataProp" : "age" }
	        ],
			'columnDefs': [
			    { "targets": 0, "width":"7%",  "className": "text-center" },
			    { "targets": 1, "width":"15%", "className": "text-center" },
			    { "targets": 2, "width":"19%", "className": "text-center" },
			    { "targets": 3, "width":"10%", "className": "text-center" },
			    { "targets": 4, "width":"10%", "className": "text-center" },
			    { "targets": 5, "width":"15%", "className": "text-center" },
			    { "targets": 6, "width":"7%",  "className": "text-center" },
			    { "targets": 7, "width":"10%", "className": "text-center" }, 
			    { "targets": 8, "width":"7%",  "className": "text-center" }
			],
			"language": {
		        "emptyTable": "데이터가 존재하지 않습니다." 
		    },
		   
//			lengthChange: false, 	// 표시 건수기능 숨기기
//			searching: true,  		// 검색 기능 숨기기
//			ordering: false,  		// 정렬 기능 숨기기
//			info: false,			// 정보 표시 숨기기
//			paging: true, 			// 페이징 기능 숨기기
//			select: {
//	            style: 'single' //single, multi
//			},
//			"scrollY":        550,
//	        "scrollCollapse": false,
//			 pageLength:15, //기본 데이터건수
		
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
//				{
//	                text: '조회',
//	                className: 'btn btn-outline-info all',
//	                action: function ( e, dt, node, config ) {
//						basicInquiry();
//	                }
//	            },
	            {
	                text: '등록',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						userDetailTable_init();
						$("#btnSave").show();
						$("#btnUpdate").hide();
	                	$('#modalUser').modal();
	                }
	            },
				{
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
						userModaltableSetting();
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
		
						if( getCookie("role_code") != 'ADMIN'){
							alert("권한이 없습니다. \n관리자에게 문의하세요");
							return;
						}
						
	                	var isSelected = false;
	                    $('#userTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){
		           				 if(confirm(userTable.row($(this)).data().name + " 을(를) 삭제하시겠습니까?")){
		           					var dataJson = {
		           						user_id : userTable.row($(this)).data().user_id
	           						};
	           						ajaxTranCall("user/deleteUser.do", dataJson, calBackS, callbackE);
		           				 }
		           				isSelected = true;;
		           			 }
	                    });
	                    if(!isSelected) alert("삭제할 사용자를 선택해주세요.");
	                }
	            },
				{
	                text: '다운로드',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
		
						//downlod 할 json 타입 만들기 
						var size = userTable.data().length;
						var list = new Array();
						if(size == 0){
							
						}
						else{
							for(var i=0; i<size; i++){
								list.push(userTable.data()[i]);
							}
						}
						ajaxTranCall("excel/downloadUserExcel.do", {"list": list} ,calBackS, callbackE);
					}
				},
				{
	                text: '업로드',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
						if( !common.isAdmin()){
						alert("권한이 없습니다. \n관리자에게 문의하세요");
						return;
					}
					
									
					$('#file1').trigger('click');
					}
				}
	        ]
			
	    });
		//우측 사용자 상세 테이블 초기화 
//		userDetailTable_init();
		
		common.tableMappingAfterProcess();
		
		break;
	}
	
//	{"resultCode":"0000","message":"정상적으로 조회되었습니다.","list":[{"reg_user":"nexcore","modify_user":"nexcore","description":"관리자계정입니다.","admin":true,"reg_date":1588572727418,"password":"admin","user_id":"admin","organization":"SK주식회사","name":"관리자","phone_num":"010-0000-0000","position":"수석","modify_date":1588572727418,"email":"nexcore4u@sk.com"}]}
}

var callbackE = function(tran, data){
	
}


var userModaltableSetting = function(){
	var isSelected = false;
	setTimeout(function() {
		$('#userTable tr').each(function(){
			
			if($(this).hasClass('selected') ){
				
				var dataJson = userTable.row($(this)).data();
				
				if( !common.isAdmin() && dataJson.user_id != getCookie("user_id")){
					alert("본인정보만 수정할 수 있습니다.");
					isSelected = true;
					return;
				}
				
				modal.convertJsonObjToModal("userDetailTable", dataJson);
				
				$("#user_id").attr("readonly",true); 
				
				var phone_num = dataJson.phone_num;

				if(phone_num != null && phone_num != "" && phone_num.length>3){
					var phone_num1 = phone_num.substring(0,3);
					if( phone_num1 == "010" || phone_num1 == "011" || phone_num1 == "016" || phone_num1 == "018" || phone_num1 == "019"){
						$("#phone_num1").val(phone_num1);
						$("#phone_num2").val(phone_num.substring(3));
					}
					else{
						$("#phone_num1").val("");
						$("#phone_num2").val(phone_num);
					}
				}
				else{
					$("#phone_num1").val("");
					$("#phone_num2").val(phone_num);
				}

	
				$("#hearderTitle").text("사용자 정보 수정");
				
				$("#btnSave").hide();
				$("#btnUpdate").show();
				$('#modalUser').modal();
				isSelected = true;;
			}
		});
		
				
        if(!isSelected) alert("수정할 사용자를 선택해주세요.");
	}, 100);
		
}
/*
 * 우측 사용자 상세 테이블 초기화 
 */
var userDetailTable_init = function(){
	
	modal.modalClear("userDetailTable");
	$("#sex").val("M");
	$("#phone_num1").val("010");
	
	$("#btnSave").show();
	$("#btnUpdate").hide();
	$("#hearderTitle").text("신규사용자 등록");
	$("#user_id").attr("readonly",false); 
}

