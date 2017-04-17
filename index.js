let req = require('request-promise-native');
let colors = require('colors');
let os = require('os');

let promiseGenerator = function* (listOfQuestions) {
  for (let question of listOfQuestions) {
    yield req.get(question);
  }
}

async function printQuestions(baseUrl) {
  try {
    let listOfQuestions = await req.get(baseUrl);
    listOfQuestions = JSON.parse(listOfQuestions)._embedded.questions.map(x => x._links.self.href);

    for (let promise of promiseGenerator(listOfQuestions)) {
      const item = JSON.parse(await promise);
      console.log(`Question title: ${item.title} - ${item._links.self.href}`.blue);
    }
  } catch ({ error }) {
    let serverError = JSON.parse(error);
    console.log(`Status: ${serverError.status} ${os.EOL}Message: ${serverError.message}`);
  }
}

printQuestions('https://question--answer.herokuapp.com/api/questions');
