const http = require('http');
const fs = require('fs');

function extractStudentDetails(studentList) {
  const students = {};
  let count = 0;

  for (let student of studentList) {
    if (student !== '') {
      student = student.trim();
      student = student.split(',');
      count += 1;

      try {
        students[student[student.length - 1]].push(student[0]);
      } catch (error) {
        students[student[student.length - 1]] = [student[0]];
      }
    }
  }
  return [count, students];
}

function countStudents(path) {
  return new Promise((resolve, reject) => {
    const result = [];

    fs.readFile(path, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }
      let log;
      let database = data.toString();
      database = database.split('\n').slice(1);
      const [count, table] = extractStudentDetails(database);

      log = `Number of students: ${count}`;
      // console.log(log);
      result.push(log);

      for (const field of Object.keys(table)) {
        log = `Number of students in ${field}: ${table[field].length}. List: ${table[field].join(', ')}`;
        // console.log(log);
        result.push(log);
      }
      resolve(result);
    });
  });
}

const port = 1245;
const hostname = '127.0.0.1';

const app = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    const path = process.execArgv.length > 0 ? process.execArgv[0] : 'database.csv';
    const student = await countStudents(path);
    res.write('This is the list of our students\n');
    res.end(student.join('\n'));
  }
});

app.listen(port, hostname);

module.exports = app;
