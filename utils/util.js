const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/* 今天，昨天，近七天等 以整数凌晨到现在的秒数 */
const transformTime = (timeUnit, startTime) => {
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  let seconds = date.getMilliseconds();
  let totalSeconds = 0;
  if(startTime > 1) {
    totalSeconds = (startTime - 1) * timeUnit + hours*3600 + mins * 60 + seconds
  } else {
    totalSeconds = hours * 3600 + mins * 60 + seconds
  }
  return totalSeconds;

}

module.exports = {
  formatTime: formatTime,
  transformTime: transformTime
}
