let req = require('request-promise-native');
let colors = require('colors');

let promiseGenerator = function* (listOfQuestions) {
  for (let question of listOfQuestions) {
    yield req(question);
  }
}

async function printQuestions(baseUrl) {
  let listOfQuestions = await req.get(baseUrl);
  listOfQuestions = JSON.parse(listOfQuestions)._embedded.questions.map(x => x._links.self.href);
  printQuestions(listOfQuestions);

  for (let promise of promiseGenerator(listOfQuestions)) {
    let item = JSON.parse(await promise);
    console.log(`Question title: ${item.title} - ${item._links.self.href}`.blue);
  }
}

printQuestions('https://question--answer.herokuapp.com/api/questions');
