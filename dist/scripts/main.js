$(document).on("ready", start);

function start(e) {

	var $inputBox = $("#todo-input");	
	var $todoButton = $("#add-todo-button");
	var $todoForm = $("#todo-form");
	var $list = $("#list");
	var list = [];
	var parsedList = [];
	var idArray = [];
	var id = 0;
	var toDoObject = {};

	$todoForm.on("submit", makeToDoObject);
	$list.on("click", addStrike);

	function makeToDoObject(event){
		event.preventDefault();
		toDoObject.id = id;
		id++;
		toDoObject.toDo = $inputBox.val();
		$inputBox.val("");
		toDoObject.completed = false;
		toDoObject.deleted = false;
		list.push(toDoObject);
		toDoObject = {};
		addTodo(list);
	}
	
	function addTodo(theList) {
		console.log(list);
		for(var i = 0; i < theList.length;i++){
			if(theList[i]["deleted"] !== true){
				if(theList[i]["completed"] === true){
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
		$inputBox.focus();
	}
	
}