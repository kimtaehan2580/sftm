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
</div>
	
	


<script src="js/lib/jquery-3.4.1.min.js" charset="utf-8"></script>


<% if(pagePath != "login") {%>
	<script src="js/lib/bootstrap.bundle.min.js" charset="utf-8"></script>
	<script src="js/lib/jquery.dataTables.min.js" charset="utf-8"></script>
	<script src="js/lib/dataTables.buttons.min.js" charset="utf-8"></script>
	<script src="js/lib/dataTables.select.min.js" charset="utf-8"></script>
	<script src="js/lib/jszip.min.js" charset="utf-8"></script>
	<script src="js/lib/buttons.html5.min.js" charset="utf-8"></script>
	<script src="js/util/io.js" charset="utf-8"></script>
	<script src="js/util/msg.js" charset="utf-8"></script>
<% } %>


<script src="js/util/window.js" charset="utf-8"></script>
<script src="js/util/common.js" charset="utf-8"></script>
<script src="js/<%=pagePath%>.js" charset="utf-8"></script>

<script type="text/javascript"> 
	
	
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
		ajaxTranCall("code/selectProjectList.do", {}, jspCallbackS, jspCallbackE);
		break;
		
	default:
		//$("#selectProject").hide();
		$("#selectProject").show();
		ajaxTranCall("code/selectProjectList.do", {}, jspCallbackS, jspCallbackE);
		break;
	}
	

	$("#navbarDropdown_name").text(getCookie('name') + " ("+getCookie('team_name') +")");
	
// 	//단위/통합테스트 리스트 조회
<%-- 	<% if(pagePath == "login") {%> --%>
// 		initDoucument();
<%-- 	<% } else if("scenario".equals(pagePath) ){%> --%>
// 		ajaxTranCall("code/selectProjectList.do", {}, jspCallbackS, jspCallbackE);
<%-- 	<% } else {%> --%>
// // 		ajaxTranCall("code/selectProjectList.do", {}, jspCallbackS, jspCallbackE);
<%-- 	<% } %> --%>
	
});

	

</script> 
</body>

</html>