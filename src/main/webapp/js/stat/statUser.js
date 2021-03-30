/*
 * @author  kimtaehan
 * @version 1.0
 * @see     js
 */
var statUserTable;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	
	
	$("#base_date").val(new Date().toISOString().substring(0, 10));
	
	//개발팀 조회 selectbox 
	ajaxTranCall("user/selectTeamList.do", {"role_code" : "DEV"}, callbackS, callbackE);
	
	//단위/통합테스트 select box 값 세팅
	var selectProjectHtml = $("#selectProject").html();
	selectProjectHtml = selectProjectHtml.replace(/"/gi, "'");
	$("#selectProject2").append(selectProjectHtml);
	
	
	
	//event 처리
	//조회버튼
	$('#btnSelect').on('click', function(){
		selectStatUserList()
	});
	
	 //selectProject2
	//Team selectbox 값 변경시 재조회 로직
	$("#selectTeam").on('change', function(){
		selectStatUserList();
	});
	
	$("#selectProject2").on('change', function(){
		selectStatUserList();
	});
	
	$("#base_date").on('change', function(){
		selectStatUserList();
	});
	
	
	//1개 개발자 선택시에 개인 리포트 출력함
	$('#statUserTable').on('click', function(){
		setTimeout(function() {
			$('#statUserTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = statUserTable.row($(this)).data();
					
					//뒤 단위 떄문에 수작업으로 맵핑
//					modal.convertJsonObjToModal("modalUser", dataJson );
					$("#name").text(dataJson.name);
					$("#team_name").text(dataJson.team_name);
					
					
					$("#avgDefectRate").text(dataJson.avgDefectRate + "건");
					$("#actionRate").text(dataJson.actionRate + "%");
					$("#rejectRate").text(dataJson.rejectRate + "%");
					$("#actionTime").text(dataJson.actionTime + "시간");
					$("#nonDefectRate").text(dataJson.nonDefectRate + "%");
					
					
					$("#case_cnt").text(dataJson.case_cnt + "건");	 
					$("#defect_cnt").text(dataJson.defect_cnt + "건");	 
					$("#completed_cnt").text(dataJson.completed_cnt + "건");	 
					$("#required_cnt").text(dataJson.required_cnt + "건");	 
					$("#delay_cnt").text(dataJson.delay_cnt + "건");		
					$("#non_defect_cnt").text(dataJson.delay_cnt + "건");		 
					$("#reject_cnt").text(dataJson.reject_cnt + "번");
					

					$('#modalUser').modal();
				}
			});
		}, 100);
		
//		selectDefectList();
	});
	
}

var selectStatUserList = function(){
	ajaxTranCall("stat/selectStatUserList.do", {
		team_id : $("#selectTeam").val(),
		project_id: $("#selectProject2").val(),
		base_date : $("#base_date").val().replace(/-/gi, "")
	}, callbackS, callbackE);
}

var callbackS = function(tran, data){
	
	var list = data["list"];
	
	switch(tran){
	
	case "user/selectTeamList.do":
		
		htmlSelectBox2($("#selectTeam"), 	"", 	"개발팀 전체");
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectTeam"), list[i].id, list[i].name);
		}
		selectStatUserList();
	
		break;
		
	case "stat/selectStatUserList.do":
		
		for(var i=0; i<list.length;i++){
			
			var case_cnt = Number(list[i].case_cnt);
			var defect_cnt = Number(list[i].defect_cnt);
			var not_defect_cnt = Number(list[i].not_defect_cnt);
			var required_cnt = Number(list[i].required_cnt);
			var reject_cnt =  Number(list[i].reject_cnt);  //반려건수
			var non_defect_cnt =  Number(list[i].non_defect_cnt);  //수정요청건
			var sum_time =  Number(list[i].sum_time);  //수정요청건
			var tran_cnt =  Number(list[i].tran_cnt);  //수정요청건
			//
			
//			list[i].case_cnt 		= case_cnt + "건";
//			list[i].defect_cnt 		= defect_cnt + "건";
//			list[i].not_defect_cnt  = not_defect_cnt + "건";
//			list[i].required_cnt 	= required_cnt + "건";
//
			//평균결함건
			if(defect_cnt != 0 && case_cnt != 0){
				list[i].avgDefectRate = Math.round(Math.round(defect_cnt / case_cnt * 100))/100
				//Math.round(defect_cnt / case_cnt ).toFixed(1);
				
			}
			else{
				if(case_cnt == 0){
					list[i].avgDefectRate = "-";
				}
				else{
					list[i].avgDefectRate = 0.0;
				}
				
			}
//			 
//			//조치율 Action rate
//			list[i].actionRate = "0";
			if(defect_cnt != 0 && required_cnt != 0){
				list[i].actionRate = Math.round( (defect_cnt-required_cnt) / defect_cnt *100 ) ;
			}
			else{
				if(case_cnt == 0){
					list[i].actionRate = "-";
				}
				else{
					list[i].actionRate = 100;
				}
			}
			
			//비결함율 ()
			list[i].nonDefectRate = "-";
			if(defect_cnt != 0 && non_defect_cnt != 0){
				list[i].nonDefectRate = Math.round( (non_defect_cnt) / defect_cnt *100 ) ;
			}
			else{
				if(case_cnt == 0 ){
					list[i].nonDefectRate = "-";
				}
				else{
					list[i].nonDefectRate = 100;
				}
			}
			
//			A001_01
			//반려율 
			list[i].rejectRate = "-";
			if(defect_cnt != 0 && reject_cnt != 0){
				list[i].rejectRate =  Math.round( reject_cnt / defect_cnt *100 ) ;
			}
			else{
				if(case_cnt == 0 ){
					list[i].rejectRate = "-";
				}
				else{
					list[i].rejectRate = 0;
				}
			}
//			
			list[i].actionTime = "-";
			if(sum_time != 0 && tran_cnt != 0){
				list[i].actionTime = Math.round( sum_time/tran_cnt/60*100)/100;
			}
			

			
		}
		
		
		statUserTable  = $('#statUserTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [

				//사용자 기본정보
	            { "mDataProp" : 'user_id' } , 
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'team_name' } ,

				//결함통계1
	            { "mDataProp" : 'case_cnt' }, 			//수행중/완료인 테스트케이스 건수
	            { "mDataProp" : 'defect_cnt' },			//DEFECT 총건수 
	            { "mDataProp" : 'required_cnt' },		//조치필요건
	            { "mDataProp" : 'delay_cnt' },		//비결함건수 

				//결함통계2
	            { "mDataProp" : 'avgDefectRate' },
	            { "mDataProp" : 'actionRate' },
	            { "mDataProp" : 'nonDefectRate' },
	            { "mDataProp" : 'rejectRate' },
				{ "mDataProp" : 'actionTime' }
	            //
	        ],
			
			'columnDefs': [
			    { "targets": 0, "className": "text-center" ,"width":"6%"},
			    { "targets": 1, "className": "text-center" ,"width":"15%"},
			    { "targets": 2, "className": "text-center" ,"width":"15%"},
			    { "targets": 3, "className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 4, "className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 5, "className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 6, "className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 7, "className": "text-center" , "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 8, "className": "text-center" , "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 9, "className": "text-center" , "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 10, "className": "text-center" , "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 11, "className": "text-center" , "render": function ( data, type, row ) {return data +'시간';}}
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
			 "sDom": 'lfrtip',
			"scrollY":        550,
			"scrollCollapse": false,
			select: {
	            style: 'single' //single, multi
			},
		    
		    dom : 'Bfrtip',
	        buttons: [
				{
		                text: '갱신',
	                	className: 'btn btn-outline-secondary test',
		                action: function ( e, dt, node, config ) {
		                	ajaxTranCall("stat/replaceUserStat.do", { }, callbackS, callbackE);
		                }
		            },
	        	{
	        		extend:'excel',
	        		text:'다운로드',
					className: 'btn btn-outline-secondary',
	        		bom:true
	        	}
        	]
			//컬럼속성
//			,
//			
//	        "columnDefs": [
//	            {
//	                "targets": [ 12 ],
//	                "visible": false,
//	                "searchable": true
//	            },
//	        ]
	    });
		common.tableMappingAfterProcess();
		break;
	}
}



var callbackE = function(tran, data){
//	alert("callbackE");
}