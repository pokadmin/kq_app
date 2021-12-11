import './App.css';
// import { useTable } from 'react-table'
import React, { Component } from 'react';
import {parse} from "papaparse";
import {readRemoteFile} from "react-papaparse";

class App extends Component {

    constructor(props) {
        // Call super class
        super(props);

        // Bind this to function updateData (This eliminates the error)
        this.updateData = this.updateData.bind(this);
    }
    componentDidMount() {

        // Your parse code, but not seperated in a function
        let csvFilePath ="./data/cleaned_questions_set_1.tsv"
      //  let csvFilePath_req = require(csvFilePath);
      //  let csvFilePath ="./data/cleaned_questions_set_1.csv"
        // eslint-disable-next-line
        let csvFileString = "Question\t1Right Answer\t2\t3\t4\t5\t6\t1b\t2b\tExplanation\tLink\tContributor\tVerifier\tVerified\n" +
            "1 - What is path of knowledge? What is its goal?\tIt is one of the spiritual paths where goal is destruction of ignorance.\tWe get all wishes fulfilled here, that is the only goal\tIt is a lifestyle, where knowledge is gained for success.\tIt is a way which leads to liberation of the person.\tIt is a useless activity, only superstition nothing else\tA path to obtain knowledge of the entire existence. It's goal is knowledge in and of itself.\tThree kinds of knowledge is the goal\tIt is the highest path for a seeker. It leads directly to the truth of nothingness. Empowers to drop all unverified beliefs. It's goal is to conduct actions in full awarness without being influenced by it's infulences. Remaining as a blissful witness to all events as they happen. Realisation for non-doership.\t\thttps://oormi.in/pokp/program.php?vid=2&user=Guest&step=2#vidcontent\t\tMuni\tVerified\n" +
            "2 - What is knowledge?\tWhen interrelations are formed between experiences that are logical and consistent,  results in knowledge . Knowledge and information are different in that knowledge is obtained via direct experience and logic, while information can be obtained through sources other than our direct experience and logic, such as books or Gurus.\tInformation that can be trusted is knowledge \tKnowledge is information gained by reading textbooks, scriptures.\tknowledge is information gained directly from authentic sources like scientists, experts etc.\tWhatever Guru says is knowledge.\tWhatever the education system teaches is knowledge \t\tTranslation of experiential information to form memory . It's helpful for survival. Knowlegde of earlier experience assits in sustaining & further evolving of layers.\tInterrelations of Experience organized in memory is the definition of knowledge in the Path of Knowledge program. Knowledge and information are different in that knowledge is obtained via direct experience and logic, while information can be obtained through sources other than our direct experience and logic, such as books or Gurus.\thttps://oormi.in/pokp/program.php?vid=4&user=Guest&step=2#vidcontent\tPandurang \tMuni\tVerified\n"
    readRemoteFile('https://raw.githubusercontent.com/pokadmin/kq_app/t4_import_data_and_view/src/data/cleaned_questions_set_1.tsv', {
      complete: this.updateData
    });
    //     parse(csvFilePath, {
    //         download: true,
    //         header: true,
    //         skipEmptyLines: true,
    //         delimiter: '\t',
    //         newline: '\n',
    //         // Here this is also available. So we can call our custom class method
    //         complete: this.updateData
    // });
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
