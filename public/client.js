var championsId = { 266: "Aatrox", 103: "Ahri", 84: "Akali", 12: "Alistar", 32: "Amumu", 34: "Anivia", 1: "Annie", 22: "Ashe", 136: "AurelionSol", 268: "Azir", 432: "Bard", 53: "Blitzcrank", 63: "Brand", 201: "Braum", 51: "Caitlyn", 164: "Camille", 69: "Cassiopeia", 31: "Chogath", 42: "Corki", 122: "Darius", 131: "Diana", 119: "Draven", 36: "DrMundo", 245: "Ekko", 60: "Elise", 28: "Evelynn", 81: "Ezreal", 9: "Fiddlesticks", 114: "Fiora", 105: "Fizz", 3: "Galio", 41: "Gangplank", 86: "Garen", 150: "Gnar", 79: "Gragas", 104: "Graves", 120: "Hecarim", 74: "Heimerdinger", 420: "Illaoi", 39: "Irelia", 427: "Ivern", 40: "Janna", 59: "JarvanIV", 24: "Jax", 126: "Jayce", 202: "Jhin", 222: "Jinx", 145: "Kaisa", 429: "Kalista", 43: "Karma", 30: "Karthus", 38: "Kassadin", 55: "Katarina", 10: "Kayle", 141: "Kayn", 85: "Kennen", 121: "Khazix", 203: "Kindred", 240: "Kled", 96: "KogMaw", 7: "Leblanc", 64: "LeeSin", 89: "Leona", 127: "Lissandra", 236: "Lucian", 117: "Lulu", 99: "Lux", 54: "Malphite", 90: "Malzahar", 57: "Maokai", 11: "MasterYi", 21: "MissFortune", 62: "MonkeyKing", 82: "Mordekaiser", 25: "Morgana", 267: "Nami", 75: "Nasus", 111: "Nautilus", 76: "Nidalee", 56: "Nocturne", 20: "Nunu", 2: "Olaf", 61: "Orianna", 516: "Ornn", 80: "Pantheon", 78: "Poppy", 555: "Pyke", 133: "Quinn", 497: "Rakan", 33: "Rammus", 421: "RekSai", 58: "Renekton", 107: "Rengar", 92: "Riven", 68: "Rumble", 13: "Ryze", 113: "Sejuani", 35: "Shaco", 98: "Shen", 102: "Shyvana", 27: "Singed", 14: "Sion", 15: "Sivir", 72: "Skarner", 37: "Sona", 16: "Soraka", 50: "Swain", 134: "Syndra", 223: "TahmKench", 163: "Taliyah", 91: "Talon", 44: "Taric", 17: "Teemo", 412: "Thresh", 18: "Tristana", 48: "Trundle", 23: "Tryndamere", 4: "TwistedFate", 29: "Twitch", 77: "Udyr", 6: "Urgot", 110: "Varus", 67: "Vayne", 45: "Veigar", 161: "Velkoz", 254: "Vi", 112: "Viktor", 8: "Vladimir", 106: "Volibear", 19: "Warwick", 498: "Xayah", 101: "Xerath", 5: "XinZhao", 157: "Yasuo", 83: "Yorick", 154: "Zac", 238: "Zed", 115: "Ziggs", 26: "Zilean", 142: "Zoe", 143: "Zyra" };
var maps = { 10: "The Twisted Treeline", 11: "Summoner's Rift", 12: "Howling Abyss" };

var gameModes = {
  76: 'URF',
  100: 'ARAM',
  400: 'Normal (Draft)',
  420: 'Ranked (Solo)',
  430: 'Normal (Blind)',
  440: 'Ranked (Flex)',
  460: '3v3 Blind',
  470: '3v3 Ranked (Flex)',
  800: '3v3 Co-op vs. AI (Intermediate)',
  810: '3v3 Co-op vs. AI (Intro)',
  820: '3v3 Co-op vs. AI (Beginner)',
  830: 'Co-op vs. AI (Intro)',
  840: 'Co-op vs. AI (Beginner)',
  850: 'Co-op vs. AI (Intermediate)'
};

var req = new XMLHttpRequest();
var url = '/api';
var params = 'playerName=Kalane';
var nameChosen = '';
var infos = {};

req.addEventListener('load', onLoad);
req.addEventListener('error', onError);

/* Check on the load of the page if the content is already cached */
if (localStorage['currentPage']) {
  console.log('cached earlier');
  console.log(localStorage['currentPage']);
  displayContent(localStorage[localStorage['currentPage']]);
} else {
  console.log('nop');
  req.open('POST', url, true);
  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.send(params);
}


function onLoad() {
  var response = this.responseText;
  var parsedEntireResponse = JSON.parse(response);
  parsedEntireResponse[1] = JSON.parse(parsedEntireResponse[1]);
  createObject(parsedEntireResponse);
}


function onError() {
  console.log('error receiving async AJAX call');
}


/* Form */
var changeName = document.querySelector('#changeName');
var nameToPick = document.querySelector('#name')
changeName.addEventListener('submit', function (e) {
  e.preventDefault();
  nameChosen = nameToPick.value;
  if (localStorage[nameChosen]) {
    console.log('cached');
    displayContent(localStorage[nameChosen]);
  } else {
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send('playerName=' + nameToPick.value);
  }
});


/**
 *  Create an object in LocalStorage with the data we need to display
 * @param JSONData : big JSON with all the data of the request to the server
 */
function createObject(JSONData) {
  console.log('--- ALL INFOS ---')
  console.log(JSONData);

  var userStats = JSONData[0];
  var rankedStats = JSONData[1];
  var soloQStats = rankedStats.length !== 0 ? (rankedStats[0].queueType == 'RANKED_SOLO_5x5' ? rankedStats[0] : rankedStats[1]) : false;
  var matches = JSONData[2].matches;

  var matchesInfos = [];
  // Loop on all matches
  for (let i = 0; i < matches.length; i++) {
    var currentMatch = matches[i];
    var participantId;
    for (let i = 0; i < currentMatch.participantIdentities.length; i++) {
      if (currentMatch.participantIdentities[i].player.accountId === userStats.accountId)
        participantId = currentMatch.participantIdentities[i].participantId;
    }

    var teamId = currentMatch.participants[participantId - 1].teamId;
    var win = false;
    for (let i = 0; i < currentMatch.teams.length; i++) {
      if (currentMatch.teams[i].teamId === teamId) {
        if (currentMatch.teams[i].win === 'Win')
          win = true;
      }
    }

    var map = maps[currentMatch.mapId];
    var mode = gameModes[currentMatch.queueId];
    if (!mode)
      mode = 'Undefinded gamemode';
    var champion = currentMatch.participants[participantId - 1].championId;
    var role = currentMatch.participants[participantId - 1].timeline.lane;
    var timeAgo = timeDifference(currentMatch.gameCreation);
    var time = secToTime(currentMatch.gameDuration);
    var kills = currentMatch.participants[participantId - 1].stats.kills;
    var deaths = currentMatch.participants[participantId - 1].stats.deaths;
    var assists = currentMatch.participants[participantId - 1].stats.assists;
    var level = currentMatch.participants[participantId - 1].stats.champLevel;

    var items = [];
    for (let i = 0; i < 6; i++) {
      var currentItem = 'item' + i;
      items.push(currentMatch.participants[participantId - 1].stats[currentItem]);
    }

    var gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k';
    var minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled;

    matchesInfos.push({
      result: win,
      map: map,
      gamemode: mode,
      champ: champion,
      role: role,
      date: timeAgo,
      time: time,
      kills: kills,
      deaths: deaths,
      assists: assists,
      level: level,
      items: items,
      gold: gold,
      minions: minions
    });
  }
  console.log(matchesInfos);

  infos.accountId = userStats.accountId;
  infos.matches = matchesInfos;
  infos.profileIconId = userStats.profileIconId;
  infos.name = userStats.name;
  infos.level = userStats.summonerLevel;
  infos.rank = soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : 'Joueur non classé';
  infos.rankImgLink = getRankImg(soloQStats);
  infos.rankedWins = soloQStats.wins;
  infos.rankedLosses = soloQStats.losses;

  nameChosen = userStats.name;

  console.log('====== Saved infos ======');
  console.log(infos);

  localStorage[nameChosen] = JSON.stringify(infos);
  displayContent(localStorage[nameChosen]);
}


/**
 *  Display on the page all the dynamic content
 * @param stringData  : Stringify object with all datas
 */
function displayContent(stringData) {
  var data = JSON.parse(stringData);
  localStorage['currentPage'] = data.name;

  document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/' + data.profileIconId + '.png) center/cover';
  document.querySelector('.player__name').innerHTML = data.name;
  document.querySelector('.player__level').innerHTML = data.level;
  document.querySelector('.player__rank').innerHTML = data.rank;
  document.querySelector('.player__rank-img').style.background = 'url(' + data.rankImgLink + ') center/cover';
  document.querySelector('.player__ratio').innerHTML = data.rankedWins ? data.rankedWins + ' wins / ' + data.rankedLosses + ' losses' : "Joueur non classé";

  var playerContainer = document.querySelector('.player');
  var oldList = document.querySelector('.list-matches--debug');
  if (oldList)
    oldList.parentNode.removeChild(oldList);
  var matchesList = document.createElement('ul');
  matchesList.className = 'list-matches--debug';
  playerContainer.appendChild(matchesList);

  data.matches.forEach(e => {
    var li = document.createElement('li');
    if (e.result)
      li.className = 'match win';
    else
      li.className = 'match lose';
    var container = document.createElement('div');
    container.className = 'content-container';

    /* First col */
    var first = document.createElement('div');
    first.className = 'first';
    var imgChamp = document.createElement('img');
    var championName = championsId[e.champ];
    imgChamp.setAttribute('src', '/public/img/champions/' + championName + '.png');
    imgChamp.className = 'champion-img';

    var level = document.createElement('span');
    level.className = 'level';
    level.innerText = e.level;

    var summonerSpells = document.createElement('div');
    summonerSpells.className = 'summonerSpells';

    var firstSpell = document.createElement('img');
    firstSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerFlash.png');
    firstSpell.className = 'spell-icon';
    summonerSpells.appendChild(firstSpell);

    var secondSpell = document.createElement('img');
    secondSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerDot.png');
    secondSpell.className = 'spell-icon';
    summonerSpells.appendChild(secondSpell);

    var name = document.createElement('span');
    name.className = 'champion-name';
    name.innerText = championName;

    first.appendChild(imgChamp);
    first.appendChild(level);
    first.appendChild(summonerSpells);
    first.appendChild(name);


    /* Second col */
    var second = document.createElement('div');
    second.className = 'second';
    var map = document.createElement('div');
    map.className = 'map';
    map.innerText = e.map;
    var gamemode = document.createElement('div');
    gamemode.className = 'gamemode';
    gamemode.innerText = e.gamemode;

    second.appendChild(map);
    second.appendChild(gamemode);


    /* Third col */
    var third = document.createElement('div');
    third.className = 'third';
    e.items.forEach(e => {
      var img = document.createElement('img');
      img.className = 'item';
      img.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/items/' + e + '.png');
      third.appendChild(img);
    });


    /* Fourth col */
    var fourth = document.createElement('div');
    fourth.className = 'fourth';
    var score = document.createElement('div');
    score.className = 'score';
    score.innerText = e.kills + '/' + e.deaths + '/' + e.assists;

    var goldFarm = document.createElement('div');
    goldFarm.className = 'gold-farm';
    var gold = document.createElement('div');
    gold.className = 'gold';
    gold.innerText = e.gold;
    var farm = document.createElement('div');
    farm.className = 'farm';
    farm.innerText = e.minions;
    goldFarm.appendChild(gold);
    goldFarm.appendChild(farm);

    var durationDate = document.createElement('div');
    durationDate.className = 'duration-date';
    var duration = document.createElement('div');
    duration.className = 'duration';
    duration.innerText = e.time;
    var date = document.createElement('div');
    date.className = 'date';
    date.innerText = e.date;
    durationDate.appendChild(duration);
    durationDate.appendChild(date);

    fourth.appendChild(score);
    fourth.appendChild(goldFarm);
    fourth.appendChild(durationDate);

    
    /* End */
    container.appendChild(first);
    container.appendChild(second);
    container.appendChild(third);
    container.appendChild(fourth);
    li.appendChild(container);
    matchesList.appendChild(li);
  });
}


/* Debug button to reset localstorage */
document.querySelector('.debug').addEventListener('click', () => {
  console.log('CLEAR LOCALSTORAGE');
  localStorage.clear();
});