package com.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.opensymphony.xwork2.ActionSupport;

public class ProductListRest extends ActionSupport {
	private List<HashMap<String,String>> forViewProduct;
	private List<HashMap<String,String>> product;
	private int rows;
	private int page;
	private HashMap<String,String> data;
	private int size;
	 public ProductListRest() {
		// TODO Auto-generated constructor stub
		 product=new ArrayList<HashMap<String,String>>();
		 
	}
	 public void setSize(int size){
		 this.size=size;
	 }
	public void setTest(String test){
		 System.out.println(test);
	 }
	public void setRows(int row){
		this.rows=row;
	}
	public void setPage(int page){
		this.page=page;
	}
	@Override
	public String execute() throws Exception {
		// TODO Auto-generated method stub
		 product.clear();
		 
		for(int i=0;i<20;i++){
			data=new HashMap<String,String>();
			data.put("test1","value"+String.valueOf(i));
			data.put("test2","value"+String.valueOf(i));
			data.put("test3","value"+String.valueOf(i));
			data.put("test4","value"+String.valueOf(i));
			data.put("test5","value"+String.valueOf(i));
			product.add(data);
		}
		return super.execute();
	}
	 
	public List<HashMap<String,String>> getProduct(){
		forViewProduct=new ArrayList<HashMap<String,String>>();
		int start=this.page*this.rows;
		int end=start+this.rows;
		for(int i=start;i<end;i++){
			forViewProduct.add(product.get(i));
		}
		return forViewProduct;
	}
	 public int getSize(){
		return product.size();
	} 
	 
	
}
