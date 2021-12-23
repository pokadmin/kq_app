import './App.css';
// import { useTable } from 'react-table'
import React, {Component} from 'react';
import {readRemoteFile} from "react-papaparse";

class App extends Component {
    state = {
        // initial state
        rows: [],
        columns: [],
        data: [],
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
            answerStatus: "You have not yet answered any questions. Click on the header to select an answer",
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
                <header className="App-header">
                    Something1 {this.state.answerStatus}
                    <div>
                        <h1>{(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][0]}.</h1>
                    </div>
                </header>
                <table>
                    <tr>
                        <td className="titles"> 1</td>
                        <td onClick={() => this.my_anwser_handler(1)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][1]}</td>
                    </tr>
                     <tr>
                        <td className="titles"> 2</td>
                        <td onClick={() => this.my_anwser_handler(2)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][2]}</td>
                    </tr>
                    <tr>
                        <td className="titles"> 3</td>
                        <td onClick={() => this.my_anwser_handler(0)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][3]}</td>
                    </tr>
                </table>


                <div>
                    <h1 onClick={() => this.my_anwser_handler(3)}>    {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[this.state.current_page][2]}.</h1>
                </div>
                <div>
                    <h1>  {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[0][3]}.</h1>
                </div>

                <div>
                    <h1>  {(this.state.rows.length < 1) ? "Nothing" : this.state.rows[0][4]}.</h1>
                </div>
                <div>
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
        this.setState({current_page: this.state.current_page + 1})
    }

    currentRow(row) {
        let original_ = row
        if (original_) {
            let explanation_ = row.original[7]
            let videos = row.original[8]
            let pods = row.original[9]
            // let review = row.original[10]

            this.setState({explanation: explanation_})
            return alert("Here is the explanation: \n" + explanation_ + "\nVideos: " + videos + "\nPodcasts" + pods);

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
