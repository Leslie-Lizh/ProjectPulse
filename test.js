// require('datejs')
// const newDate = Date.parse('2024-07-13T16:00:00.000Z').toString("yyyy-MM-dd")
const newDate1 = Date.parse('2024-07-13T16:00:00.000Z')
const newDate2 = Date.parse("2024-06-05")

console.log(newDate1)
console.log(newDate1 > newDate2)

const userName = encodeURIComponent("Mark Lee");
console.log(userName)


// use this for comparing target timeline and current date, neglecting the time portion
const time = new Date()
console.log(time)
console.log(Date.parse(time))

const newDate = '2024-07-13T16:00:00.000Z'
console.log(Date.parse(newDate))
