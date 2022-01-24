import './App.css'
import './bootstrap.min.css'
import React, {Component} from 'react';
import {readRemoteFile} from "react-papaparse";

function shuffle(arr) {
  arr = [...arr]
  const shuffled = []
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length)
    shuffled.push(arr.splice(rand, 1)[0])
  }
  return shuffled
}

const correct_answer_response_text = " is Correct!"
const incorrect_answer_response_text = " is Incorrect!"
const shared_answer_response_text = "Your Score is "

const answerStatus = "You have not yet answered any questions. Click a button A to F to select an answer";

class App extends Component {
  state = {
    // initial state
    rows: [],
    columns: [],
    data: [],
    randomized_row: [],
    potentialAnswers: [],
    current_page: 0,
    correctIndex: -1,
    guess_count: 0,
    correct_count: 0,
    explanation: "No explanation",
    videos: "No Videos",
    pods: "No Podcasts",
    answerStatus: answerStatus,
    show_result: false,
    result_text: "No results yet",
    is_correct: false,

  }

  componentDidMount() {

    this.setState({
      rows: [[]],
      data: [],
      ordered_answers: [],
      random_answers: [],
      random_mapping: [],
      current_row: [],
      current_page: 0,
      explanation: "No explanation",
      videos: "No Videos",
      pods: "No Podcasts",
      answerStatus: answerStatus,
      show_result: false,
      is_correct: false,
    })

    const DATA_URL_GITHUB_MAIN = "https://raw.githubusercontent.com/pokadmin/kq_app/main/public/data/cleaned_questions_set_1.tsv"
    readRemoteFile(DATA_URL_GITHUB_MAIN, {
      complete: (results) => {
        console.log('Results from: [' + DATA_URL_GITHUB_MAIN + ']', results);

        this.setState({
          // update state
          rows: results.data,
          data: results,
          current_page: 0,
          answerStatus: answerStatus,

        });
        this.go_to_page(0)
      },
    })


  }

  render() {
    return (
      <div className="container mt-3"  style={{backgroundColor:"#eee"}}>
         <h2>Knowledge Quiz</h2>
          <p>Click a button A to F to select an answer</p>
          <div  className="d-flex p-3 bg-white text-dark" style={{marginBottom:10}}>
            <h3 style={{textAlign: "center"}}>
              {/*This is the question*/}
              {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][0]}
            </h3>
          </div>


        <div className="Tutoring">
          <table style={{margin: 20, minHeight: 300, height: 300, verticalAlign: "bottom"}}>
            <tbody>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(1)}> A</button>
              </td>
              <td> {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[0]}</td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(2)}> B</button>
              </td>
              <td
                onClick={() => this.answerHandler(1)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[1]}</td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(3)}> C</button>
              </td>
              <td
                onClick={() => this.answerHandler(3)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[2]}</td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(4)}> D</button>
              </td>
              <td
                onClick={() => this.answerHandler(4)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[3]}</td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(5)}> E</button>
              </td>
              <td
                onClick={() => this.answerHandler(5)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[4]}</td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.answerHandler(6)}> F</button>
              </td>
              <td
                onClick={() => this.answerHandler(6)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.randomized_row[5]}</td>
            </tr>
            </tbody>
          </table>

          <div>
            <button onClick={() => this.previousPage()}>Previous Page</button>
            <button onClick={() => this.nextPage()}>Next Page</button>
          </div>
          <div>
            Current page
            is {this.state.current_page} of {(this.state.rows.length < 1) ? "Unknown" : this.state.rows.length}
          </div>
          <div>
            Change page to: <textarea onChange={(event => this.textToPage(event))}>55</textarea> (Then
            Previous Page or Next Page to work around bug)
          </div>
          <div>
            <h1>  {this.state.answerStatus}</h1>
          </div>

        </div>
        <div className="Result" hidden={this.state.show_result === false}>
          <div><h2>-----------------------</h2></div>
          <div><h2>Result from your last answer: {this.state.result_text}</h2></div>
          <div><h2>Explanation:</h2></div>
          <div><h2>{this.state.explanation}</h2></div>
          <div><a href={this.state.videos}> Video </a></div>
          <div><a href={this.state.pods}> Podcast</a></div>
          <div>
            <button onClick={() => this.state.is_correct ? this.nextPage() : this.setState({
              show_result: false,
              result_text: "No result"
            })}>
              {this.state.is_correct ? "Next Questions" : "Clear Result"}</button>
          </div>


        </div>
      </div>
    )
  }

  nextPage() {
    if (this.state.current_page < (this.state.rows.length - 1)) {
      let new_current_page = this.state.current_page + 1
      let randomized_row = this.setCurrentRow(this.state.rows[new_current_page])
      this.setState({current_page: new_current_page, randomized_row: randomized_row, show_result: false})
    } else {
      return alert("You are on the last page");
    }
  }

  go_to_page(target_page: Number) {
    if (target_page < this.state.rows.length && (target_page > -1)) {
      let new_current_page = target_page
      let randomized_row = this.setCurrentRow(this.state.rows[new_current_page])
      this.setState({current_page: new_current_page, randomized_row: randomized_row, show_result: false})
    } else {
      return alert("Not a valid page select between 0 and " + (this.state.rows.length - 1));
    }
  }

  previousPage() {
    if (this.state.current_page > 0) {
      let new_current_page = this.state.current_page - 1
      let randomized_row = this.setCurrentRow(this.state.rows[new_current_page])
      this.setState({current_page: new_current_page, randomized_row: randomized_row, show_result: false})
    } else {
      return alert("You are on the first page");

    }
  }

  setCurrentRow(row: []) {
    if (row) {
      let explanation = row[7]
      let videos = row[8]
      let pods = row[9]
      let ordered_answers: [] = row.slice(1, 7)
      // let review = row.original[10]
      //let answers_length = ordered_answers.length;
      let random_answers = []
      let random_mapping = [0, 1, 2, 3, 4, 5]
      // random_mapping.forEach((element, index, array) => {
      //     array.push(index)
      // })
      random_mapping = shuffle(random_mapping)
      for (let i = 0; i < random_mapping.length; i++) {
        random_answers.push(ordered_answers[random_mapping[i]])
      }


      this.setState({
        explanation: explanation,
        ordered_answers: ordered_answers,
        random_answers: random_answers,
        random_mapping: random_mapping,
        current_row: row,
        videos: videos,
        pods: pods
      })
      return random_answers
    }
  }

  answerHandler(id) {
    // Zero is the position of the correct answer in the original order of the questions. Then we randomize the answers.
    // We keep the order we randomized them in random_mapping
    let isCorrect = (0 === this.state.random_mapping[id - 1])
    let guess_count_ = this.state.guess_count + 1
    let correct_count_ = this.state.correct_count
    let letter_guess = String.fromCharCode(64 + id)
    if (isCorrect) {
      correct_count_ = correct_count_ + 1
    }
    let result_text = isCorrect ? letter_guess + correct_answer_response_text : letter_guess + incorrect_answer_response_text;
    //let percent = (correct_count_ / guess_count_) * 100
    let answerStatus_ = shared_answer_response_text + correct_count_ + "/ " + guess_count_
    this.setState({
      guess_count: guess_count_,
      answerStatus: answerStatus_,
      correct_count: correct_count_,
      show_result: true,
      result_text: result_text,
      isCorrect: isCorrect,
    })
    return alert(result_text + "\nExplanation : \n" + this.state.explanation);
  }

  textToPage(param) {
    let readValue = param.target.value;
    let page_number = Number(readValue);
    if ((this.state.rows.length > 0) && (page_number < this.state.rows.length)) {
      this.setState(
        {
          current_page: page_number
        })
    }
  }
}

export default App
