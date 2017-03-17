/**
 * 
 * 
 * 
 */
(function($) {
	var tableName;//表格ID名稱
	var rows = 10; //預設顯示比數
	var totalRows = 0; //總比數
	var selectChange = false; //是否改變頁數
	var totalSizeUrlString; //查詢總筆數WEBSERVICE
	var dataUrlString;//查詢資料WEBSERVICE
	var pageNum; //目前顯示頁數
	var dbPage; //DB頁數
	var pageCount=new Object();//顯示頁數選項
	var ajaxDateSizeParams = new Object();//查詢總比數參數
	var ajaxDataParams=new Object();//查詢資料參數
	var orderBy;//排序
	var columnData;//欄位資料
	var message;//訊息顯示欄位ID
	var subDiv;//明細panel
	var checkBox;//是否有checkBox
	var checkContainer=new Object();//checkBox儲存容器
	var subContainer=new Array();//明細容器
	var subColumns=new Object();//明細欄位
	var updateUrl;//更改資料AJAX URL
	var updateButton;//更改資料BUTTON
	var select=0;//選取筆數計算
	$.fn.jGridView = function(options) {
		var params = {
			tableName : $(this), //表格ID
			//ajaxDateSizeParams : [], //獲取資料大小ajax參數
			ajaxDataParams:[], //獲取資料ajax 參數
			totalSizeUrl : '', //獲取資料大小 ajax url
			dataUrl:'', //獲取資料ajax url
			updateUrl:'',//更改資料 ajax url
			updateButton:'',//更改資料BUTTON ID
			pageCount:[], //每頁顯示多少筆紀錄
			message:'',//顯示訊息div id
			subDiv:'',//明細 panel
			subTable:'',//明細TABLE
			checkBox:false,//是否有CHECKBOX
			columns:[{columnName:'',columnType:'',numFormat:false,sub:false}],//欄位(欄位名稱，class，是否數字格式，是有明細超連結)
			subColumns:[{subColumnName:'',subColumnType:'',subNumFormat:false}]//明細欄位(欄位名稱，class，是否數字格式)
		}
		// 將params結構複製options
		options = $.extend(params, options);
		if (!$('.pagination').length) {
			options.tableName
					.before('<table id="pageObj" style="width:90%"><tr><td><p class="text"></p>'
							+ '</td><td class="text-center"> <p class="pagination"  style="width: 90%"></p>'
							+ '</td></tr></table>'
							+'<div id="tableMessage"></div>');
			options.tableName
					.after('<table style="width:90%"><tr><td><p class="text"></p>'
							+ '</td><td class="text-center"> <p class="pagination"  style="width: 90%"></p>'
							+ '</td></tr></table>');
			 
		} 
		pageNum=options.ajaxDataParams.page;//目前頁數
		message=options.message;
		tableName=options.tableName.prop('id');
		subDiv=options.subDiv;
		ajaxDateSizeParams = options.ajaxDateSizeParams;
		ajaxDataParams=options.ajaxDataParams;
		totalSizeUrlString = options.totalSizeUrl;
		dataUrlString=options.dataUrl;
		orderBy=ajaxDataParams.orderBy;
		rows=ajaxDataParams.rows;
		pageCount=options.pageCount;
		pageTotal();
		columnData=options.columns;
		subColumns=options.subColumns;
		console.log(columnData);
		checkBox=options.checkBox;
		if(checkBox){
			if($('#'+tableName+' thead tr th:first').attr('data-type')!='check'){
			var th='<th data-type="check" class="col-check text-center" class="span1">'
				+'<input id="chkAll" name="msgID" value="" type="checkbox">'
				+'</th>'
				+$('#'+tableName+' thead tr').html();
			$('#'+tableName+' thead tr').empty();
			$('#'+tableName+' thead tr').append(th);
			}
		}
		order();
		if(options.updateUrl != '' && options.updateButton !=''){
			updateUrl=options.updateUrl;
			updateButton=options.updateButton;
			updateDate();
		}
		 
	};
	/** 計算總數* */
	function pageTotal() {
		$.ajax({
			url : totalSizeUrlString,
			type : 'POST',
			dataType : 'JSON',
			data : ajaxDataParams,
			success : function(data) {
				totalRows = parseInt(data);
				pageSize = Math.ceil(totalRows / rows);
				console.log('pageTotalSize-' + pageSize);
				pageObject(pageSize);
			}
		});
	}
	/**
	 * 設定頁數樣式
	 */
	function pageObject(pageSize) {
		var visibleSize;
		var visiblePage;
		// 回傳沒有值，PAGESIZE設定1否則會EXCEPTION
		if (pageSize == 0) {
			visibleSize = 1;
		} else {
			visibleSize = pageSize;
		}
		// 小於1只顯示page1,一到七中間顯示1~7,大於七也只顯示1~7
		if (visibleSize == 1) {
			visiblePage = 1;
		} else if (visibleSize > 1 && visibleSize < 7) {
			visiblePage = visibleSize;
		} else {
			visiblePage = 7;
		}
		//2017-01-25 當最後一頁更動顯示紀錄時，設定pageNum為visibleSize,才不會產生ERROR
		//並將selectChange設成false 避免沿用舊的總page 導致無資料產生
		if(pageNum>visibleSize){
			pageNum=visibleSize;
			selectChange=false;
		}
		// 頁數TOOL產生
		$('.pagination')
				.jqPaginator(
						{
							totalPages : visibleSize,
							visiblePages : visiblePage,
							currentPage : pageNum,
							first : '<li class="first"><a href="javascript:;">«</a></li>',
							last : '<li class="last"><a href="javascript:;">»</a></li>',
							prev : '<li class="prev"><a href="javascript:;">上一頁</a></li>',
							next : '<li class="next"><a href="javascript:;">下一頁</a></li>',
							page : '<li class="page"><a href="javascript:;">{{page}}</a></li>',

							onPageChange : function(num) {
								var endRow = num * rows;
								var firstRow = endRow - rows + 1;
								$('.text')
										.html(
												'<br><span class="fixed-table-pagination">顯示第 '
														+ firstRow
														+ ' 到第 '
														+ endRow
														+ ' 項記錄，總共 '
														+ totalRows
														+ ' 項記錄每頁顯示'
														+ '<select id="pageCount" name="pageCount" class="form-controlxx">'
														+ '</select>項記錄</span>');
								$('.form-contorlxx').empty();
								$.each(pageCount,function(key,d){
									$('.form-controlxx').append('<option>'+d+'</option>');
								})
								
								console.log('目前第--'+num);
								pageNum = num;
								//未更動顯示用目前顯示減1等於DB的PAGE
								if (!selectChange) {
									dbPage = num - 1;
								}
								selectChange = false;
								ajaxRequest(dbPage, orderBy);
								changePage();
								$('#chkAll').prop('checked', false);
							}
						});
	}
	// 抓取資料
	function ajaxRequest(page, orderBy) {
		var rowNum = 0;// 設定第一欄的筆數
		rowNum = page * rows;
		ajaxDataParams.page = page;
		ajaxDataParams.rows = rows;
		ajaxDataParams.orderBy = orderBy;
		$('#' + tableName + '  tbody').empty();
		$('#' + tableName + '  tbody').append('載入中');
		$.ajax({
			url : dataUrlString,
			type : 'POST',
			dataType : 'JSON',
			data : ajaxDataParams,
			success : function(data) {
				$('#' + tableName + '  tbody').empty();
				$.each(
					data,
					function(key, d) {
						subContainer[key]=d;
					var num = key + 1 + rowNum;
					
					var tr = $('<tr style="background-color: #f0f8ff;"></tr>');
					var check='';
					if(checkBox){
						check='<td align="center">'
						+'<input class="checkObject" id="check'+num+'" name="'+num+'" value="'+key+'" type="checkbox">'
						+'</td>'
					}
					var td = check+'<td align="text-right">'+ num + '</td>';
						$.each(columnData,function(id, column) {
								var tdType1;
								var aClass1;
								var context;
								// console.log('column:'+d[column.columnName]);
								// console.log('conlumn
								// Type:'+column.columnType);
								
								if (column.numFormat) {
									context = digits(d[column.columnName]);
								} else {
									context = d[column.columnName];
								}
								if (column.sub) {
									aClass1 = '<a href="#" class="containerClass" data-id="'+key+'" data-toggle="modal" data-target="#'
									+ subDiv
									+ '">'
									+ context
									+ '</a>';
								} else {
									aClass1 = context;
								}

								tdType1 = '<td align="'
										+ column.columnType
										+ '">'
										+ aClass1
										+ '</td>';

								td = td+ tdType1;
							});
							tr.html(td);
							$('#' + tableName + '  tbody').append(tr);

					});
						$('#' + message).html(
								'<button type="button" class="close" data-dismiss="alert">' 
										+ '<span aria-hidden="true">×</span></button>查詢成功共'+ totalRows+'筆資料');
						$('#'+message).attr('class','row alert alert-success alert-csc alert-dismissible');
						/**註解掉為了讓畫面和CASE一致
						 * $('#' + message).html(
								'<p class="text-success">查詢成功共' + totalRows
										+ '筆資料</p>');**/
						if (pageSize == 0) {
							var emptyMessage = '查無資料';
							$('#' + tableName + '  tbody').append(emptyMessage);
						}
						if(subDiv != ''){
						detailTable();
						}
						if(checkBox == true){
						checkBoxData();
						CheckBoxSelect();
						}
					},
					error : function() {
						$('#' + message).html(
								'<button type="button" class="close" data-dismiss="alert">' 
										+ '<span aria-hidden="true">×</span></button>查詢失敗');
						$('#'+message).attr('class','row alert alert-danger alert-csc alert-dismissible');
						/**註解掉為了讓畫面和CASE一致
						 * $('#' + message)
						.html('<p class="text-danger">查詢失敗</p>');**/
					}
				});
		$('.form-controlxx').val(rows);
		

	}
	//更改每頁顯示紀錄時
	function changePage(){
		$('.form-controlxx').change(function(){
			rows=$(this).val();
			selectChange=true;
			pageTotal();
		});
	}
	
	//排序
	function order(){
		 
		var thObject=$('#'+tableName+' .th');
		thObject.unbind();
		thObject.bind('click',function(){
			checkContainer.length=0;//清空CHECKBOX
			var current=$(this).find('i').attr('class');
			thObject.find('i').attr('class','fa fa-caret-down');
			if(current=='fa fa-caret-down'){ 
			$(this).find('i').attr('class','fa fa-caret-up');
			orderBy=$(this).attr('data-id')+'  ASC';
		     }else{
		    	 $(this).find('i').attr('class','fa fa-caret-down');
		    	 orderBy=$(this).attr('data-id')+'  DESC';
		     }
			 pageTotal();
			
		});
	}
	//detail table
	function detailTable(){
		console.log('subTableid--'+$('#'+subDiv+' table').prop('id'));
		
		$('#'+subDiv+' table   tbody').empty();
		$('.containerClass').click(function(){
			$('#'+subDiv+' table   tbody').empty();
			var id=$(this).attr('data-id');
			var container=subContainer[id];
			var th='';
			$.each(subColumns,function(key,column){
				console.log(subColumns[key]);
				if(subColumns[key].subNumFormat){
					 th=th+'<th class="'+subColumns[key].subColumnType+'">'+
					 digits(container[subColumns[key].subColumnName])+'</th>'
				}else{
					 th=th+'<th class="'+subColumns[key].subColumnType+'">'+
					 container[subColumns[key].subColumnName]+'</th>'
				}
				
			});
			$('#'+subDiv+' table   tbody').append(th); 
			
		});
		 
	}
	//checkBoxClick
	function checkBoxData(){
		
		$('#chkAll').click(function(){
			if($(this).is(':checked')){
				$('.checkObject').prop('checked', true);
			}else{
				$('.checkObject').prop('checked', false);
			}
			countCheckBox();
		});
		
		$('.checkObject').click(function(){
			
			countCheckBox();
		});
	}
	//塞入陣列並計算選取筆數
	function countCheckBox(){
		 var count=0;
		$('.checkObject').each(function(i,obj){
			
			if($(this).is(':checked')){
				checkContainer[$(obj).attr('name')]=subContainer[$(obj).attr('value')];
				 
			}else{
				delete checkContainer[$(obj).attr('name')];
				 
			}
			
		});
		//計算選取比數
		 $.each(checkContainer,function(key,data){
			console.log('checkContiner'+key);
			count=count+1;
		 });
		$('#tableMessage').html('<p>'+'共'+count+'被選取'+'<p>');
	}
	//檢查儲存CHECK 換頁時CHECK BOX能檢查CHECK 是否勾選並設定勾選
	function CheckBoxSelect(){
		$.each(checkContainer,function(key,d){
			//console.log('checkContiner'+key);
			$('#check'+key).attr('checked','checked');
		});
		
	}
	//dataUpdate
	function updateDate(){
		
		
		 
		$('#'+updateButton).click(function(){
			var i=0;
			var updateArray;
			var columnObject;
			updateArray=new Array();
			$.each(checkContainer,function(key,d){
				columnObject=new Object();
				 $.each(d,function(k,val){
					 columnObject[k]=val;
				 });
				 updateArray.push(columnObject);
				i=i+1;
			});
			$.ajax({
				url:updateUrl,
				type:'post',
				dataType:'JSON',
				contentType : "application/json;charset=UTF-8",
				data: JSON.stringify(updateArray),
				success:function(data){
					
				}
				
			});
			});
		
	}
	
	/**
	 * 數字格式3位數 digits
	 * @param num
	 * @returns
	 */
	function digits(num){
		return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}	
	
})(jQuery);
