/*prints game schedule to screen*/
function printSchedule(){
	$.ajax({
	  	url: 'backliftapp/sched',
  		type: "GET",
	  	dataType: "json",
 		success: function (data) {

	    	for(var i=0;i<data.length;i++) {
				$('#game').append('<p>' + data[i].player1Name + ' vs ' + data[i].player2Name + '</p>');
		      	$('#score').append('<p>' + data[i].player1Score + '-' + data[i].player2Score + '</p>'); 
				$('#report').append("<button id='"+data[i].id+"' class='report-scores'>" + "Report scores" + "</button>");      
			}   
	  	}	 // end function
	}); // end ajax

}

/*
function writeToDatabase(dest,stuff,func){
	$.ajax({
      url: dest,
      type: "POST",
      dataType: "json",
      data: stuff,
      success: function (data) {              
  	     func()             
      }
	});	// end ajax
}
*/


function createSchedule(printSchedule){
	/*var game={
		player1:{},
		player2:{},
		player1Score:0,
		player2Score:0		 
	};*/
	var teamSched=[ [ [],[] ], [ [],[] ], [ [],[] ] ];
	
	
	/*puts the teams in an array corresponding to the pre-defined schedule */

	$.ajax({
	  url: 'backliftapp/teams',
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	    var sched4 = [ [ [1, 4], [2, 3] ], [ [1, 3], [2, 4] ], [ [1, 2], [3, 4] ] ];
	    var game={};
		for(var i=0;i<data.length;i++) {
			for(var w=0;w<3;w++){
				for(var g=0;g<2;g++){
					for(var t=0;t<2;t++){
						if(sched4[w][g][t]===(i+1)){
							teamSched[w][g][t]=data[i];
						}
					}
				}

			}
			
		}
	  	for(var w=0;w<3;w++){
			for(var g=0;g<2;g++){
		
				game={
				player1Name:teamSched[w][g][0].name,
				player2Name:teamSched[w][g][1].name,
				player1ID:teamSched[w][g][0].id,
				player2ID:teamSched[w][g][1].id,
				player1Score:0,
				player2Score:0
				};	
				populateSchedule(game);

			}
		}
		printSchedule();

	   } //end success
	}); // end ajax	
}  
	 

/*creates team object*/
function createTeam(){
            
	var team = {
	name: $("#teamName").val(),   
	sponsor: $("#sponsor").val(),
	mgrFirst: $("#mgrFirst").val(),
	mgrLast: $("#mgrLast").val(),
	mgrPhone: $("#mgrPhone").val(),
	mgrZip: $("#mgrZip").val(),
	mgrEmail: $("#mgrEmail").val(),
	wins: 0,
	losses: 0            
	};
	          
	return team;
}

/*deletes the game schedule from the database (used during testing)*/
function deleteSeason(){
	$.ajax({
  		url: 'backliftapp/sched',
  		type: "GET",
	  	dataType: "json",
      	success: function (data) {  
      		for(var i=0;i<data.length;i++){
      			$.ajax({
		      		url: 'backliftapp/sched/' + data[i].id,
			        type: "DELETE",
			        dataType: "json",
			        success: function (data) {  
	      			}
	    		}); //end ajax
      		}
      	}
    }); //end ajax
}

function deleteTeam(selected){
	  var id=$(selected).attr('id');
	  // alert(id);
	  var dest='backliftapp/teams/'+ id; 

  	$.ajax({
      	url: dest,
      	type: "DELETE",
      	dataType: "json",
  		success: function (data) {  
	        // alert('Team deleted');            
	        updateTable();
      	}
    }); //end ajax
}

/*helper function to write team data to the screen */

function populateTable(team){    
	var percent=team.wins / (Number(team.wins) + Number(team.losses));
	if(isNaN(percent)){
    	percent=0;
    }
    $('#name').append('<p class="span5 Pop1 alpha" data-trigger="hover" data-toggle="tooltip" title="Team Name:'+ team.name +'                '+'Team Sponsor:'+ team.sponsor +'                  '+'Mgr.:'+ team.mgrFirst +' ' + team.mgrLast +'            '+' Mgr. Email:'+ team.mgrEmail+'" title="Team Data">' + team.name + '</p>');
    $('#wins').append('<p>' + team.wins + '</p>');
    $('#losses').append('<p>' + team.losses + '</p>');
	$('#percent').append('<p>' + percent.toFixed(3) + '</p>');	 
    $('#delete').append("<button id='"+team.id+"' class='delete-team'>" + "Delete team" + "</button>");  
}


function populateSchedule(game){
	// alert('pS called');
//	var game={};
//    for(var w=0;w<3;w++){
//		for(var g=0;g<2;g++){
		
			
/*			game={
			player1Name:sched[w][g][0].name,
			player2Name:sched[w][g][1].name,
			player1ID:sched[w][g][0].id,
			player2ID:sched[w][g][1].id,
			player1Score:0,
			player2Score:0
			};	
*/
			$.ajax({
		      url: 'backliftapp/sched',
		      type: "POST",
		      dataType: "json",
		      data: game,
		      success: function (data) {     
		    //    $('#game').append('<p>' + data.player1Name + ' vs ' + data.player2Name + '</p>');
		    //  	$('#score').append('<p>' + data.player1Score + '-' + data.player2Score + '</p>'); 
			//	$('#report').append("<button id='"+data.id+"' class='report-scores'>" + "Report scores" + "</button>");       
				
		      }
			});	// end ajax		
	//	}
	//}
	
/*	$.ajax({
	  url: 'backliftapp/sched',
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	  	for(var i=0;i<data.length;i++){
	  		$('#game').append('<p>' + data[i].player1Name + ' vs ' + data[i].player2Name + '</p>');
			$('#score').append('<p>' + data[i].player1Score + '-' + data[i].player2Score + '</p>'); 
    		$('#report').append("<button id='"+data[i].id+"' class='report-scores'>" + "Report scores" + "</button>");  
	  		
	  	}
	  	
      }  // end function   
	}); // end ajax 
*/
}

function reportScore(selected){
	var id=$(selected).attr('id');
  	// alert(id);
  	$.ajax({
	  url: 'backliftapp/sched/' + id,
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	  	$('#team1').text(data.player1Name);
	  	$('#team2').text(data.player2Name);
    	$('#update-button').append("<button id='"+data.id+"' class='update-results' class='btn' data-dismiss='modal' aria-hidden='true'>" + "Update results" + "</button>");  
	  	$('#scoreModal').modal();	  
    	$('#update-button').html();  
	  }  // end function   
	}); // end ajax
}


/*retrieves an item from the database (still not working)*/ 
/*
function retrieveItem(id){
	var item={};
  $.ajax({
	  url: 'backliftapp/sched/' + id,
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	    item=data;
	    }  // end function   
	}); // end ajax

  return item;
}
*/

/*modifies wins, losses, and scores for a team*/

function modifyTeamData(selected){
	var gameID=$(selected).attr('id');
	// alert(gameID);
	var winner,loser;
	var score1=$('#player1-score').val();
	var score2=$('#player2-score').val();

		$.ajax({
		    url: 'backliftapp/sched/' + gameID,
		    type: "GET",
		    dataType: "json",
		    success: function (data) {
		    	if(score1<score2){
			    	winner=data.player2ID;
			    	loser=data.player1ID;
			    	modifyWins(winner)
			    	modifyLosses(loser);
		    	}
		    	else{
	    			winner=data.player1ID;
			    	loser=data.player2ID;
			    	modifyWins(winner);
			    	modifyLosses(loser);
		    	}

		    	modifyScores(gameID,score1,score2);
				
	    	} //end outer success
    	}); //end ajax
}	

function modifyScores(gameID,score1,score2){
		$.ajax({
		    url: 'backliftapp/sched/'+ gameID,
		    type: "PUT",
		    dataType: "json",
		    data: {
		    	player1Score:score1,
		    	player2Score:score2
		    },
		    success: function (data) {
		    	$('#score').html('');
		    	updateScoreTable();
		    }
		}); //end ajax
}

function updateScoreTable(){
	$.ajax({
	    url: 'backliftapp/sched',
	    type: "GET",
	    dataType: "json",
	    success: function (data){
	    	for(var i=0;i<data.length;i++){
				$('#score').append('<p>' + data[i].player1Score + '-' + data[i].player2Score + '</p>'); 

	    	}
	    }

	});
}

function modifyWins(winnerID){
	$.ajax({
	    url: 'backliftapp/teams/'+ winnerID,
	    type: "GET",
	    dataType: "json",
	    success: function (data) {
	    	var winCount=data.wins;
	    	winCount++;
		$.ajax({
		    url: 'backliftapp/teams/'+ winnerID,
		    type: "PUT",
		    dataType: "json",
		    data: {
		    	wins: winCount
		    },
		    success: function (data) {
		    	updateTable();
		    }
		}); //end ajax


	    }// end outer success
	}); //end ajax
}

function modifyLosses(loserID){	
	$.ajax({
	    url: 'backliftapp/teams/'+ loserID,
	    type: "GET",
	    dataType: "json",
	    success: function (data) {
	    	var lossCount=data.losses;
	    	lossCount++;
		$.ajax({
		    url: 'backliftapp/teams/'+ loserID,
		    type: "PUT",
		    dataType: "json",
		    data: {losses: lossCount},
		    success: function (data) {
		    	updateTable();
		    }
		}); //end ajax


	    }// end outer success
	}); //end ajax
}

/*updates table after deleting or modifying team data*/

function updateTable(){
  //read the modified database
  $.ajax({
    url: 'backliftapp/teams',
    type: "GET",
    dataType: "json",
    success: function (data){
      if(data.length===0){
        //empty the table
        $('#name').html('');
        $('#wins').html('');
        $('#losses').html(''); 
        $('#percent').html(''); 
        $('#delete').html(''); 
        $('#update-button').html('');	

      }
      else{
        $('#name').html('');
        $('#wins').html('');
        $('#losses').html('');
        $('#percent').html(''); 
        $('#delete').html(''); 
 	    $('#update-button').html('');	


        for(var i=0;i<data.length;i++){
          populateTable(data[i]); 
        } //end for   
      }
    } // end function
  }); // end ajax
}

$(document).ready(function(){

	$.ajax({
	  url: 'backliftapp/teams',
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	    for(var i=0;i<data.length;i++) {
	      populateTable(data[i]); 
	    }   
	  } // end function
	}); // end ajax


	/*click event for "Add a Team button"*/
	$('#add').click(function(){

	  	var team=createTeam(); // creates team object
	  
	    $.ajax({
	      	url: 'backliftapp/teams',
     	 	type: "POST",
      		dataType: "json",
	      	data: team,
	      	success: function (data) {              
		      populateTable(data);                      
	      	}
	    });	

	    $('.Pop1').popover({
			selector: '[rel=popover]',
			html:  true,
			trigger: 'hover',
			placement: 'bottom'
			});  
	}); //end click

	$("div.modal[role='dialog']").each(function(i,a){
    		$(a).on('hidden', function(){
        		var allforms = $(this).find('form');
        		if (allforms.length > 0) {
            $(allforms).each(function(k,p){
                $(p)[0].reset();
            }); //end of allforms function
        		};  //end of allforms find
    		});  //end of hidden function
				});  //end of div.modal function		


	/*click event for "Delete team" button*/
	$('body').on('click', '.delete-team', function(){
		deleteTeam(this);
	});

	/*click event for "Start season" button*/
	$('body').on('click', '#start', function(){
		createSchedule(printSchedule);
		
	});

	/*click event for "Report scores" button*/
	$('body').on('click', '.report-scores', function(){
		reportScore(this);
	});

	/*click event for "Update results" button in modal*/
	$('body').on('click', '.update-results', function(){
		modifyTeamData(this);
	});

	$('body').on('click', '#deleteSeason', function(){
		deleteSeason();
	});



}); //end ready 