var championsId = { 266: "Aatrox", 103: "Ahri", 84: "Akali", 12: "Alistar", 32: "Amumu", 34: "Anivia", 1: "Annie", 22: "Ashe", 136: "AurelionSol", 268: "Azir", 432: "Bard", 53: "Blitzcrank", 63: "Brand", 201: "Braum", 51: "Caitlyn", 164: "Camille", 69: "Cassiopeia", 31: "Chogath", 42: "Corki", 122: "Darius", 131: "Diana", 119: "Draven", 36: "DrMundo", 245: "Ekko", 60: "Elise", 28: "Evelynn", 81: "Ezreal", 9: "Fiddlesticks", 114: "Fiora", 105: "Fizz", 3: "Galio", 41: "Gangplank", 86: "Garen", 150: "Gnar", 79: "Gragas", 104: "Graves", 120: "Hecarim", 74: "Heimerdinger", 420: "Illaoi", 39: "Irelia", 427: "Ivern", 40: "Janna", 59: "JarvanIV", 24: "Jax", 126: "Jayce", 202: "Jhin", 222: "Jinx", 145: "Kaisa", 429: "Kalista", 43: "Karma", 30: "Karthus", 38: "Kassadin", 55: "Katarina", 10: "Kayle", 141: "Kayn", 85: "Kennen", 121: "Khazix", 203: "Kindred", 240: "Kled", 96: "KogMaw", 7: "Leblanc", 64: "LeeSin", 89: "Leona", 127: "Lissandra", 236: "Lucian", 117: "Lulu", 99: "Lux", 54: "Malphite", 90: "Malzahar", 57: "Maokai", 11: "MasterYi", 21: "MissFortune", 62: "MonkeyKing", 82: "Mordekaiser", 25: "Morgana", 267: "Nami", 75: "Nasus", 111: "Nautilus", 76: "Nidalee", 56: "Nocturne", 20: "Nunu", 2: "Olaf", 61: "Orianna", 516: "Ornn", 80: "Pantheon", 78: "Poppy", 555: "Pyke", 133: "Quinn", 497: "Rakan", 33: "Rammus", 421: "RekSai", 58: "Renekton", 107: "Rengar", 92: "Riven", 68: "Rumble", 13: "Ryze", 113: "Sejuani", 35: "Shaco", 98: "Shen", 102: "Shyvana", 27: "Singed", 14: "Sion", 15: "Sivir", 72: "Skarner", 37: "Sona", 16: "Soraka", 50: "Swain", 134: "Syndra", 223: "TahmKench", 163: "Taliyah", 91: "Talon", 44: "Taric", 17: "Teemo", 412: "Thresh", 18: "Tristana", 48: "Trundle", 23: "Tryndamere", 4: "TwistedFate", 29: "Twitch", 77: "Udyr", 6: "Urgot", 110: "Varus", 67: "Vayne", 45: "Veigar", 161: "Velkoz", 254: "Vi", 112: "Viktor", 8: "Vladimir", 106: "Volibear", 19: "Warwick", 498: "Xayah", 101: "Xerath", 5: "XinZhao", 157: "Yasuo", 83: "Yorick", 154: "Zac", 238: "Zed", 115: "Ziggs", 26: "Zilean", 142: "Zoe", 143: "Zyra" };
var req = new XMLHttpRequest();
var url = '/api';
var params = 'playerName=Chil';

req.open('POST', url, true); // set this to POST if you would like
req.addEventListener('load', onLoad);
req.addEventListener('error', onError);
req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
req.send(params);

function onLoad() {
  var response = this.responseText;
  var parsedEntireResponse = JSON.parse(response);

  var userStats = parsedEntireResponse[0];
  var rankedStats = JSON.parse(parsedEntireResponse[1]);
  var soloQStats = rankedStats.length !== 0 ? (rankedStats[0].queueType == 'RANKED_SOLO_5x5' ? rankedStats[0] : rankedStats[1]) : false;
  var matches = parsedEntireResponse[2];
  //console.log(userStats);
  //console.log(rankedStats);
  console.log(matches);
  console.log(soloQStats);

  document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/' + userStats.profileIconId + '.png) center/cover';
  document.querySelector('.player__name').innerHTML = userStats.name;
  document.querySelector('.player__level').innerHTML = userStats.summonerLevel;
  document.querySelector('.player__rank').innerHTML = soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : "Joueur non classé";

  var rankImgLink = getRankImg(soloQStats);
  document.querySelector('.player__rank-img').style.background = 'url(' + rankImgLink + ') center/cover';
  document.querySelector('.player__ratio').innerHTML = soloQStats ? soloQStats.wins + ' wins / ' + soloQStats.losses + ' losses' : "Joueur non classé";


  var playerContainer = document.querySelector('.player');
  var oldList = document.querySelector('.list-matches');
  if (oldList)
    oldList.parentNode.removeChild(oldList);
  var matchesList = document.createElement('ul');
  matchesList.className = 'list-matches';
  playerContainer.appendChild(matchesList);
  matches.matches.forEach(e => {
    var li = document.createElement('li');
    var img = document.createElement('img');
    var championName = championsId[e.champion];
    img.setAttribute('src', '/public/img/champions/' + championName + '.png');
    img.className = 'champion-icon';
    li.innerHTML = championName + ' - ' + e.lane;
    li.appendChild(img);
    matchesList.appendChild(li);
  });
}

function onError() {
  console.log('error receiving async AJAX call');
}


/* Formulaire */
var changeName = document.querySelector('#changeName');
var nameToPick = document.querySelector('#name')
changeName.addEventListener('submit', function (e) {
  e.preventDefault();
  //url = '/api?' + nameToPick.value;
  url = '/api';
  req.open('POST', url, true);
  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.send('playerName=' + nameToPick.value);
});

/**
 *  Return the link of the rank image
 * @param soloQStats : stats in soloQ of the player
 */
function getRankImg(soloQStats) {
  if (soloQStats) {
    if (soloQStats.tier != 'MASTER' && soloQStats.tier != 'CHALLENGER') {
      return '/public/img/tier-icons/' + soloQStats.tier.toLowerCase() + '_' + soloQStats.rank.toLowerCase() + '.png';
    } else {
      return '/public/img/tier-icons/' + soloQStats.tier.toLowerCase() + '.png';
    }
  } else {
    return '/public/img/tier-icons/provisional.png';
  }
}