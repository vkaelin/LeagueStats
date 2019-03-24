const req = new XMLHttpRequest();
const url = '/api';
const localInfos = {};
let nameChosen = '';
let itemsJSON;

// Get username from param
const fullUrl = new URL(window.location.href);
const searchParams = new URLSearchParams(fullUrl.search);
nameChosen = searchParams.get('username');

/**
 * Get the JSON file of all the items
 */
async function getItemsJSON() {
  return fetch('public/item.json').then(resp => resp.json()).then(json => { return json });
}

/**
 * Main function of the program
 */
async function main() {
  req.addEventListener('load', onLoad);
  req.addEventListener('error', onError);

  itemsJSON = await getItemsJSON();
  //console.log(itemsJSON);

  /* Check on the load of the page if the content is already cached */
  if (localStorage[nameChosen]) {
    console.log('cached on page load');
    document.querySelector('#refresh').style.display = 'block';
    displayContent(localStorage[nameChosen]);
  } else {
    console.log('not cached on page load');
    req.open('POST', url, true);
    document.querySelector('.loader--overlay').style.display = 'block';
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send('playerName=' + nameChosen);
  }

  /* Debug button to reset localstorage */
  document.querySelector('.debug').addEventListener('click', () => {
    console.log('CLEAR LOCALSTORAGE');
    localStorage.clear();
  });

  /* Refresh button */
  const refreshBtn = document.querySelector('#refresh');
  refreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.loader--overlay').style.display = 'block';
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send('playerName=' + nameChosen);
  })
}

// Call main function
main();

function onLoad() {

  document.querySelector('.loader--overlay').style.display = 'none';
  const response = this.responseText;

  // If username isn't found
  if (!response) {
    document.querySelector('#refresh').style.display = 'none';
    displayPlayerNotFound('Joueur introuvable');
    return;
  }
  document.querySelector('#refresh').style.display = 'block';
  const parsedEntireResponse = JSON.parse(response);
  parsedEntireResponse[1] = JSON.parse(parsedEntireResponse[1]);
  createObject(parsedEntireResponse);
}

function onError() {
  console.log('error receiving async AJAX call');
}

/**
 *  Create an object in LocalStorage with the data we need to display
 * @param JSONData : big JSON with all the data of the request to the server
 */
function createObject(JSONData) {
  console.log('--- ALL INFOS ---')
  console.log(JSONData);

  const userStats = JSONData[0];
  const rankedStats = JSONData[1];
  const soloQStats = rankedStats.length !== 0 ? (rankedStats[0].queueType == 'RANKED_SOLO_5x5' ? rankedStats[0] : rankedStats[1]) : false;
  const matches = JSONData[2].matches;

  const matchesInfos = [];
  // Loop on all matches
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    let participantId;
    for (let i = 0; i < currentMatch.participantIdentities.length; i++) {
      if (currentMatch.participantIdentities[i].player.accountId === userStats.accountId)
        participantId = currentMatch.participantIdentities[i].participantId;
    }

    const teamId = currentMatch.participants[participantId - 1].teamId;
    let win = false;
    for (let i = 0; i < currentMatch.teams.length; i++) {
      if (currentMatch.teams[i].teamId === teamId) {
        if (currentMatch.teams[i].win === 'Win')
          win = true;
      }
    }

    const map = maps[currentMatch.mapId];
    const mode = gameModes[currentMatch.queueId];
    if (!mode)
      mode = 'Undefinded gamemode';
    const champion = currentMatch.participants[participantId - 1].championId;
    const role = currentMatch.participants[participantId - 1].timeline.lane;
    const timeAgo = timeDifference(currentMatch.gameCreation);
    const time = secToTime(currentMatch.gameDuration);
    const kills = currentMatch.participants[participantId - 1].stats.kills;
    const deaths = currentMatch.participants[participantId - 1].stats.deaths;
    const assists = currentMatch.participants[participantId - 1].stats.assists;
    const level = currentMatch.participants[participantId - 1].stats.champLevel;

    const items = [];
    for (let i = 0; i < 6; i++) {
      const currentItem = 'item' + i;
      items.push(currentMatch.participants[participantId - 1].stats[currentItem]);
    }

    const gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k';
    const minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled;

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

  localInfos.accountId = userStats.accountId;
  localInfos.matches = matchesInfos;
  localInfos.profileIconId = userStats.profileIconId;
  localInfos.name = userStats.name;
  localInfos.level = userStats.summonerLevel;
  localInfos.rank = soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : 'Joueur non classé';
  localInfos.rankImgLink = getRankImg(soloQStats);
  localInfos.rankedWins = soloQStats.wins;
  localInfos.rankedLosses = soloQStats.losses;

  nameChosen = userStats.name;

  console.log('====== Saved infos ======');
  console.log(localInfos);

  localStorage[nameChosen] = JSON.stringify(localInfos);
  displayContent(localStorage[nameChosen]);
}


/**
 *  Display on the page all the dynamic content
 * @param stringData  : Stringify object with all datas
 */
function displayContent(stringData) {
  const data = JSON.parse(stringData);

  document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/' + data.profileIconId + '.png) center/cover';
  document.querySelector('.player__name').innerHTML = data.name;
  document.querySelector('.player__level').innerHTML = data.level;
  document.querySelector('.player__rank').innerHTML = data.rank;
  document.querySelector('.player__rank-img').style.background = 'url(' + data.rankImgLink + ') center/cover';
  document.querySelector('.player__ratio').innerHTML = data.rankedWins ? data.rankedWins + ' wins / ' + data.rankedLosses + ' losses' : "Joueur non classé";

  const playerContainer = document.querySelector('.player');
  const oldList = document.querySelector('.list-matches');
  if (oldList)
    oldList.parentNode.removeChild(oldList);
  const matchesList = document.createElement('ul');
  matchesList.className = 'list-matches';
  playerContainer.appendChild(matchesList);

  /* Loop on all matches */
  data.matches.forEach(e => {
    const li = createHTMLOneMatch(e);
    matchesList.appendChild(li);
  });
}


/**
 *  Return the HTML of one match
 * @param e : Infos in JSON of the match
 */
function createHTMLOneMatch(e) {
  const li = document.createElement('li');
  li.className = e.result ? 'match win' : 'match lose';
  const container = document.createElement('div');
  container.className = 'content-container';

  /* First col (champion/summoners) */
  const first = document.createElement('div');
  first.className = 'first';
  const imgChamp = document.createElement('img');
  const championName = championsId[e.champ];
  imgChamp.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/champions/' + championName + '.png');
  imgChamp.className = 'champion-icon';

  const level = document.createElement('span');
  level.className = 'level';
  level.innerText = e.level;

  const summonerSpells = document.createElement('div');
  summonerSpells.className = 'summonerSpells';
  const firstSpell = document.createElement('img');
  firstSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerFlash.png');
  firstSpell.className = 'spell-icon';
  summonerSpells.appendChild(firstSpell);
  const secondSpell = document.createElement('img');
  secondSpell.setAttribute('src', 'https://cdn.valentinkaelin.ch/riot/spells/SummonerDot.png');
  secondSpell.className = 'spell-icon';
  summonerSpells.appendChild(secondSpell);

  const name = document.createElement('span');
  name.className = 'champion-name';
  name.innerText = championName;

  first.appendChild(imgChamp);
  first.appendChild(level);
  first.appendChild(summonerSpells);
  first.appendChild(name);

  /* Second col (gamemode) */
  const second = document.createElement('div');
  second.className = 'second';
  const map = document.createElement('div');
  map.className = 'map';
  map.innerText = e.map;
  const gamemode = document.createElement('div');
  gamemode.className = 'gamemode';
  gamemode.innerText = e.gamemode;

  second.appendChild(map);
  second.appendChild(gamemode);

  /* Third col (items) */
  const third = document.createElement('div');
  third.className = 'third';
  e.items.forEach(e => {
    const img = document.createElement('div');
    img.className = 'item ' + e;
    if(e !== 0) {
      const itemImage = itemsJSON.data[e].image;
      img.style.background = `url('https://cdn.valentinkaelin.ch/riot/${itemImage.sprite}') -${itemImage.x}px -${itemImage.y}px`;
    } else {
      img.style.background = "url('https://cdn.valentinkaelin.ch/riot/items/0.png') 0% 0% / cover";
    }
    third.appendChild(img);
  });

  /* Fourth col (stats) */
  const fourth = document.createElement('div');
  fourth.className = 'fourth';
  const score = document.createElement('div');
  score.className = 'score';
  score.innerText = e.kills + '/' + e.deaths + '/' + e.assists;

  const goldFarm = document.createElement('div');
  goldFarm.className = 'gold-farm';
  const gold = document.createElement('div');
  gold.className = 'gold';
  gold.innerText = e.gold;
  const farm = document.createElement('div');
  farm.className = 'farm';
  farm.innerText = e.minions;
  goldFarm.appendChild(gold);
  goldFarm.appendChild(farm);

  const durationDate = document.createElement('div');
  durationDate.className = 'duration-date';
  const duration = document.createElement('div');
  duration.className = 'duration';
  duration.innerText = e.time;
  const date = document.createElement('div');
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
  return li;
}


/**
 * Display the information that the player has not be found
 * @param text : String to display - error message
 */
function displayPlayerNotFound(text) {
  document.querySelector('.player__pp').style.background = 'url(https://cdn.valentinkaelin.ch/riot/profileicon/29.png) center/cover';
  document.querySelector('.player__name').innerHTML = '';
  document.querySelector('.player__level').innerHTML = '';
  document.querySelector('.player__rank').innerHTML = '';
  document.querySelector('.player__rank-img').style.background = 'https://cdn.valentinkaelin.ch/riot/tier-icons/provisional.png';
  document.querySelector('.player__ratio').innerHTML = text;
  document.querySelector('.list-matches').innerHTML = '';
}
