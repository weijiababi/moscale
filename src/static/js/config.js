const global = {
  baseURL: 'https://gc.moscales.com'
}

export function getNowFormatDate(num = 0) {
  num = Number(num)
  let day1 = new Date()
  day1.setTime(day1.getTime() + num * 24 * 60 * 60 * 1000)
  let s1 =
    day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate()
  return s1
}

export default global
