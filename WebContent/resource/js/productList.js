/**
 * 
 */

$(document).ready(function(){
	query();
	
})

function query(){
	$('#dataTable').jGridView({
		ajaxDataParams : {//回傳資料參數
			test:'test2',
				rows:10,//預設筆數
				page:1 //預設頁數
		},
	totalSizeUrl:CONTEXT_PATH+'/productListSizeRest',
	dataUrl:CONTEXT_PATH+'/productListRest',
	pageCount : [ 10, 20, 100 ],//每頁顯示 SELECT
	//subDiv:'myModal',//明細DIV PANEL ID
	columns : [ { //主要欄位名稱 ，CLASS 樣式，是否數字格式，是否有明細超連結
		columnName : 'test1',
		columnType : 'center'
	}, {
		columnName : 'test2',
		columnType : 'center',
		sub:true
	}, {
		columnName : 'test5',
		columnType : 'right',
		numFormat : true
	} , {
		columnName : 'test4',
		columnType : 'center'
	}, {
		columnName : 'test3',
		columnType : 'center'
	}  ],
	
	/**subColumns:[{subColumnName:'lcNo',subColumnType:'text-center'},
	            {subColumnName:'amount',subColumnType:'text-center',subNumFormat:true},
	            {subColumnName:'buyerCid',subColumnType:'text-center'},
	            {subColumnName:'issuingBank',subColumnType:'text-center'},
	            {subColumnName:'notifyingBank',subColumnType:'text-center'},
	            {subColumnName:'advisingBank',subColumnType:'text-center'},
	            {subColumnName:'shipmentNoAfter',subColumnType:'text-center'},
	            {subColumnName:'availTerm',subColumnType:'text-center'}]**/
	});
}