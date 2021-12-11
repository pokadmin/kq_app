import './App.css';
// import { useTable } from 'react-table'
import React, {Component} from 'react';
import {readRemoteFile} from "react-papaparse";

class App extends Component {
    constructor(props) {
        // Call super class
        super(props);

        // Bind this to function updateData (This eliminates the error)
        this.updateData = this.updateData.bind(this);
    }

    q1_url = "https://raw.githubusercontent.com/pokadmin/kq_app/t4_import_data_and_view/src/data/cleaned_questions_set_1.tsv"
    question_set_urls = [this.q1_url]

    componentDidMount() {
        readRemoteFile(this.question_set_urls[0], {
            complete: this.updateData
        });
    }

    updateData(result) {
        const data = result.data;
        // Here this is available and we can call this.setState (since it's binded in the constructor)
        this.setState({data: data}); // or shorter ES syntax: this.setState({ data });
        console.debug(data)
        console.log(data)
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">

                </header>
            </div>
        );
    }
}

export default App;
