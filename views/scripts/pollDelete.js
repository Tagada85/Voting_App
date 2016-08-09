function getPollId(){
	let url = window.location.href;
	let splitUrl = url.split('/');
	let id = splitUrl.pop();
	return id;
}


function deletePoll(){
	let id = getPollId();
	$.ajax({
		url:'/polls/' + id,
		type: 'DELETE',
		success: function(){
			alert('Poll Deleted!');
			window.location.replace('/polls/')
		}
	});
}

