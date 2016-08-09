function createNewPoll(){	
	var title = $("#title").val();
	var options = $("#options").val();
	if(!title || !options){
		alert('You need to specify a title and at least an option');
		return;
	}
	let newPoll = {question: title, options: options};
	//post request to create new poll
	$.post('/polls/new_poll',newPoll, function(data){
		alert("Poll created");
		window.location.replace('/polls/');
	}).fail(function(jqXHR, textStatus, error){
		alert('error');
	}, 'json');
}