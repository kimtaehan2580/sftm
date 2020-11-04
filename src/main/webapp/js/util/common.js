/**
 * @author  Barack Obama
 * @version 1.0
 * @see     js 
 */

function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}



function appendSelectBox(obj, key, value){
	$('#' +obj).append("<option value='"+key+"'>"+value+"</option>" );
}
function appendSelectBox2(obj, key, value){
	obj.append("<option value='"+key+"'>"+value+"</option>" );
}
function htmlSelectBox(obj, key, value){
	$('#' +obj).html("<option value='"+key+"'>"+value+"</option>" );
}
function htmlSelectBox2(obj, key, value){
	obj.html("<option value='"+key+"'>"+value+"</option>" );
}

var table = {};
table.getSelectedRowData = function(obj){
	
}


function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var modal = {};

/*
 * 필수값 체크 로직입니다.
 * 테이블명 입력하시면 됩니다. 
 * 필수값 class required 추가 하시고
 */
modal.modalCheckInputData = function(obj){
	
	var result = true;
	$("#"+obj+" tbody tr td").each(function(){
		var element =  $(this).children().first();
		var type = element.prop('nodeName');
		
		var isRequired = element.hasClass("required");
	    if(isRequired){
			var value = element.val();
			if(value == ""){
				alert("필수 입력값을 입력해주세요.");
				element.focus();
				result = false;
				return false;
			}
		}
	});
	
	return result;
}

modal.modalClear = function(obj){
	$('#' +obj +' input').each(function(){
		$(this).val("");
	});
	$('#' +obj +' select').each(function(){
		$(this).val("");
	});
}

modal.convertModalToJsonObj= function(obj){
	
	var resultJson = {};
	$('#' +obj +' input').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	$('#' +obj +' select').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	$('#' +obj +' textarea').each(function(){
		resultJson[$(this).attr('id')] = $(this).val();
	});
	return resultJson;
}


modal.convertJsonObjToModal = function(obj, jsonObj){
	
	$('#' +obj +' input').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
	$('#' +obj +' select').each(function(){
		if(jsonObj[$(this).attr('id')] != null)
			$(this).val(jsonObj[$(this).attr('id')]);
	});
	$('#' +obj +' textarea').each(function(){
		$(this).val(jsonObj[$(this).attr('id')]);
	});
	
	
	$('#' +obj +' td').each(function(){
		$(this).text(jsonObj[$(this).attr('id')]);
	});
}


function getCookie(cookie_name) {
	var x, y;
	var val = document.cookie.split(';');

	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
		if (x == cookie_name) {
			return unescape(y); // unescape로 디코딩 후 값 리턴
		}
	}
}

function setCookie(cookie_name, value, days) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + days);
	// 설정 일수만큼 현재시간에 만료값으로 지정

	var cookie_value = escape(value)
			+ ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
	document.cookie = cookie_name + '=' + cookie_value;
}

function getExcelFileUrl(fileName){
	return location.protocol + "//" + location.host + "/ntm/common/uploadFile.exceldown?fileName=" + fileName;
}


function getFileUrl(id, seq){
	
	return location.protocol + "//" + location.host + "/ntm/common/uploadFile.filedown?imgkey=" + id + "&seq=" + seq;
}

/*
 * phoneFomatter('01000000000');   //010-0000-0000
 * phoneFomatter('01000000000',0); //010-****-0000
 * phoneFomatter('0100000000');    //010-000-0000
 */
function phoneFomatter(num,type){

    var formatNum = '';
    
    try{
	    if(num.length==11){
	        if(type==0){
	            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
	        }else{
	            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
	        }
	    }else if(num.length==8){
	        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
	    }else{
	        if(num.indexOf('02')==0){
	            if(type==0){
	                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
	            }else{
	                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
	            }
	        }else{
	
	            if(type==0){
	                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
	            }else{
	                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
	            }
	        }
	    }
    }catch(e){
    	
    }
    return formatNum;

}

//이미지 섬네일 관련 URL 다운로드 
//Img (png, jpg) 는 자체 URl 그대로 
//나머지는 샘플이미지로 대체 합니다.
function getimgUrl(fileName, fileObj){
	
	//확장자를 추출해서 사용 필요합니다. 
	var ext = "";
	if(fileName.lastIndexOf(".") > 0){
	 	ext = fileName.substring(fileName.lastIndexOf(".")+1);
	}
	ext = ext.toLocaleLowerCase();
	
	var result = "";
	
	switch(ext){
		
		case "xls":
			result = "img/thumbnail/xlsx.png";
			break;
//		case "png":
//		case "jpg":
//			result = fileObj;
			break;
		case "xlsx":
		case "docx":
		case "html":
		case "m4a":
		case "mp3":
		case "mp4":
		case "pdf":
		case "pptx":
		case "txt":
		case "zip":
			result = "img/thumbnail/"+ext+".png";
			break;
			
		default:
			result = "img/thumbnail/etc.png";
			break;
			
	}
	
	
	return result;
	
//	if(ext == "xls"){
//		return "img/thumbnail/xlsx.png";
//	}
//	else{
//		return fileObj;
//	}
	
}

var common = {}; 
common.isAdmin = function(){
	
	if(getCookie("role_code") == "ADMIN"){
		return true;
	}
	else return false;
}
common.tableMappingAfterProcess = function(){
	
	$('.dt-button').attr("type", "button");
	$('.dt-button').removeClass('dt-button');
	
	var role_code =  getCookie("role_code");
	
	
	if(role_code != "ADMIN"){
		$('.admin').hide();
		
		if(role_code != "TEST"){
			$('.test').hide();
		}
		
		if(role_code != "DEV"){
			$('.dev').hide();
		}
	}
	$("input[type=search]").css( "border", "none" );
	$("input[type=search]").css( "border-bottom", "1px solid" );
	$("input[type=search]").attr("placeholder", "검색어를 입력하세요");
//	type="search"
//	.val();
//	    border: none;
//    border-bottom: 1px solid;
	
	
	
	
}