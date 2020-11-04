var statTeamTable;

/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	
	$("#base_date").val(new Date().toISOString().substring(0, 10));
	
	
	//단위/통합테스트 select box 값 세팅
	var selectProjectHtml = $("#selectProject").html();
	selectProjectHtml = selectProjectHtml.replace(/"/gi, "'");
	$("#selectProject2").append(selectProjectHtml);
	
	
	selectStatTeamList();
	
	//event 처리
	//조회버튼
	$('#btnSelect').on('click', function(){
		selectStatTeamList()
	});
	
	$("#selectProject2").on('change', function(){
		selectStatTeamList();
	});
	
	$("#base_date").on('change', function(){
		selectStatTeamList();
	});
	
	
	//1개 개발자 선택시에 개인 리포트 출력함
	$('#statTeamTable').on('click', function(){
		setTimeout(function() {
			$('#statTeamTable tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = statTeamTable.row($(this)).data();
					
					//뒤 단위 떄문에 수작업으로 맵핑
//					modal.convertJsonObjToModal("modalUser", dataJson );

					if(dataJson.reader == ""){
						$("#team_info").text("팀원 " + dataJson.dev_cnt + "명");
					}
					else{
						$("#team_info").text("(팀장) " + dataJson.reader + " 외 " + dataJson.dev_cnt + "명");
					}
						
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

var selectStatTeamList = function( ){
	
	ajaxTranCall("stat/selectStatTeamList.do", 
	{  
		"project_id":$("#selectProject2").val(), 
		base_date : $("#base_date").val().replace(/-/gi, "")
	}, 
	callBackS, callBackE);
}

var callBackS = function(tran, data){
	
	var list = data["list"];
	
	switch(tran){
		
		
	case "stat/selectStatTeamList.do":
	
	
		for(var i=0; i<list.length;i++){
			
			var case_cnt = Number(list[i].case_cnt);
			var defect_cnt = Number(list[i].defect_cnt);
			var not_defect_cnt = Number(list[i].not_defect_cnt);
			var required_cnt = Number(list[i].required_cnt);
			var reject_cnt =  Number(list[i].reject_cnt);  //반려건수
			var non_defect_cnt =  Number(list[i].non_defect_cnt);  //수정요청건
			var sum_time =  Number(list[i].sum_time);  //수정요청건
			var tran_cnt =  Number(list[i].tran_cnt);  //수정요청건
			
			//평균결함건
			if(defect_cnt != 0 && case_cnt != 0){
//				list[i].avgDefectRate = Math.round(defect_cnt / case_cnt ).toFixed(1);
				list[i].avgDefectRate = Math.round(Math.round(defect_cnt / case_cnt * 100))/100
			}
			else{
				if(case_cnt == 0){
					list[i].avgDefectRate = "-";
				}
				else{
					list[i].avgDefectRate = "0.1";
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
			
			
			//팀원수 구하기			
		}
		
		
		
		statTeamTable  = $('#statTeamTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            //사용자 기본정보
	            { "mDataProp" : 'team_name' } , 
	            { "mDataProp" : 'reader' } ,
	            { "mDataProp" : 'dev_cnt' } ,

				//사용자 기본정보 

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
			    { "targets": 0, "className": "text-center"  ,"width":"6%"},
			    { "targets": 1, "className": "text-center"  ,"width":"15%"},
			    { "targets": 2, "className": "text-center", "width":"10%","render": function ( data, type, row ) {return data +'명';}},
			    { "targets": 3, "className": "text-center", "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 4, "className": "text-center", "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 5, "className": "text-center", "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 6, "className": "text-center", "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 7, "className": "text-center", "render": function ( data, type, row ) {return data +'건';}},
			    { "targets": 8, "className": "text-center", "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 9, "className": "text-center", "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 10, "className": "text-center", "render": function ( data, type, row ) {return data +'%';}},
			    { "targets": 11, "className": "text-center", "render": function ( data, type, row ) {return data +'시간';}}
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
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
	        		extend:'excel',
					className: 'btn btn-outline-secondary',
	        		text:'다운로드',
	        		bom:true
	        	}
        	]
	    });
		common.tableMappingAfterProcess();
		break;
	}
}



var callBackE = function(tran, data){
//	alert("callBackE");
}