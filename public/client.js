// var req = new XMLHttpRequest();
// var url = '/api';
// var params = 'playerName=Kalane';
// var nameChosen = '';
// var infos = {};
// var itemsJSON;

// /**
//  * Get the JSON file of all the items
//  */
// async function getItemsJSON() {
//   return fetch('public/item.json').then(resp => resp.json()).then(json => { return json });
// }

// /**
//  * Main function of the program
//  */
// async function main() {
//   req.addEventListener('load', onLoad);
//   req.addEventListener('error', onError);

//   itemsJSON = await getItemsJSON();
//   console.log(itemsJSON);

//   /* Check on the load of the page if the content is already cached */
//   if (localStorage['currentPage']) {
//     console.log('cached on page load');
//     console.log(localStorage['currentPage']);
//     document.querySelector('#refresh').style.display = 'block';
//     displayContent(localStorage[localStorage['currentPage']]);
//   } else {
//     console.log('not cached on page load');
//     req.open('POST', url, true);
//     document.querySelector('.loader--overlay').style.display = 'block';
//     req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     req.send(params);
//   }


//   /* Debug button to reset localstorage */
//   document.querySelector('.debug').addEventListener('click', () => {
//     console.log('CLEAR LOCALSTORAGE');
//     localStorage.clear();
//   });

//   /* Form to change username */
//   var changeName = document.querySelector('#changeName');
//   var nameToPick = document.querySelector('#name')
//   changeName.addEventListener('submit', function (e) {
//     e.preventDefault();

//     console.log('here')

//     nameChosen = nameToPick.value;
//     if (localStorage[nameChosen]) {
//       console.log('cached on search');
//       document.querySelector('#refresh').style.display = 'block';
//       displayContent(localStorage[nameChosen]);
//     } else {
//       document.querySelector('.loader--overlay').style.display = 'block';
//       req.open('POST', url, true);
//       req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//       req.send('playerName=' + nameToPick.value);
//     }
//   });

//   /* Refresh button */
//   var refreshBtn = document.querySelector('#refresh');
//   refreshBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     document.querySelector('.loader--overlay').style.display = 'block';
//     req.open('POST', url, true);
//     req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     req.send('playerName=' + localStorage['currentPage']);
//   })
// }

// // Call main function
// main();

// function onLoad() {

//   document.querySelector('.loader--overlay').style.display = 'none';
//   var response = this.responseText;

//   // If username isn't found
//   if (!response) {
//     document.querySelector('#refresh').style.display = 'none';
//     displayPlayerNotFound('Joueur introuvable');
//     return;
//   }
//   document.querySelector('#refresh').style.display = 'block';
//   var parsedEntireResponse = JSON.parse(response);
//   parsedEntireResponse[1] = JSON.parse(parsedEntireResponse[1]);
//   createObject(parsedEntireResponse);
// }

// function onError() {
//   console.log('error receiving async AJAX call');
// }

// /**
//  *  Create an object in LocalStorage with the data we need to display
//  * @param JSONData : big JSON with all the data of the request to the server
//  */
// function createObject(JSONData) {
//   console.log('--- ALL INFOS ---')
//   console.log(JSONData);

//   var userStats = JSONData[0];
//   var rankedStats = JSONData[1];
//   var soloQStats = rankedStats.length !== 0 ? (rankedStats[0].queueType == 'RANKED_SOLO_5x5' ? rankedStats[0] : rankedStats[1]) : false;
//   var matches = JSONData[2].matches;

//   var matchesInfos = [];
//   // Loop on all matches
//   for (let i = 0; i < matches.length; i++) {
//     var currentMatch = matches[i];
//     var participantId;
//     for (let i = 0; i < currentMatch.participantIdentities.length; i++) {
//       if (currentMatch.participantIdentities[i].player.accountId === userStats.accountId)
//         participantId = currentMatch.participantIdentities[i].participantId;
//     }

//     var teamId = currentMatch.participants[participantId - 1].teamId;
//     var win = false;
//     for (let i = 0; i < currentMatch.teams.length; i++) {
//       if (currentMatch.teams[i].teamId === teamId) {
//         if (currentMatch.teams[i].win === 'Win')
//           win = true;
//       }
//     }

//     var map = maps[currentMatch.mapId];
//     var mode = gameModes[currentMatch.queueId];
//     if (!mode)
//       mode = 'Undefinded gamemode';
//     var champion = currentMatch.participants[participantId - 1].championId;
//     var role = currentMatch.participants[participantId - 1].timeline.lane;
//     var timeAgo = timeDifference(currentMatch.gameCreation);
//     var time = secToTime(currentMatch.gameDuration);
//     var kills = currentMatch.participants[participantId - 1].stats.kills;
//     var deaths = currentMatch.participants[participantId - 1].stats.deaths;
//     var assists = currentMatch.participants[participantId - 1].stats.assists;
//     var level = currentMatch.participants[participantId - 1].stats.champLevel;

//     var items = [];
//     for (let i = 0; i < 6; i++) {
//       var currentItem = 'item' + i;
//       items.push(currentMatch.participants[participantId - 1].stats[currentItem]);
//     }

//     var gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k';
//     var minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled;

//     matchesInfos.push({
//       result: win,
//       map: map,
//       gamemode: mode,
//       champ: champion,
//       role: role,
//       date: timeAgo,
//       time: time,
//       kills: kills,
//       deaths: deaths,
//       assists: assists,
//       level: level,
//       items: items,
//       gold: gold,
//       minions: minions
//     });
//   }
//   console.log(matchesInfos);

//   infos.accountId = userStats.accountId;
//   infos.matches = matchesInfos;
//   infos.profileIconId = userStats.profileIconId;
//   infos.name = userStats.name;
//   infos.level = userStats.summonerLevel;
//   infos.rank = soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : 'Joueur non classé';
//   infos.rankImgLink = getRankImg(soloQStats);
//   infos.rankedWins = soloQStats.wins;
//   infos.rankedLosses = soloQStats.losses;

//   nameChosen = userStats.name;

//   console.log('====== Saved infos ======');
//   console.log(infos);

//   localStorage[nameChosen] = JSON.stringify(infos);
//   displayContent(localStorage[nameChosen]);
// }


// /**
//  *  Display on the page all the dynamic content
//  * @param stringData  : Stringify object with all datas
//  */
// function displayContent(stringData) {
//   var data = JSON.parse(stringData);
//   localStorage['currentPage'] = data.name;

//   document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/' + data.profileIconId + '.png) center/cover';
//   document.querySelector('.player__name').innerHTML = data.name;
//   document.querySelector('.player__level').innerHTML = data.level;
//   document.querySelector('.player__rank').innerHTML = data.rank;
//   document.querySelector('.player__rank-img').style.background = 'url(' + data.rankImgLink + ') center/cover';
//   document.querySelector('.player__ratio').innerHTML = data.rankedWins ? data.rankedWins + ' wins / ' + data.rankedLosses + ' losses' : "Joueur non classé";

//   var playerContainer = document.querySelector('.player');
//   var oldList = document.querySelector('.list-matches');
//   if (oldList)
//     oldList.parentNode.removeChild(oldList);
//   var matchesList = document.createElement('ul');
//   matchesList.className = 'list-matches';
//   playerContainer.appendChild(matchesList);

//   /* Loop on all matches */
//   data.matches.forEach(e => {
//     var li = createHTMLOneMatch(e);
//     matchesList.appendChild(li);
//   });
// }


// /**
//  *  Return the HTML of one match
//  * @param e : Infos in JSON of the match
//  */
// function createHTMLOneMatch(e) {
//   var li = document.createElement('li');
//   li.className = e.result ? 'match win' : 'match lose';
//   var container = document.createElement('div');
//   container.className = 'content-container';

//   /* First col (champion/summoners) */
//   var first = document.createElement('div');
//   first.className = 'first';
//   var imgChamp = document.createElement('img');
//   var championName = championsId[e.champ];
//   imgChamp.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/champions/' + championName + '.png');
//   imgChamp.className = 'champion-icon';

//   var level = document.createElement('span');
//   level.className = 'level';
//   level.innerText = e.level;

//   var summonerSpells = document.createElement('div');
//   summonerSpells.className = 'summonerSpells';
//   var firstSpell = document.createElement('img');
//   firstSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerFlash.png');
//   firstSpell.className = 'spell-icon';
//   summonerSpells.appendChild(firstSpell);
//   var secondSpell = document.createElement('img');
//   secondSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerDot.png');
//   secondSpell.className = 'spell-icon';
//   summonerSpells.appendChild(secondSpell);

//   var name = document.createElement('span');
//   name.className = 'champion-name';
//   name.innerText = championName;

//   first.appendChild(imgChamp);
//   first.appendChild(level);
//   first.appendChild(summonerSpells);
//   first.appendChild(name);

//   /* Second col (gamemode) */
//   var second = document.createElement('div');
//   second.className = 'second';
//   var map = document.createElement('div');
//   map.className = 'map';
//   map.innerText = e.map;
//   var gamemode = document.createElement('div');
//   gamemode.className = 'gamemode';
//   gamemode.innerText = e.gamemode;

//   second.appendChild(map);
//   second.appendChild(gamemode);

//   /* Third col (items) */
//   var third = document.createElement('div');
//   third.className = 'third';
//   e.items.forEach(e => {
//     var img = document.createElement('div');
//     img.className = 'item ' + e;
//     if(e !== 0) {
//       var itemImage = itemsJSON.data[e].image;
//       var itemSprite = itemImage.sprite;
//       var itemSpriteX = itemImage.x;
//       var itemSpriteY = itemImage.y;
//       img.style.background = `url('https://cdn.valentinkaelin.ch/riot/${itemSprite}') -${itemSpriteX}px -${itemSpriteY}px`;
//     } else {
//       img.style.background = "url('https://cdn.valentinkaelin.ch/riot/items/0.png') 0% 0% / cover";
//     }
//     third.appendChild(img);
//   });

//   /* Fourth col (stats) */
//   var fourth = document.createElement('div');
//   fourth.className = 'fourth';
//   var score = document.createElement('div');
//   score.className = 'score';
//   score.innerText = e.kills + '/' + e.deaths + '/' + e.assists;

//   var goldFarm = document.createElement('div');
//   goldFarm.className = 'gold-farm';
//   var gold = document.createElement('div');
//   gold.className = 'gold';
//   gold.innerText = e.gold;
//   var farm = document.createElement('div');
//   farm.className = 'farm';
//   farm.innerText = e.minions;
//   goldFarm.appendChild(gold);
//   goldFarm.appendChild(farm);

//   var durationDate = document.createElement('div');
//   durationDate.className = 'duration-date';
//   var duration = document.createElement('div');
//   duration.className = 'duration';
//   duration.innerText = e.time;
//   var date = document.createElement('div');
//   date.className = 'date';
//   date.innerText = e.date;
//   durationDate.appendChild(duration);
//   durationDate.appendChild(date);

//   fourth.appendChild(score);
//   fourth.appendChild(goldFarm);
//   fourth.appendChild(durationDate);

//   /* End */
//   container.appendChild(first);
//   container.appendChild(second);
//   container.appendChild(third);
//   container.appendChild(fourth);
//   li.appendChild(container);
//   return li;
// }


// /**
//  * Display the information that the player has not be found
//  * @param text : String to display - error message
//  */
// function displayPlayerNotFound(text) {
//   document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/29.png) center/cover';
//   document.querySelector('.player__name').innerHTML = '';
//   document.querySelector('.player__level').innerHTML = '';
//   document.querySelector('.player__rank').innerHTML = '';
//   document.querySelector('.player__rank-img').style.background = 'https://cdn.valentinkaelin.ch/riot/tier-icons/provisional.png';
//   document.querySelector('.player__ratio').innerHTML = text;
//   document.querySelector('.list-matches').innerHTML = '';
// }