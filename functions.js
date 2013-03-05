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

function teamLessThan(team1,team2){
	var bool=false;

	var percent1=team1.wins / (Number(team1.wins) + Number(team1.losses));
	var percent2=team2.wins / (Number(team2.wins) + Number(team2.losses));

	if(isNaN(percent1)){
    	percent1=0;
    }
    if(isNaN(percent2)){
    	percent2=0;
    }

	if (percent1<percent2){
		bool=true;
	}
	return bool;
}


function bubbleSort(a)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (teamLessThan(a[i],a[i+1])) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return a;
}

function readFromDatabase(dest){
	$.ajax({
      url: dest,
      type: "GET",
      dataType: "json",
      success: function (data) {              
	    	for(var i=0;i<data.length;i++){
	    		populateTable(data[i]);
	    	}
      }
	});	// end ajax
}

function writeToDatabase(dest,stuff){
	$.ajax({
      url: dest,
      type: "POST",
      dataType: "json",
      data: stuff,
      success: function (data) {              
  	                 
      }
	});	// end ajax
}

function createSchedule(printSchedule){
	
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
function deleteDatabase(dest){
	$.ajax({
  		url: dest,
  		type: "GET",
	  	dataType: "json",
      	success: function (data) {  
      		for(var i=0;i<data.length;i++){
      			
      			alert('delDatabase called');

      			$.ajax({
		      		url: dest + '/' + data[i].id,
			        type: "DELETE",
			        dataType: "json",
			        success: function (data) {  
	      			}
	    		}); //end ajax
      		}
      	}
    }); //end ajax
}
// /*deletes the game schedule from the database (used during testing)*/
// function deleteSeason(){
// 	$.ajax({
//   		url: 'backliftapp/sched',
//   		type: "GET",
// 	  	dataType: "json",
//       	success: function (data) {  
//       		for(var i=0;i<data.length;i++){
//       			$.ajax({
// 		      		url: 'backliftapp/sched/' + data[i].id,
// 			        type: "DELETE",
// 			        dataType: "json",
// 			        success: function (data) {
// 			   //      	$.ajax({
// 						//     url: 'backliftapp/teams/'+ team.id,
// 						//     type: "PUT",
// 						//     dataType: "json",
// 						//     data: {
// 						//     	wins: 0,
// 						//     	losses: 0
// 						//     },
// 						//     success: function (data) {
// 						//     	populateTable();
// 						//     }
// 						// }); //end ajax
// 	      			}
// 	    		}); //end ajax
//       		}
//       	}
//     }); //end ajax
// 			        // alert ("Season Deleted");  
// }

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
	// checkCount();
	}


function populateSchedule(game){
	
			$.ajax({
		      url: 'backliftapp/sched',
		      type: "POST",
		      dataType: "json",
		      data: game,
		      success: function (data) {     
		      }
			});	// end ajax		
	//	}
	//}
	

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
	    	$('#score').html("");
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


        
        var sorted=bubbleSort(data);
 	    deleteDatabase('backliftapp/sorted');
        for(var i=0;i<sorted.length;i++){
         	writeToDatabase('backliftapp/sorted',sorted[i]);
        } //end for  
        for(var i=0;i<sorted.length;i++){
        	populateTable(sorted[i]);        	
        }  
      }
    } // end function
  }); // end ajax
}

// var league_array=[];

$(document).ready(function(){

$("#addT").validate();
	$.ajax({
	  url: 'backliftapp/teams',
	  type: "GET",
	  dataType: "json",
	  success: function (data) {
	    for(var i=0;i<data.length;i++) {
	      populateTable(data[i]);
	      // league_array.push(data[i]); 
	    } 
	    // checkCount();  
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

// league_array.push(team);

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
		deleteDatabase('backliftapp/sched');
	});

	$('body').on('click', '#deleteSorted', function(){
		deleteDatabase('backliftapp/sorted');
	});


}); //end ready 

				function checkCount(){
					if(teamCounter.length===4){  //use .splice when we need to delete team from array.

					$("#modalTrigger").hide();
					$("#Sorry").append('<div class="span3 offset2"><h3>Sorry, League Full.</h3>');
				};
			};