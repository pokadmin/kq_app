import './App.css';
// import { useTable } from 'react-table'
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
class App extends Component {
    state = {
        // initial state
        rows: [],
        columns: [],
        data: [],
        randomized_row:[],
        potentialAnswers: [],
        current_page: 0,
        correctIndex: -1,
        guess_count: 0,
        correct_count: 0,
        explanation: "No explanation",
        links: "no links",
        answerStatus: "You have not yet answered any questions. Click on the header to select an answer",

    }

    componentDidMount() {

        this.setState({
            rows: [[]],
            data: [],
            current_page: 0,
            explanation: "No explanation",
            links: "no links",
            answerStatus: "You have not yet answered any questions. Click a button A to F to select an answer",
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

                    explanation: "No explanation",
                    links: "no links",
                    answerStatus: "You have not yet answered any questions. Click on the header to select an answer",
                });
            },
        })


    }

    render() {
        return (
            <div className="App">
                <header className="App-header" style={{maxHeight:150,minHeight:150}}>
                    <div>
                        <h2 style={{verticalAlign:"bottom"}}>
                            {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][0]}
                        </h2>
                    </div>
                </header>
                <table style={{ minHeight:300,height:300, verticalAlign:"bottom"}}>
                    <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(1)}> A</button>
                        </td>
                        <td> {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][1]}</td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(2)}> B</button>
                        </td>
                        <td onClick={() => this.my_anwser_handler(1)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][2]}</td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(3)}> C</button>
                        </td>
                        <td onClick={() => this.my_anwser_handler(3)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][3]}</td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(4)}> D</button>
                        </td>
                        <td onClick={() => this.my_anwser_handler(4)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][4]}</td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(5)}> E</button>
                        </td>
                        <td onClick={() => this.my_anwser_handler(5)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][5]}</td>
                    </tr>
                      <tr>
                        <td>
                            <button onClick={() => this.my_anwser_handler(6)}> F</button>
                        </td>
                        <td onClick={() => this.my_anwser_handler(6)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][6]}</td>
                    </tr>
                </table>

                <div>
                    <button onClick={() => this.previousPage()}> Pevious Page</button>
                     <button onClick={() => this.nextPage()}> Next Page</button>
                </div>
                <div>
                    <h1>  {this.state.answerStatus}</h1>
                </div>
            </div>
        )
            ;
    }

    nextPage() {
        if (this.state.current_page <  (this.state.rows.length-1)) {
            let new_current_page = this.state.current_page + 1
            let randomized_row =  this.setCurrentRow(this.state.rows[new_current_page])

            this.setState({current_page:new_current_page,randomized_row:  randomized_row})
        }else {
          return alert("You are on the last page");
        }
    }
    previousPage() {
        if (this.state.current_page > 0) {
            this.setState({current_page: this.state.current_page -1 })

        } else {
          return alert("You are on the first page");

        }
    }

    setCurrentRow(row:[]) {
        if (row) {
            let explanation = row[7]
            let videos = row[8]
            let pods = row[9]
            let ordered_answers = row.slice(1,7)
            // let review = row.original[10]
            var answers_length = ordered_answers.length;
            let random_answers= Array()
            let random_mapping= Array()
            random_mapping.forEach((element, index,array) => { array.push(index)} )
            shuffle(random_mapping)
            random_answers.forEach((element, index,array,random_mapping,ordered_answers) =>
            { array.push(ordered_answers[random_mapping[index]])} )

            this.setState({explanation: explanation})
           // return alert("Here is the explanation: \n" + explanation + "\nVideos: " + videos + "\nPodcasts" + pods);

        }
    }

    my_anwser_handler(id) {
        let isCorrect = ("1" === String(id))
        let guess_count_ = this.state.guess_count + 1
        let correct_count_ = this.state.correct_count
        if (isCorrect) {
            correct_count_ = correct_count_ + 1
        }
        let percent = (correct_count_ / guess_count_) * 100
        let answerStatus_ = "You have " + correct_count_ + " correct answers and have guessed " + guess_count_ + " times. You are " + percent + "%  enlightened by our calculation"
        this.setState({guess_count: guess_count_, answerStatus: answerStatus_, correct_count: correct_count_})

        return alert(isCorrect ? String(id) + " is Correct!" + answerStatus_ : String(id) + " is WRONG!" + answerStatus_ + "\n  click on the row for an explanation.");
    }

}
export default App
