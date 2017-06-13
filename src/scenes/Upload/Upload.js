import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import styles from './Upload.css';

export class Upload extends Component {
  render() {
    return (
      <div className={styles.upload}>
        <div>
          <h1>Enter Current JEE Assessment Scores</h1>
          <h4>
            Choose a method below to enter current JEE assessment scores. Scores can be added by uploading a report file or by entering scores manually.
          </h4>
        </div>
        <div className={styles.buttonGroup}>
          <p>To upload a report, review the required format <a href="#">here</a> and then select a file using the button below</p>
          <div>
            <RaisedButton className={styles.uploadButton} label="Select a File" primary={true} />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <p>Or, continue to options for manual score entry</p>
          <div>
            <RaisedButton
              className={styles.noUploadButton}
              label="Enter Assessments Manually"
              primary={true}
              containerElement={<Link to="/start/" />}
            />
          </div>
        </div>
      </div>
    )
  }
}
