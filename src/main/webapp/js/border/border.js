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
	
	ajaxTranCall("code/selectCodeList.do", {"code_group":"D001"}, callbackS, callbackE);
	ajaxTranCall("user/selectTeamList.do", {}, callbackS, callbackE, false);
	
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
			$("#panal_update").hide();
			$("#panal_list").show();
			
			ajax_selectBorderList();
			
			break;
			
		//'첨부파일' button (상세)
		case "btnAddFile":
			$("#modalImg").modal();
			break;
			
		//'저장' button (수정)
		case "btnSave":
		
			var fileList = $("#fileMain").prop('files');
			//첨부파일 없는 경우 바로 저장
			if(fileList.length < 1){
				ajax_updateBorder($("#imgkey").val());
			}
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
				
				g_tbname = "itm_border";
				data.append("tbname", "itm_defect");
				data.append("user_id", getCookie("user_id"));
				data.append("imgkey", $("#imgkey").val());
				if($("#imgkey").val() == null || $("#imgkey").val() == -1){
					data.append("crud", "I");
				}
				else{
					data.append("crud", "U");
				}
				
				ajaxTranCallWithFile ("common/uploadFile.file", data,  callbackS, callbackE);
				
			}
		
			break;
			
		//'취소' button (수정)
		case "btnCancle":
			$("#panal_detail").hide();
			$("#panal_update").hide();
			$("#panal_list").show();
			
			ajax_selectBorderList();
			
			break;
			
		//'담당자 변경' button 
		case "btnMgUpdate":
			$('#modalUser').modal();
			break;
			
		
		//담당자변경 팝업 > '저장' button 	
		case "btnModalSave":
		
			if($("#selectModalUser").val() == ""){
				alert("선택된 담당자가 없습니다.");
				$("#selectModalUser").focus();
				return;
			}
			$("#manager_user").val($("#selectModalUser").val());
			$("#manager_user_name").val($("#selectModalUser option:selected").text());
			$('#modalUser').modal('hide');
			
			break;
		}
		
	}); //button event
	
	//border list table double click event handler
	$('#borderTable tbody').on('dblclick', 'tr', function () {
	    var data = borderTable.row( this ).data();
		
		//상세조회 선택
		ajax_selectBorderDetail(data.id);
	});
	
	

	
	
	
	//첨부파일 리스트 변경시 호출됩니다.
	//fileMain -> 테스트케이스 파일 첨부
	$('#fileMain').on('change', function(e){
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		$("#NewMainImgs").html("");
		
		filesArr.forEach(function(f){
		
			var htmlStr = '<img id="NewMainImgs'+f.lastModified+'" style="height:80px; padding:5px; max-width:100px;"/>';
			$("#NewMainImgs").append(htmlStr);
			var reader = new FileReader();
			reader.onload = function(e){
				var fs = f.name.split(".");
				console.log(fs);
				$("#NewMainImgs"+f.lastModified).attr("src", getimgUrl(f.name, e.target.result));
			}
			reader.readAsDataURL(f);
		});
		
	});
	
	//개발자변경 팝업 > 프로젝트팀 select 변경시 호출 됩니다.
	$('#selectModalTeam').on('change', function(e){
		var json = {
			team_id : $("#selectModalTeam").val()		
		};
		ajaxTranCall("user/selectUserList.do", json, callbackS, callbackE);
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
	case "user/selectTeamList.do":
	
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectModalTeam"), list[i].id, list[i].name); //개발자 변경시 사용되는 팝업에서 사용
		}
		break;
		
	//사용자 정보 전체 조회
	case "user/selectUserList.do":
		$("#selectModalUser").html("");
		appendSelectBox2( $("#selectModalUser"), "", "선택"); //개발자 변경시 사용되는 팝업에서 사용
		var list = data["list"]; 
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectModalUser"), list[i].user_id, list[i].name + " (" +list[i].user_id+ ")");
		}
		
		 $("#selectModalUser").val("");
		
		break;
		
	//코드 조회
	case "code/selectCodeList.do":
		
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			appendSelectBox2( $("#selectType"), list[i].code_id, list[i].code_name);
			appendSelectBox2( $("#type_code"), list[i].code_id, list[i].code_name);
		}
		

		if(getUrlParams().type_code != null ){
			$("#selectType").val(getUrlParams().type_code);
		}
		if(getUrlParams().border_id != null ){ 
			ajax_selectBorderDetail(Number(getUrlParams().border_id));
		}
		ajax_selectBorderList();
		break;
		
	
	//border/selectBorderList.do -> 게시판 글 리스트 조회
	case "border/selectBorderList.do":
	
		var list = data["list"];
		for(var i=0; i<list.length; i++){
			if(list[i].imgkey != null && list[i].imgkey > -1){
				list[i].img = "O";
			}else{
				list[i].img = "X";
			}
		}
		
		borderTable = $('#borderTable').DataTable ({
			destroy: true,
	        "aaData" : list,
	        "columns" : [
	            { "mDataProp" : 'type_name' },
	            { "mDataProp" : 'title' },
	            { "mDataProp" : 'img' },
	            { "mDataProp" : 'manager_user_name' } ,
	            { "mDataProp" : 'reg_user_name' } ,
	            { "mDataProp" : 'reg_date' }   
	        ],
			'columnDefs': [
			    { "targets": 0, "width": "15%", "className": "text-center" },
			    { "targets": 1, "width": "30%"},
			    { "targets": 2, "width": "10%", "className": "text-center" },
			    { "targets": 3, "width": "15%", "className": "text-center" },
			    { "targets": 4, "width": "15%", "className": "text-center" },
			    { "targets": 5, "width": "15%", "className": "text-center" }
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
						
						//1. 초기화
//						modal.modalClear("borderUpdateTable");
		 				
		 				
						$("#title").val("");
						$("#border_id").val("");
						$("#manager_user").val("");
						$("#msg").val("");
						
		 				
						$("#fileMain").val("");
						$("#existingMainImgs").html("");
						$("#NewMainImgs").html("");
						
						$("#imgkey").val("-1");
						$("#trExistingMainImgs").hide();
						
						$("#type_code").val("D001_01");
//						$('input:radio[name="radio_push"]').filter('[value="not"]').attr('checked', true);

						//김태한(kpayins081)
						$("#manager_user_name").val(getCookie("name") + "("+getCookie("user_id")+")");
						$("#manager_user").val(getCookie("user_id"));
						
						
						//2. 화면수정
						$("#panal_detail").hide();
						$("#panal_update").show();
						$("#panal_list").hide();
			
	                }
	            },
				{
	                text: '수정',
	                className: 'btn btn-outline-secondary all',
	                action: function ( e, dt, node, config ) {
	                
	                	var isSelected = false;
	                    $('#borderTable tr').each(function(){
		           			 if ( $(this).hasClass('selected') ){ 
		           			 
//		           			 	borderTable.row($(this)).data().user_id
								
								$("#fileMain").val("");
								$("#existingMainImgs").html("");
								$("#NewMainImgs").html("");
								
								
								$("#imgkey").val(borderTable.row($(this)).data().imgkey);
								$("#trExistingMainImgs").show();
								
								$('input:radio[name="radio_push"]').filter('[value="not"]').attr('checked', true);
				 
								$("#panal_detail").hide();
								$("#panal_update").show();
								$("#panal_list").hide();
		           				isSelected = true;
		           				
								ajaxTranCall("border/selectBorderDetail.do", {"id":borderTable.row($(this)).data().id}, function(tran, data){
									
									modal.convertJsonObjToModal("borderUpdateTable", data);
									
									$("#border_id").val(data["id"]);
									var imgList = data["imgList"];
									setEdmsModal( imgList, $("#existingMainImgs") );
								}
								, callbackE);
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
	
	//border/selectBorderDetail.do -> 게시판 글 상세 조회
	case "border/selectBorderDetail.do":	

		data.manager = data.manager_user_name +" ("+data.manager_user+")";
		modal.convertJsonObjToModal("borderDetailTable", data);
		
		var imgList = data["imgList"];
		$("#btnAddFile").text("첨부파일 ("+ imgList.length +")");
		setEdmsModal( imgList, $("#d_existingMainImgs") );
		
		$("#imgkey").val(data.imgkey);
		
		$("#panal_detail").show();
		$("#panal_list").hide();
		$("#panal_update").hide();
		
		return;
	
	//"common/uploadFile.file" -> 이미지 등록 
	case "common/uploadFile.file":
	
		ajax_updateBorder(data.imgkey);
		break;
	
	//"border/insertBorder.do"
	case "border/insertBorder.do":
	case "border/updateBorder.do":
		
		alert(data["message"]);
		ajax_selectBorderDetail(data.id);
	
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

/**
 * ajax_updateBorder -> 게시판 글 등록
 * @param {}
 * @returns {} 
 */
var ajax_updateBorder = function(_imgkey){
	
	if(!modal.modalCheckInputData("borderUpdateTable")) return false;
	
	//table 내용 
	var jsonObj = modal.convertModalToJsonObj("borderUpdateTable");
	jsonObj.imgkey = _imgkey; //imgkey
	jsonObj.push_receive = $("input[name=radio_push]:checked").val();
	
	if( $("#border_id").val() == null ||  $("#border_id").val() == ""){
		ajaxTranCall("border/insertBorder.do", jsonObj, callbackS, callbackE);
	}
	else{
		ajaxTranCall("border/updateBorder.do", jsonObj, callbackS, callbackE);
	}
	
}
