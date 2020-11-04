/*
 * @author  kimtaehan
 * @version 1.0
 * @see     js
 */

var pushTable;
var user_id = "";
var name = "";
var team_id = "";
var team_name = "";

/* 3 donut charts */ 
var colors = ['red','skyblue','yellowgreen','#c3e6cb','#dc3545','#6c757d'];


var donutOptions = { 
	cutoutPercentage: 40,
	legend: 
		{
//			position:'top', 
			position:'bottom', 
			padding:5, 
			labels: {
				fontSize:15,
				pointStyle:'circle', 
				usePointStyle:true
				
			}
		} 
};
	
	
/**
 * html loding complete calling
 * @param {}
 * @returns {} 
 */
var initDoucument = function(){
	
	
	user_id 	= getCookie('user_id');
	team_id		= getCookie('team_id');
	team_name 	= getCookie('team_name');
	name 		= getCookie('name');
	
	//전용브라우져로 열었을떄 push agent module 수행 
	//특정주기마다 Push msg 확인 프로세스 호출하도록
	if(typeof skInterface != "undefined"){
		skInterface.startPushAgentModule();
	}
	//USER 정보 설정 
	
//	$("#titleMain").text(name + "(" + team_name + ")님 환영합니다.");
	
	
	if( getCookie("role_code") == "ADMIN" || getCookie("role_code") == "ETC"){
		
		$("#divAdmin").show();
		$("#divNotAdmin").hide();
		
		ajaxTranCall("stat/selectMainDataForAdmin.do", { 
			
			project_id:$("#selectProject").val(), base_date:new Date().toISOString().substring(0, 10).replace(/-/gi, "") }, callbackS, callBackE);
		
	}
	else{
		$("#divAdmin").hide();
		$("#divNotAdmin").show();
		
		
		//1. push 이력 조회 서비스 호출
		ajaxTranCall("push/selectPushListByUser.do", {}, callbackS, callBackE);
		
		
		//2. 개발자/Admin 구분하여 처리진행
		if(getCookie('role_code') == "TEST"){
			$("#chartTitle1").text("테스트 케이스 진행율");
			$("#chartTitle2").text("테스트케이스 현황");
			
			ajaxTranCall("stat/selectMainDataForTester.do", 
				{
					reg_user : user_id, 
					team_id:team_id,
					project_id:$("#selectProject").val()
				}, 
			callbackS, callBackE);
		
		}
		else if(getCookie('role_code') == "DEV"){
			$("#chartTitle1").text("결함 조치율");
			$("#chartTitle2").text("결함 조치현황");
			
			ajaxTranCall("stat/selectMainDataForDeveloper.do", 
				{
					defect_user : user_id, 
					team_id:team_id,
					project_id:$("#selectProject").val()
				}, 
			callbackS, callBackE);
		}
		else{
			
			$("#chartTitle1").text("");
			$("#chartTitle2").text("");
			$("#chartTitle3").text("");
			$("#chartTitle4").text("");
		}
		
		//팝업 수정 button click event handler
		$("button").click(function(e){
			
			switch(this.id){
				
			case "btnQuick1":
				if(getCookie('role_code') == "TEST"){
					location.href="/ntm?path=defect/excute&state=C001_01";
				}
				else if(getCookie('role_code') == "DEV"){
					location.href="/ntm?path=defect/defect&selectDefectCode=2";
				}
				break;
				
			case "btnQuick2":
				if(getCookie('role_code') == "TEST"){
					location.href="/ntm?path=defect/excute&state=C001_02";
				}
				else if(getCookie('role_code') == "DEV"){
					location.href="/ntm?path=defect/defect&selectDefectCode=3";
				}
				
				break;
				
			case "btnQuick3":
				if(getCookie('role_code') == "TEST"){
					location.href="/ntm?path=defect/excute&state=C001_02&isCheckTest=1";
				}
				
				else if(getCookie('role_code') == "DEV"){
					location.href="/ntm?path=defect/defect&selectDefectCode=1";
				}
				
				break;
			}
		});
		 
		//push Table click event
		$('#pushTable').on('click', function(){
			setTimeout(function() {
				$('#pushTable tr').each(function(){
					if($(this).hasClass('selected') ){
						var dataJson = pushTable.row($(this)).data();
						$("#modalTitle").text("["+dataJson.push_code_name+"] " + dataJson.title);
						
						var msg = dataJson.msg;
						$("#whatday").html(dataJson.reg_date_str);
						$("#pushMsg").html(msg.replace(/\n/gi, "<br/>"));
						
						$('#modalPush').modal();
					}
				});
			}, 100);
		});
	}	
	
	
	
}
	
var callbackS = function(tran, data){
	
	switch(tran){
		
	case "stat/selectMainDataForDeveloper.do":
		
		var listDf = data["listDf"];
		var listChart1 = new Array();
		var listChart2 = new Array();
//		debugger;


		$("#btnQuick1").text((Number(listDf[1].user) + Number(listDf[6].user)) + "건의 미처리된 결함");
		$("#btnQuick2").text(listDf[4].user + "건의 개발지연중인 결");
		$("#btnQuick3").text((Number(listDf[0].team) ) + "건의 배정대기중인 결함");
		//labels: ['프로젝트', team_name, name ]
		listChart1.push(
			(
				(Number(listDf[5].project)+Number(listDf[2].project)+Number(listDf[3].project))
				/(
					Number(listDf[0].project)+Number(listDf[1].project)+Number(listDf[2].project)+Number(listDf[3].project)
					+Number(listDf[4].project)+Number(listDf[5].project)+Number(listDf[6].project)
				)*100
			).toFixed(2)
		);
		
		listChart1.push(
			(
				(Number(listDf[5].team)+Number(listDf[2].team)+Number(listDf[3].team))
				/(
					Number(listDf[0].team)+Number(listDf[1].team)+Number(listDf[2].team)+Number(listDf[3].team)
					+Number(listDf[4].team)+Number(listDf[5].team)+Number(listDf[6].team)
				)*100
			).toFixed(2)
		);
		listChart1.push(
			(
				(Number(listDf[5].user) +Number(listDf[2].user)+Number(listDf[3].user))
				/(
					Number(listDf[0].user)+Number(listDf[1].user)+Number(listDf[2].user)+Number(listDf[3].user)
					+Number(listDf[4].user)+Number(listDf[5].user)+Number(listDf[6].user)
				)*100
			).toFixed(2)
		);
		
		//조치필요, 조치완료, 결함종료, 지연
		
		listChart2.push(
			Number(listDf[1].user) + Number(listDf[6].user)
		)
		listChart2.push(
			Number(listDf[2].user) + Number(listDf[3].user)
		)
		listChart2.push(
			Number(listDf[5].user)
		)
		listChart2.push(
			Number(listDf[4].user)
		)

		
		
		var ctx = document.getElementById('chart1'); 
		var myChart = new Chart(ctx, 
			{ 
				type: 'bar', 
				data: { 
					labels: ['프로젝트',  team_name, name ], 
					datasets: [
						{ 
							label: '단위 %', 
							data: listChart1, 
							backgroundColor: [ 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)','rgba(255, 206, 86, 0.2)',  'rgba(153, 102, 255, 0.2)' ], 
							borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)',  'rgba(153, 102, 255, 1)' ],
	 						borderWidth: 1 
						}
					] 
				}, 
		options: { scales: { yAxes: [{ ticks: { 
			 min: 0,
        	max: 100,
        	stepSize: 10
		} }] } } });
		
		//조치필요, 조치완료, 결함종료, 지연
		var chDonutData1 = {
			labels: ['조치필요', '조치완료', '종료', '지연'], 
			datasets: [ 
				{ 
					backgroundColor: colors.slice(0,3), 
					borderWidth: 0, 
					data: listChart2
				} 
			] 
		}; 
		var chDonut1 = document.getElementById("chart2"); 
		if (chDonut1) {
			 new Chart(chDonut1, { type: 'pie', data: chDonutData1, options: donutOptions }); 
		}
		
		
		
		break;
		
	case "stat/selectMainDataForTester.do":
		
		var listSc = data["listSc"];
		var listDf = data["listDf"];
		var listChart1 = new Array();
		var listChart2 = new Array();
				
		
		$("#btnQuick1").text(listSc[0].user + "건의 수행대기중인 테스트 케이스");
		$("#btnQuick2").text(listSc[1].user + "건의 수행중인 테스트 케이스");
		$("#btnQuick3").text((Number(listDf[2].user) + Number(listDf[3].user)) + "건의 현업확인이 필요한 결함");
		
		 
		listChart1.push( (Number(listSc[2].project)/(Number(listSc[0].project) + Number(listSc[1].project) + Number(listSc[2].project)) *100).toFixed(2));
		listChart1.push( (Number(listSc[2].team)/(Number(listSc[0].team) + Number(listSc[1].team) + Number(listSc[2].team)) *100).toFixed(2));
		listChart1.push( (Number(listSc[2].user)/(Number(listSc[0].user) + Number(listSc[1].user) + Number(listSc[2].user)) *100).toFixed(2));
		
		
		for(var i=0; i<listSc.length; i++){
			listChart2.push(Number(listSc[i].user));
		}	
		
		var ctx = document.getElementById('chart1'); 
		var myChart = new Chart(ctx, 
			{ 
				type: 'bar', 
				data: { 
					labels: ['프로젝트',  team_name, name ], 
					datasets: [
						{ 
							label: '단위 %', 
							data: listChart1, 
							backgroundColor: [ 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)' ], 
							borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)' ],
	 						borderWidth: 1 
						}
					] 
				}, 
		options: { scales: { yAxes: [{ ticks: { 
			 min: 0,
        	max: 100,
        	stepSize: 10
		} }] } } });
		
		
	
	
		var chDonutData1 = {
			labels: ['수행대기', '수행중', '수행완료'], 
			datasets: [ 
				{ 
					backgroundColor: colors.slice(0,3), 
					borderWidth: 0, data: listChart2
				} 
			] 
		}; 
		var chDonut1 = document.getElementById("chart2"); 
		if (chDonut1) {
			 new Chart(chDonut1, { type: 'pie', data: chDonutData1, options: donutOptions }); 
		}
		
	
		break;
		
	case "push/selectPushListByUser.do":
		var list = data["list"];
		pushTable = $('#pushTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'reg_date_str' } ,
	            { "mDataProp" : 'req_user_name' },
	            { "mDataProp" : 'push_code_name' },
	            { "mDataProp" : 'title' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			    { "targets": 1, "className": "text-center" },
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
			"scrollY":        380,
	        "scrollCollapse": false,
	        pageLength:10, //기본 데이터건수
	        dom : 'Bfrtip',
	        buttons: [
//	             {
//	                text: '재조회',
//	                action: function ( e, dt, node, config ) {
//						ajaxTranCall("push/selectPushListByUser.do", {}, callbackS, callBackE);
//	                }
//	            } 
	        ]
			
	    });
common.tableMappingAfterProcess();
		break;
		
	case "stat/selectMainDataForAdmin.do":

		var listDf = data["listDf"];
		var listTeamNameList = new Array();
		var listTeamNameList2 = new Array();
		var listTeamIdList = new Array();
		
		listTeamNameList.push("전체");
		
		listTeamIdList.push("all");
		
		var teamNameMap = {};
		
		var caseMap 	= {};
		var defectMap 	= {};
		var actionMap 	= {};
		var requiredMap 	= {};
		
		caseMap["all"] = 0;
		defectMap["all"] = 0;
		actionMap["all"] = 0;
		
		requiredMap["all"] = 0;
		
		
		for(var i=0; i<listDf.length; i++){
			
			var tempMap = listDf[i];
			if( teamNameMap[tempMap.team_id] == null){
				
				teamNameMap[tempMap.team_id] = tempMap.team_name;
				caseMap[tempMap.team_id] 	= Number(tempMap.case_cnt);
				defectMap[tempMap.team_id] 	= Number(tempMap.defect_cnt);
				actionMap[tempMap.team_id] 	= Number(tempMap.completed_cnt);
				
				requiredMap[tempMap.team_id] 	= Number(tempMap.required_cnt);
				
				listTeamNameList.push(tempMap.team_name);
				listTeamNameList2.push(tempMap.team_name);
				listTeamIdList.push(tempMap.team_id);
			}
			else{
				caseMap[tempMap.team_id] 	= Number(tempMap.case_cnt) + Number(caseMap[tempMap.team_id]);
				defectMap[tempMap.team_id] 	= Number(tempMap.defect_cnt) +  Number(defectMap[tempMap.team_id]);
				actionMap[tempMap.team_id] 	= Number(tempMap.completed_cnt) +  Number(actionMap[tempMap.team_id]);
				requiredMap[tempMap.team_id] 	= Number(tempMap.required_cnt) +  Number(requiredMap[tempMap.team_id]);
			}
			
			caseMap["all"] 	 =  Number(tempMap.case_cnt) + Number(caseMap["all"]);
			defectMap["all"] =  Number(tempMap.defect_cnt) +  Number(defectMap["all"]);
			actionMap["all"] = Number(tempMap.completed_cnt) +  Number(actionMap["all"]);
			requiredMap["all"] = Number(tempMap.required_cnt) +  Number(requiredMap["all"]);
		}	
		
		var listChart1 = new Array();
		var listChart2 = new Array();
		
		
		debugger;
		for(var i=0; i < listTeamNameList.length; i++){
			var id = listTeamIdList[i];
			listChart1.push( 
				(Number(actionMap[id])/Number(defectMap[id])*100).toFixed(2)
			);
			
			if(i>0){
				listChart2.push(Number(requiredMap[id]));
			}
		}
		
		
		var ctx = document.getElementById('adminChart1'); 
		var myChart = new Chart(ctx, 
			{ 
				type: 'bar', 
				data: { 
					labels: listTeamNameList, 
					datasets: [
						{ 
							label: '단위 %', 
							data: listChart1, 
							backgroundColor: [ 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)' ], 
							borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)' ],
	 						borderWidth: 1 
						}
					] 
				}, 
		options: { scales: { yAxes: [{ ticks: { 
			 min: 0,
        	max: 100,
        	stepSize: 10
		} }] } } });
		
		var ctx2 = document.getElementById('adminChart2'); 
		var myChart = new Chart(ctx2, 
			{ 
				type: 'bar', 
				data: { 
					labels: listTeamNameList2, 
					datasets: [
						{ 
							label: '건수', 
							data: listChart2,
							backgroundColor: [ 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)','rgba(255, 206, 86, 0.2)',  'rgba(153, 102, 255, 0.2)' ], 
							borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)',  'rgba(153, 102, 255, 1)' ],
	 						 
//							backgroundColor: [ 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)' ], 
//							borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)' ],
	 						borderWidth: 1 
						}
					] 
				}, 
		options: { scales: { yAxes: [{ ticks: { 
			 min: 0,
//        	stepSize: 10
		} }] } } });
		
		
		break;
	}
}

var callBackE = function(tran, data){
	 
}


