<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<!DOCTYPE html>
<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<%
	 String pagePath = request.getParameter("path");
     if (pagePath == null) {
    	 pagePath = "login";
     }
     String htmlPath   = "html/" + pagePath + ".html";
%>

<% if(pagePath != "login") {%>
	<link href="css/jquery.dataTables.min.css" rel="stylesheet" />
	<link href="css/dataTables.bootstrap.min.css" rel="stylesheet" />
	<link href="css/buttons.dataTables.min.css" rel="stylesheet" />
<% } %>
	<link href="css/styles.css" rel="stylesheet" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>SK 테스트관리</title>
</head>
<body>

<div> 

	<% if(pagePath != "login") {%>
		<div style="height:50px; margin-bottom: 20px;">
			<jsp:include page='html/common/menu.html' ></jsp:include>
		</div>
	<% } %>
	
   <div class="container-fluid">		
   		<jsp:include page='<%=htmlPath%>'></jsp:include>
   </div>
   
   <input id="htmlName" style="display:none;" value='<%=pagePath%>'>
   <iframe id="fileDownObj" style="display:none; height:100%; "></iframe>
   <form id="frm" method="post" enctype="multipart/form-data"  style="display:none">
         <input type="file" id="file1" name="file1">
	</form>
	<div class="loader" id="loader" style=" display:none;"></div>
	
	<!-- EDMS 모달 공통 손대면 안됩니다. -->
	<div class="modal fade" id="modalImg">
		<div id="modelId" class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header bg-ntm">
					<h6 id="modalImgTitle" class="modal-title color-white">첨부파일 확인</h6>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-7">
							<table id="modalTableImg"  class="table table-bordered2" style="width:100%">
								<thead>
						            <tr>
						                <th >첨부파일 리스트</th>
						                <th></th>
						            </tr>
						        </thead>
							</table>
						</div>
						<div class="col-md-5">
							* 썸네일 이미지
							<div style="height:150px; weight:100%; border:1px solid; text-align: center;">
								<img id="selectedImg" style="height:inherit; vertical-align: middle;   max-width:100%; padding: 10px;"  src="">
							</div>
							<br/>
							* 파일 정보 
							<table id="userDetailImg" class="table table-bordered" style="width:100%">
					   			
						       <tbody>
					        	    <tr>
						       	 		<th colspan="4" style="width:30%">파일명</th>
						       	 		<td colspan="8" id ="selectedFileName"></td>
						       	  	</tr>
						       	  	<tr>
						       	 		<th colspan="4">등록자</th>
						       	 		<td colspan="8" id ="selectedName"></td>
						       	  	</tr>
						       	  	<tr>
						       	 		<th colspan="4">등록일시</th>
						       	 		<td colspan="8" id ="selectedDate"></td>
						       	  	</tr>
						       	  	<tr>
						       	 		<th colspan="4">파일크기</th>
						       	 		<td colspan="8" id ="selectedSize"></td>
						       	  	</tr>
					       	  	</tbody>
				       	  	</table>
							
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button id="btnImgDown" type="button" class="btn btn-dark"  >다운로드</button>
					<button type="button" class="btn btn-dark" data-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
	</div> <!-- EDMS 모달 -->
	
	<!-- EDMS 모달 공통 손대면 안됩니다. -->
	<div class="modal fade" id="modalRecord">
		<div id="modelId" class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header bg-ntm">
					<h6  class="modal-title color-white">테스트 화면 선택하기</h6>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<select class="form-control" id="modalRecordSelect" name="selectTeam" title="">
						</select>
						<input style="display:none;" id="modalRecord_user_id">
						<input style="display:none;" id="modalRecord_case_id">
						<input style="display:none;" id="modalRecord_defect_id">
						<input style="display:none;" id="modalRecord_test_name">
					</div>
				</div>
				<div class="modal-footer">
					<button id="btnGoTest" type="button" class="btn btn-dark" onclick="c_window.autoTestGo();">실행</button>
					<button type="button" class="btn btn-dark" data-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
	</div> <!-- EDMS 모달 -->
	
	
</div>
	
	


<script src="js/lib/jquery-3.4.1.min.js" charset="utf-8"></script>


<% if(!"login".equals(pagePath) ) {%>
	<script src="js/lib/bootstrap.bundle.min.js" charset="utf-8"></script>
	<script src="js/lib/jquery.dataTables.min.js" charset="utf-8"></script>
	<script src="js/lib/dataTables.buttons.min.js" charset="utf-8"></script>
	<script src="js/lib/dataTables.select.min.js" charset="utf-8"></script>
	<script src="js/lib/jszip.min.js" charset="utf-8"></script>
	<script src="js/lib/buttons.html5.min.js" charset="utf-8"></script>
	<script src="js/util/io.js" charset="utf-8"></script>
	<script src="js/util/msg.js" charset="utf-8"></script>
<% } %>

<% if("main".equals(pagePath) ) {%>
	<script src="js/lib/chart.js" charset="utf-8"></script>
<% } %>


<script src="js/util/window.js" charset="utf-8"></script>
<script src="js/util/common.js" charset="utf-8"></script>
<script src="js/<%=pagePath%>.js" charset="utf-8"></script>

<script type="text/javascript"> 
var modalTableImg;	
	
$(document).ready(function() { 
	
	
	var htmlName = $("#htmlName").val();
	
	switch(htmlName){
	
	case "login":
		initDoucument();
		break;
		
	case "scenario/scenario":
	case "defect/defect":
	case "defect/excute":
	case "main":

		$("#selectProject").show();
		ajaxTranCall("code/selectProjectList.do", {}, jspcallbackS, jspcallbackE);
		break;
		
	default:
		//$("#selectProject").hide();
		$("#selectProject").show();
		ajaxTranCall("code/selectProjectList.do", {}, jspcallbackS, jspcallbackE);
		break;
	}
	

	$("#navbarDropdown_name").text(getCookie('name') + " ("+getCookie('team_name') +")");
	
	$('#modalTableImg').on('click', function(){
		setTimeout(function() {
			$('#modalTableImg tr').each(function(){
				var isSeleceted = false;
				if($(this).hasClass('selected') ){
					var dataJson = modalTableImg.row($(this)).data(); 
					var ext = dataJson.ext.toLocaleLowerCase();
					$("#selectedImg").attr("src", getimgUrl(dataJson.originfilename, getFileUrl( dataJson.id, dataJson.seq)) );
					$("#selectedImg").attr("tag", getFileUrl( dataJson.id, dataJson.seq));
					$("#selectedFileName").text(dataJson.originfilename);
					$("#selectedName").text(dataJson.name);
					$("#selectedDate").text(dataJson.reg_date_str);
					
					var filesize = Number(dataJson.filelength);
					$("#selectedSize").text(bytesToSize(filesize));
					
					isSeleceted = true;
				}
			});
		}, 300);
	});
	
	$('#btnImgDown').on('click', function(){
		$("#fileDownObj").attr('src', $("#selectedImg").attr("tag") );
	});
	
});

history.pushState(null, null, location.href);
window.onpopstate = function () {
	if(location.href.indexOf("defect/excute") != -1 && $('#panal_detail').is(':visible')){
		$("#btnCancle").trigger("click");
	}
	else if(location.href.indexOf("defect/defect") != -1 && $('#panal_detail').is(':visible')){
		$("#btnCancle2").trigger("click");
	}
	else if(location.href.indexOf("border/border") != -1 && ( $('#panal_detail').is(':visible') || $('#panal_update').is(':visible') )){
		$("#btnPrePage").trigger("click");
	}
	else{
		history.back();
	}
    
};	

</script> 
</body>

</html>