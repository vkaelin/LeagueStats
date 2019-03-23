/**
 *  Return the relative time betweeen a chosen moment and the current time
 * @param previous : time we want to get difference 
 */
function timeDifference(previous) {
  var current = new Date();
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerWeek = msPerDay * 7;
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + 's';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + 'm';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + 'h';
  } else if (elapsed < msPerWeek) {
    return Math.round(elapsed / msPerDay) + 'j';
  } else {
    var oldDate = new Date(previous);
    var day = oldDate.getDate() < 10 ? '0' + oldDate.getDate() : oldDate.getDate();
    var month = oldDate.getMonth() < 9 ? '0' + (oldDate.getMonth() + 1) : (oldDate.getMonth() + 1);
    return day + '.' + month + '.' + oldDate.getFullYear().toString().substr(-2);
  }
}


/**
 *  Return time in a formatted way
 * @param sec  : time in seconds to convert
 */
function secToTime(sec) {
  var min = Math.floor(sec / 60);
  var newSec = sec - min * 60;
  return min + ':' + (newSec < 10 ? '0' + newSec : newSec); //
}


/**
 *  Return the link of the rank image
 * @param soloQStats : stats in soloQ of the player
 */
function getRankImg(soloQStats) {

  if (!soloQStats) {
    return 'https://cdn.valentinkaelin.ch/riot/tier-icons/provisional.png';
  }

  if (soloQStats.tier != 'MASTER' && soloQStats.tier != 'CHALLENGER') {
    return 'https://cdn.valentinkaelin.ch/riot/tier-icons/' + soloQStats.tier.toLowerCase() + '_' + soloQStats.rank.toLowerCase() + '.png';
  } else {
    return 'https://cdn.valentinkaelin.ch/riot/tier-icons/' + soloQStats.tier.toLowerCase() + '.png';
  }
}