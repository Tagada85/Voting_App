
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


function addCustomAnswer(){
	let id = getPollId();
	let customAnswer = $('#custom').val();
	if(!customAnswer){
		alert('You have to enter something to add this as an option.');
		return;
	}
	$.ajax({
		url: '/polls/' + id + '/addAnswer/' + customAnswer,
		type: 'PUT',
		success: function(){
			alert('New Answer added!');
			window.location.reload(false);
		}
	});
}

function getPollId(){
	let url = window.location.href;
	let splitUrl = url.split('/');
	let id = splitUrl.pop();
	return id;
}

$('#newAnswerForm').hide();
$("#newAnswer").click(function(){
	$('#newAnswerForm').toggle();
});

$('#voteBtn').click(function(){
	let id = getPollId();
	let vote = $('#voteOption').val().replace('/\s+/g,"_"');
	$.ajax({
		url: '/polls/' + id + '/' + vote,
		type: 'PUT',
		success: function(data){
			alert(data);
			window.location.reload(false);
		}
	});
});

let pollId = getPollId();
$.get('/polls/chart/' + pollId, function(data){
	

const ctx = $("#piechart");

const dataChart = {
	labels: [],
	datasets: [
	{
		data: [],
		backgroundColor: [
			"blue",
			"red",
			"yellow",
			"green",
			"pink",
			"orange",
			"brown"
		]
	}
	]
};


data.options.map((opt)=>{
	dataChart.labels.push(opt.text);
	dataChart.datasets[0].data.push(opt.votes);
});


const pieChart = new Chart(ctx, {
	type: 'doughnut',
	data: dataChart
})


});






