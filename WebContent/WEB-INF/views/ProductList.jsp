<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<link href="resource/css/bootstrap.css" rel="stylesheet" type="text/css"></link>
<link href="resource/css/jquery-ui.css" rel="stylesheet" type="text/css"></link>
<link href="resource/css/font-awesome.min.css" rel="stylesheet" type="text/css"></link>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">
var CONTEXT_PATH='${pageContext.request.contextPath}';
</script>


<script type="text/javascript" src="resource/js/jquery.js"></script>
<script type="text/javascript" src="resource/js/jquery-ui.js"></script>
<script type="text/javascript" src="resource/js/bootstrap.min.js"></script>
<script type="text/javascript" src="resource/js/jqPaginator.js"></script>
<script type="text/javascript" src="resource/js/jGridView.js"></script>
<script type="text/javascript" src="resource/js/productList.js"></script>

<title>Insert title here</title>
</head>
<body>
<div class="container" style="margin:0px auto;width:900px;height:100px;"> 
<table id="dataTable" class="table table-bordered">
   
 <thead>
 <tr>
   <!-- 當呼叫AJAX SQL COMMAND ORDER BY 在data-id 填入-->
   <th>NO.</th>
   <th><a href="#" class="th" data-id=''>TEST1<i class="fa fa-caret-down" aria-hidden="true"></i></a></th>
   <th>TEST2</th>
   <th>TEST3</th>
   <th>TEST4</th>
   <th>TEST5</th>
   </tr>
 </thead>
   <!-- 內容固定ID為TBODY -->
   <tbody id="tbody">
</table>
Absolute Path is:<%=request.getContextPath()%>
<s:set  var="CONTEXT"  value="#request.get('javax.servlet.forward.context_path')" />
<br/><s:property value="%{CONTEXT}" /> 
</div>
 
</body>
</html>
