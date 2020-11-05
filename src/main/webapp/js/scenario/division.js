/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

var tableA, tableB, tableC;
var modalType = "";
var teamUserModalTable;

var initDoucument = function(){
	
	
	searchDivListSetTable("A", {list:[]});
	searchDivListSetTable("B", {list:[]});
	searchDivListSetTable("C", {list:[]});
	
	
	serchDivList("A");
	ajaxTranCall("user/selectTeamList.do", {role_code:"DEV"}, callBackS, callBackE);
	
	//modalType
	//신규 저장버튼 click event
	$("#btnSave").click(function(e){
//		if(!modal.modalCheckInputData("teamTableModal")) return;
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		dataJson["team_id"] = $("#selectTeam").val(); 
		
		ajaxTranCall("scenario/insertDivision.do", dataJson, callBackS, callBackE);
	});
	
	
	//수정버튼 선택시
	$("#btnUpdate").click(function(e){
		var dataJson = modal.convertModalToJsonObj("teamTableModal" );
		dataJson["depth"] = modalType; 
		
		if(modalType == "A"){
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"] =  tableA.row($(this)).data().div_id;
				}
			});
		}
		
		else if(modalType == "B"){
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"] =  tableB.row($(this)).data().div_id;
				}
			});
		}
		
		
		else if(modalType == "C"){
			$('#tableC tr').each(function(){
				if($(this).hasClass('selected') ){
					dataJson["div_id"]  =  tableC.row($(this)).data().div_id;
					dataJson["team_id"] = $("#selectTeam").val(); 
				}
			});
		}
		
		ajaxTranCall("scenario/updateDivision.do", dataJson, callBackS, callBackE);
	});
	
	//서브시스템 Table click event
	$('#tableA').on('click', function(){
		setTimeout(function() {
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableA.row($(this)).data();
					$('#tableThB').text(dataJson.name);
					serchDivList("B", dataJson.div_id);
					searchDivListSetTable("C", {list:[]});
				}
			});
		}, 100);
	});
	$('#tableB').on('click', function(){
		setTimeout(function() {
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableB.row($(this)).data();
					$('#tableThC').text(dataJson.name);
					serchDivList("C", dataJson.div_id);
				}
			});
		}, 100);
	});
//	modalType
	
	$("#selectA").on('change', function(){
		if(modalType == "C"){
			ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode": $(this).val()}, callBackS, callBackE);
		}
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
	        
        ajaxFormExcel("excel/uploadExcelDivision.excel", "file1", callBackS);

	});
	
	 
}


var serchDivList = function(type, upcode, upupcode){
	
	var json = {
		"depth" : type
	}
	if(upupcode != null){
		json["upupcode"] = upupcode;
	}
	else if(upcode != null){
		json["upcode"] = upcode;
	}
	
	ajaxTranCall("scenario/searchDivList.do", json, callBackS, callBackE);
	
}

var callBackS = function(tran, data){
	
	switch(tran){
	
	case "user/selectTeamList.do":
		var list = data["list"];
		
		for(var i=0; i<list.length; i++){
			appendSelectBox2($("#selectTeam"), list[i].id, list[i].name + " ( PL : " + list[i].reader_name  + ")");
		}
		
		break;
		
	case "scenario/searchDivListWithCombo.do":
	
	
		if(data["resultCode"] == "0000" ){
			var detpth = data["depth"];
			var list = data["list"];
			debugger;
			if(detpth == "A"){
				htmlSelectBox("selectA", "", "선택해 주세요");
				for(var i=0; i<list.length; i++){
					appendSelectBox("selectA", list[i].div_id, list[i].name);
				}
					
				//수정인 경우 직접 선택되게 수정
				if($("#hearderTitle").text().indexOf("수정") != -1){
					
					if(modalType == "B"){
						$('#tableB tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableB.row($(this)).data();
								$('#selectA').val(dataJson.upcode);
							}
						});
					}
					else if(modalType == "C"){
						$('#tableC tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableC.row($(this)).data();
								$('#selectA').val(dataJson.upupcode);
								ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode":dataJson.upupcode}, callBackS, callBackE);
							}
						});
					}
				}
				else{
					if(modalType != "A"){
						$('#tableA tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableA.row($(this)).data();
								$('#selectA').val(dataJson.div_id);
								if(modalType == "C"){
									
									debugger;
									ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"B", "upcode":dataJson.div_id}, callBackS, callBackE);
								}
							}
						});
					}
				}
			}
			
			else if(detpth == "B"){
				htmlSelectBox("selectB", "", "선택해 주세요");
				for(var i=0; i<list.length; i++){
					appendSelectBox("selectB", list[i].div_id, list[i].name);
				}
				
				//수정인 경우 직접 선택되게 수정
				if($("#hearderTitle").text().indexOf("수정") != -1){
					$('#tableC tr').each(function(){
						if($(this).hasClass('selected') ){
							var dataJson = tableC.row($(this)).data();
							$('#selectB').val(dataJson.upcode);
							
							if($('#selectB').val()== null){
								$('#selectB').val("")  
							}
						}
					});
				}
				else{
					debugger;
					if(modalType == "C"){
						$('#tableB tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableB.row($(this)).data();
								$('#selectB').val(dataJson.div_id);
								
								if($('#selectB').val() == null){
									$('#selectB').val("");
								}
							}
						});
					}
				}
				
			}
			
			
			
		}
		break;

	case "scenario/insertDivision.do":
	case "scenario/updateDivision.do":
	case "scenario/deleteDivision.do":
		
		alert(data["message"]);
	
		if(data["resultCode"] == "0000" ){
			$('div.modal').modal("hide"); //닫기 
//			serchDivList("A");
//			searchDivListSetTable("B", {list:[]});
//			searchDivListSetTable("C", {list:[]});

			var detpth = data["depth"];
			
			if(detpth == "A"){
				serchDivList("A");
				searchDivListSetTable("B", {list:[]});
				searchDivListSetTable("C", {list:[]});
			}
			else if(detpth == "B"){
				$('#tableA tr').each(function(){
					if($(this).hasClass('selected') ){
						var dataJson = tableA.row($(this)).data();
						$('#tableThB').text(dataJson.name);
						serchDivList("B", dataJson.div_id);
						searchDivListSetTable("C", {list:[]});
					}
				});
			}
			else if(detpth == "C"){
				$('#tableB tr').each(function(){
					if($(this).hasClass('selected') ){
						var dataJson = tableB.row($(this)).data();
						$('#tableThC').text(dataJson.name);
						serchDivList("C", dataJson.div_id);
					}
				});
			}
		}
		
		break;
	
	case "scenario/searchDivList.do":
		var detpth = data["depth"];
		var list = data["list"];
		
		
		//한번에 설정하기 실패하였습니다.
		if(detpth == "A") tableA = searchDivListSetTable(detpth, list);
		if(detpth == "B") tableB = searchDivListSetTable(detpth, list);
		if(detpth == "C") tableC = searchDivListSetTable(detpth, list);
		
		
		
		break;
		
	//액셀 다운로드 Callback	
	case "excel/downloadDivExcel.do":
		
		if(data["filePath"] == ""){
			alert("파일 다운로드에 실패했습니다.");
			return;
		}
		else{
			
			var temp = getExcelFileUrl( data["filePath"]);
			$("#fileDownObj").attr('src',  temp);
		}
		
		break;
		
	//액셀 업로드 Callback
	case "excel/uploadExcelDivision.excel":
		
		var list = data["list"];
		$("#file1").val("");
		
		var msg = data["message"];
		alert(msg);
		if(list.length != 0){
			msg += "\n" + list.length+ "건은 실패된 데이터는 자동으로 액셀다운로드 진행됩니다.";
			
			var arrayJson = [];
			for(var i=0; i<list.length; i++){

				var tempJson = {
					"div_id": list[i].col0,
					"upup_name": list[i].col1,
					"up_name": list[i].col2,
					"name": list[i].col3,
					"team_name": list[i].col4,
					"result": list[i].result
				};
				
				arrayJson.push(tempJson);
			}
			
			ajaxTranCall("excel/downloadDivExcel.do", {"list":arrayJson} ,callBackS, callBackE);
		}
		alert(msg);
		
		
			serchDivList("A");
			searchDivListSetTable("B", {list:[]});
			searchDivListSetTable("C", {list:[]});
		
		
		break;
	}
	
}

var searchDivListSetTable = function ( detpth, list){
	
	
	for(var i=0 ; i< list.length; i++){
		
		if(detpth == "A"){
			list[i].name_all = list[i].name;
		}
		else if(detpth == "B"){
			list[i].name_all = list[i].up_name + " > " + list[i].name;
		}
		else if(detpth == "C"){
			list[i].name_all = list[i].upup_name + " > " + list[i].up_name + " > " + list[i].name;
		}
//		list[i].rnum = i+1;
//		var phone_num = list[i].phone_num;
	}
	var obj;
	
	if(detpth != "C"){
		obj =  $('#table'+ detpth).DataTable ({
			destroy: true,
	        "aaData" : list,
	        
	        "columns" : [
	            { "mDataProp" : 'name' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "className": "text-center" },
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			 pageLength:15, //기본 데이터건수
			"scrollY":        550,
	        "scrollCollapse": false,
	       
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '등록',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("1", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("2", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                	
	                	if(!confirm("삭제시에 하위뎁스에 데이터도 전부삭제 됩니다.")){
	                		return;
	                	}
	                	else if(detpth == "B"){
	                		$('#tableB tr').each(function(){
								if($(this).hasClass('selected') ){
									var dataJson = tableB.row($(this)).data();
									isSelected = true;
									ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "div_id":dataJson.div_id}, callBackS, callBackE);
								}
							});
	                	}
	                	else if(detpth == "A"){
	                		$('#tableA tr').each(function(){
								if($(this).hasClass('selected') ){
									var dataJson = tableA.row($(this)).data();
									isSelected = true;
									ajaxTranCall("scenario/deleteDivision.do", {"depth":"B", "div_id":dataJson.div_id}, callBackS, callBackE);
								}
							});
	                	}
	                	
	                	if(!isSelected){
	                		alert("삭제할 데이터를 선택해주세요.");
	                		
	                	}
	                }
	            },
	        ]
			
	    });

		
	}
	 
	else{
		obj =  $('#table'+ detpth).DataTable ({
			destroy: true,
	        "aaData" : list,
	        
	        "columns" : [
	            { "mDataProp" : 'name' } ,
	            { "mDataProp" : 'team_name' },
	            { "mDataProp" : 'reader_name' } 
	        ],
			'columnDefs': [
			    { "targets": 0, "width":"50%", "className": "text-center" },
			    { "targets": 1, "width":"25%", "className": "text-center" },
			    { "targets": 2, "width":"25%", "className": "text-center" },
			],
	        "language": {
		        "emptyTable": "데이터가 없어요." , "search": ""
		    },
		    
			lengthChange: false, 	// 표시 건수기능 숨기기
			searching: false,  		// 검색 기능 숨기기
			ordering: false,  		// 정렬 기능 숨기기
			info: false,			// 정보 표시 숨기기
			paging: true, 			// 페이징 기능 숨기기
			select: {
	            style: 'single' //single, multi
			},
			 pageLength:15, //기본 데이터건수
			"scrollY":        550,
	        "scrollCollapse": false,
	       
	        dom : 'Bfrtip',
	        buttons: [
	        	
	            {
	                text: '등록',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("1", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	modalOpen("2", detpth, e, dt, node, config )
	                }
	            },
	            {
	                text: '삭제',
	                className: 'btn btn-outline-secondary admin',
	                action: function ( e, dt, node, config ) {
	                	var isSelected = false;
	                	
	                	if(!confirm("삭제시에 하위뎁스에 데이터도 전부삭제 됩니다.")){
	                		return;
	                	}
                		$('#tableC tr').each(function(){
							if($(this).hasClass('selected') ){
								var dataJson = tableC.row($(this)).data();
								isSelected = true;
								ajaxTranCall("scenario/deleteDivision.do", {"depth":"C", "div_id":dataJson.div_id}, callBackS, callBackE);
							}
						});
                
	                	
	                	if(!isSelected){
	                		alert("삭제할 데이터를 선택해주세요.");
	                		
	                	}
	                }
	            },
				{
	                text: '다운로드',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	$('#file1').trigger('click');
		

	                }
	            },
				{
	                text: '업로드',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                	var dataJson;
						var isSelected = false;
						var jsonData = {"depth":"C"};
						$('#tableB tr').each(function(){
							if($(this).hasClass('selected') ){
								dataJson = tableB.row($(this)).data();
								isSelected = true;
							}
						});
						
						if(isSelected ){
							var isAll = confirm("전체 데이터를 다운로드 하시겠습니까?\n(확인 : 전체, 취소 : 선택건만)");
				        	if(!isAll){
								//
								jsonData.upcode = dataJson.div_id
							}
							
						}
				    	
						//ajaxTranCall("common/downloadUserExcel.do", {"list": list} ,calBackS, callBackE);
						ajaxTranCall("excel/downloadDivExcel.do", jsonData ,callBackS, callBackE);
	                }
	            }
	        ]
			
	    });

		
	}
	
	common.tableMappingAfterProcess();
	
	return obj;
}

var callBackE = function(tran, data){
	
}


var modalOpen = function( crType, divType, e, dt, node, config ) {

	$("#selectTeam").val("");
	$("#selectA").val("");
	$("#selectB").val("");
	$("#name").val("");
	
	var isSelected = false;
	modalType = divType;
	$('#name').val("");
	if(divType == "A"){
		$("#modalTrA").hide();
		$("#modalTrB").hide();
		$("#modalTrC").hide();
		
		
		$("#hearderTitle").text("서브시스템 등록");
		$("#thName").text("서브시스템 명");
		
		if(crType == "2"){
			$("#hearderTitle").text("서브시스템 수정");
			$('#tableA tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableA.row($(this)).data();
					$('#name').val(dataJson.name);
					isSelected = true;
				}
			});
		}
		$("#selectA").removeClass("required");
		$("#selectB").removeClass("required");
	}
	else if(divType == "B"){
		
		$("#modalTrA").show();
		$("#modalTrB").hide();
		$("#modalTrC").hide();
		
		 
		$("#hearderTitle").text("업무구분 등록");
		$("#thName").text("업무구분 명");
		
		//서브시스템 콘보 데이터 조회
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callBackS, callBackE);
		
		if(crType == "2"){
			
			$("#hearderTitle").text("업무구분 수정");
			$('#tableB tr').each(function(){
				if($(this).hasClass('selected') ){
					var dataJson = tableB.row($(this)).data();
					debugger;
//					$("#selectA").val(dataJson.upcode);
					$('#name').val(dataJson.name);
					isSelected = true;
				}
			});
		}
		$("#selectA").addClass("required");
		$("#selectB").removeClass("required");
		
	}
	else{

		
		$("#modalTrA").show();
		$("#modalTrB").show();
		$("#modalTrC").show();
		$("#hearderTitle").text("");
		$("#hearderTitle").text("대상업무 등록");
		$("#thName").text("대상업무 명");
		
		ajaxTranCall("scenario/searchDivListWithCombo.do", {"depth":"A"}, callBackS, callBackE);
		
		$('#tableC tr').each(function(){
			if($(this).hasClass('selected') ){
				var dataJson = tableC.row($(this)).data();
				$('#name').val(dataJson.name);
				$("#selectTeam").val(dataJson.team_id);
				
				isSelected = true;
			}
		});
		$("#selectA").addClass("required");
		$("#selectB").addClass("required");
		
		if(crType == "2") $("#hearderTitle").text("대상업무 수정");
	}
	

	if(crType == "1"){
		$('#btnSave').show();
		$('#btnUpdate').hide();
	}
	else{
		
		if(!isSelected){
			alert("수정할 데이터를 선택해주세요.");
			return;
		}
		$('#btnSave').hide();
		$('#btnUpdate').show();
	}
	
	$('div.modal').modal();
	
}