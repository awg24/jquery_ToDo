$(document).on("ready", start);

function start(e) {

	var list = [];
	var id = 0;

	$.get("https://tiny-pizza-server.herokuapp.com/collections/awg",function(data){
		data.reverse();
		if(data.length !== 0){
			for(var i = 0; i < data.length;i++){
				list.push(data[i]);
				list[i]["id"] = i;
				addTodo(list);
			}
			id = data.length;
				
		} else {
			id = 0;
		}
	},"json");

	var $inputBox = $("#todo-input");	
	var $todoButton = $("#add-todo-button");
	var $todoForm = $("#todo-form");
	var $list = $("#list");
	var $deleteCompleted = $("#delete-completed");
	var $deleteAll = $("#delete-all");
	var parsedList = [];
	var idArray = [];
	var toDoObject = {};

	$todoForm.on("submit", makeToDoObject);
	$list.on("click", addStrike);
	$deleteCompleted.on("click", deleteRecords);
	$deleteAll.on("click", deleteAll);

	function makeToDoObject(event){
		event.preventDefault();
		toDoObject.id = id;
		id++;
		toDoObject.toDo = $inputBox.val();
		$inputBox.val("");
		toDoObject.completed = false;
		toDoObject.deleted = false;
		$.post("https://tiny-pizza-server.herokuapp.com/collections/awg",toDoObject,"json");
		list.push(toDoObject);
		toDoObject = {};
		addTodo(list);
	}
	
	function addTodo(theList) {
		for(var i = 0; i < theList.length;i++){
			if(theList[i]["deleted"] !== true || theList[i]["deleted"] !== "true"){
				if(theList[i]["completed"] === true || theList[i]["completed"] === "true"){
					parsedList.push("<del>"+theList[i]["toDo"]+"</del>");
					idArray.push(theList[i]["id"]);
				} else {
					parsedList.push(theList[i]["toDo"]);
					idArray.push(theList[i]["id"]);
				}
			}
		}

		var listHtml = render(parsedList,idArray);
		parsedList = [];
		idArray = [];
		$list.html(listHtml);
		$inputBox.focus();
	}

	function render(todoList,ids) {
		var returnedArray = [];
		for(var i = 0; i < ids.length;i++){
			returnedArray.push("<li id="+ids[i]+">"+todoList[i]+"</li>");
		}
		return "<ul>"+returnedArray.join("")+"</ul>";
	}

	function addStrike(event){
		var $unorderedList = $(event.target);
		$unorderedList.css("text-decoration","line-through");
		list[event.target.id]["completed"] = true;
		var updatedList = [];

		$.get("https://tiny-pizza-server.herokuapp.com/collections/awg",function(data){
			data.reverse();

			for(var i = 0; i < data.length;i++){
				updatedList.push(data[i]);
			}

			$.ajax({url:"https://tiny-pizza-server.herokuapp.com/collections/awg/"+updatedList[event.target.id]["_id"], 
			type: "PUT", 
			data: {completed: true, deleted: true}
			});	
		},"json");
		
		$inputBox.focus();
	}

	function deleteRecords(){
		var deleteList = [];
		var markedForDeletion = 0;
		$.get("https://tiny-pizza-server.herokuapp.com/collections/awg",function(data){
			data.reverse();
			for(var k = 0; k < data.length; k++){
				if(data[k]["deleted"] === "true"){
					markedForDeletion++;
				}
			}
			for(var i = 0; i < data.length;i++){
				if(data.length !== data.length - markedForDeletion){
					if(data.length - markedForDeletion === 0){
						deleteAll();
					}
					deleteList.push(data[i]);
					if(deleteList[i]["deleted"] === "true"){
						$.ajax({url:"https://tiny-pizza-server.herokuapp.com/collections/awg/"+deleteList[i]["_id"], 
							type: "DELETE", 
							success: function(result) {
								for(var j = 0; j < deleteList.length; j++){
									list[j]["id"] = j;
								}
			     				deleteRecords();
			    			}
							});	
						} 
				} else {
					location.reload();
				}
			}
		},"json");
	}

	function deleteAll(){
		var deleteList = [];
		$.get("https://tiny-pizza-server.herokuapp.com/collections/awg",function(data){
			data.reverse();
			if(data.length !== 0){
				for(var i = 0; i < data.length;i++){
					deleteList.push(data[i]);
						$.ajax({url:"https://tiny-pizza-server.herokuapp.com/collections/awg/"+deleteList[i]["_id"], 
						type: "DELETE", 
						success: function(result) {
		     				deleteAll();
		    			}
						});	
				}
			} else {
				location.reload();
			}	
		},"json");
	}
	
}