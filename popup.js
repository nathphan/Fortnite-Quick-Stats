var winsSolo = document.querySelector('#winsSolo');
var killsSolo = document.querySelector('#killsSolo');
var winPerSolo = document.querySelector('#winPerSolo');
var kdSolo = document.querySelector('#kdSolo');
var soloRank = document.querySelector('#soloRank');

var winsDuo = document.querySelector('#winsDuo');
var killsDuo = document.querySelector('#killsDuo');
var winPerDuo = document.querySelector('#winPerDuo');
var kdDuo = document.querySelector('#kdDuo');
var duoRank = document.querySelector('#duoRank');

var winsSquad = document.querySelector('#winsSquad');
var killsSquad = document.querySelector('#killsSquad');
var winPerSquad = document.querySelector('#winPerSquad');
var kdSquad = document.querySelector('#kdSquad');
var squadRank = document.querySelector('#squadRank');

var searchBar = document.querySelector('#searchName');

// Clears and sets focus on search bar
function setFocus() {
	searchBar.value = '';
	searchBar.focus();
}

// Gets images for different tiers
function getTier(rating, mode){
	var img;
	if(mode == 1){
		img = document.getElementById('soloImg');
	}
	else if(mode == 2){
		img = document.getElementById('duoImg');
	}
	else if(mode == 3){
		img = document.getElementById('squadImg');
	}

	if(rating >= 0 && rating < 1500){
		img.src = 'images/tier1.png';
	}
	else if(rating >= 1500 && rating < 3000){
		img.src = 'images/tier2.png';
	}
	else if(rating >= 3000 && rating < 4000){
		img.src = 'images/tier3.png';
	}
	else if(rating >= 4000 && rating < 4500){
		img.src = 'images/tier4.png';
	}
	else if(rating >= 4500){
		img.src = 'images/tier5.png';
	}
}

// API call
function getStats(url, options = false){
	var param;

	/* To be used for special effects */
	$("#error").hide();
	$("#nameContainer").hide();
	$("#allStats").hide();
	/* ------------------------------ */

	$.get("includes/help.stats", function(data) {
		param = {
			headers:{
				"trn-api-key": data
			},
			method: "GET"
		};

		fetch(url,param)
		  .then(data=>{	// Data Check
		  	if(!data.ok) throw Error(data.statusText);
		  	return data.json()
		  })
		  .then(res=>{
		  	if(res.error){	// Username not found
					$('#error').show();
					if(options) $('#errorHtml').html('Error: Saved username is invalid'); // Error via options
					else $('#errorHtml').html('player not found'); // Error via popup
		  		setFocus();
		  	}
		  	else{
			  	document.getElementById('name').innerHTML = res.epicUserHandle; // Display name // Wtf why cant I change this
					let prefix = '';
					if(res.stats.curr_p2 != null) prefix = 'curr_';
					// Solo stats
			  	winsSolo.innerHTML = res.stats[`${prefix}p2`].top1.displayValue;
			  	killsSolo.innerHTML = res.stats[`${prefix}p2`].kills.displayValue;
			  	winPerSolo.innerHTML = res.stats[`${prefix}p2`].winRatio.displayValue+"%";
			  	kdSolo.innerHTML = res.stats[`${prefix}p2`].kd.displayValue;
			  	soloRank.innerHTML = res.stats[`${prefix}p2`].trnRating.displayValue;

			  	// Duo stats
			  	winsDuo.innerHTML = res.stats[`${prefix}p10`].top1.displayValue;
			  	killsDuo.innerHTML = res.stats[`${prefix}p10`].kills.displayValue;
			  	winPerDuo.innerHTML = res.stats[`${prefix}p10`].winRatio.displayValue+"%";
			  	kdDuo.innerHTML = res.stats[`${prefix}p10`].kd.displayValue;
			  	duoRank.innerHTML = res.stats[`${prefix}p10`].trnRating.displayValue;

			  	//Squad stats
			  	winsSquad.innerHTML = res.stats[`${prefix}p9`].top1.displayValue;
			  	killsSquad.innerHTML = res.stats[`${prefix}p9`].kills.displayValue;
			  	winPerSquad.innerHTML = res.stats[`${prefix}p9`].winRatio.displayValue+"%";
			  	kdSquad.innerHTML = res.stats[`${prefix}p9`].kd.displayValue;
			  	squadRank.innerHTML = res.stats[`${prefix}p9`].trnRating.displayValue;

					getTier(res.stats[`${prefix}p2`].trnRating.valueInt, 1); //Icons
					getTier(res.stats[`${prefix}p10`].trnRating.valueInt, 2); //Icons
			  	getTier(res.stats[`${prefix}p9`].trnRating.valueInt, 3); //Icons

					setFocus();

					$("#allStats").show();
					$("#nameContainer").show();
			  }
		  }).
		  catch(error=>{
		  	console.log(error);
		  	alert("Please enter username");
		  	setFocus();
		  });
	});
}

$(function() {

  // Updates version number
	$('#ver').text(function(){
		var manifest = chrome.runtime.getManifest();
		console.log(manifest);
		return "v" + manifest.version;
	});

	// Hide all stats when loaded
	$(document).ready(function() {
		$("#error").hide();
		$("#nameContainer").hide();
		$("#allStats").hide();
	});

	// If username was stored
	chrome.storage.sync.get(['epicName'], function(result) { // Retrieves username from chrome storage
		if(result.epicName != 'undefined'){ // If username isn't undefined search username

			chrome.storage.sync.get(['epicPlatform'], function(result2) { // Retrieves platform from chrome storage
				$('#platform').val(result2.epicPlatform);

				var url = 'https://api.fortnitetracker.com/v1/profile/'; // Set url
				var platformChoice = result2.epicPlatform; // Set platform
		    var epicName = result.epicName; // Set username
		    url = url + platformChoice + '/' + epicName; // Concatonate url
				getStats(url, true);
			});

		}
	});

	// If username is searched
	$('#searchName').keydown(function (e) {
		if(e.keyCode == 13) {
			var url = 'https://api.fortnitetracker.com/v1/profile/';
			var platform = document.getElementById('platform');
			var platformChoice = platform.options[platform.selectedIndex].value;
			var epicName = $('#searchName').val();
			url = url + platformChoice + '/' + epicName;
			getStats(url);
		}
	})
});
