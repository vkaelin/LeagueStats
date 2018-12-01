var req = new XMLHttpRequest();
var url = '/api';

req.open('GET', url, true); // set this to POST if you would like
req.addEventListener('load', onLoad);
req.addEventListener('error', onError);

req.send();

function onLoad() {
  var response = this.responseText;
  var parsedEntireResponse = JSON.parse(response);
  //console.log(parsedEntireResponse);

  var userStats = parsedEntireResponse[0];
  var rankedStats = JSON.parse(parsedEntireResponse[1]);
  console.log(userStats);
  console.log(rankedStats);
  //console.log(rankedStats[0].playerOrTeamName);

  document.querySelector('.player__pp').style.background = 'url(http://cdn.kalane.ch/riot/profileicon/' + userStats.profileIconId + '.png) center/cover';
  document.querySelector('.player__name').innerHTML = userStats.name;
  document.querySelector('.player__level').innerHTML = userStats.summonerLevel;
  document.querySelector('.player__rank').innerHTML = rankedStats.length !== 0 ? rankedStats[0].tier + ' ' + rankedStats[0].rank : "Joueur non classé";
  document.querySelector('.player__ratio').innerHTML = rankedStats.length !== 0 ? rankedStats[0].wins + ' wins / ' + rankedStats[0].losses  + ' losses': "Joueur non classé";
}

function onError() {
  console.log('error receiving async AJAX call');
}


/* Formulaire */
var changeName = document.querySelector('#changeName');
var nameToPick = document.querySelector('#name')
changeName.addEventListener('submit', function (e) {
  e.preventDefault();
  url = '/api?' + nameToPick.value;
  req.open('GET', url, true);
  req.send();
});