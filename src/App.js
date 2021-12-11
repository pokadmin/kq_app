import React, { Component } from 'react';
import { readRemoteFile } from 'react-papaparse';

export default class App extends Component {
  handleClick = () => {
    readRemoteFile('https://raw.githubusercontent.com/pokadmin/kq_app/main/src/data/cleaned_questions_set_1.tsv', {
      complete: (results) => {
        console.log('Results:', results);
      },
    });
  };

  render() {
    return <button onClick={this.handleClick}>readRemoteFile</button>;
  }
}
