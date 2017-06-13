import React, { Component } from 'react';

import styles from './ManualAssessment.css';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

export class ManualAssessment extends Component {
  render() {
    return (
      <div>
        <h1>Enter JEE scores manually</h1>
        <h4>
          Choose a method below to enter JEE indicator scores.
        </h4>
        <div>
          <RadioButtonGroup
            name="assessFirst"
            valueSelected={this.props.manual.assessmentFirst}
            onChange={(e) => this.props.setAssessmentFirst(e.target.value)}
          >
            <RadioButton
              className={styles.radioButton}
              value={true}
              label="Enter scores for all indicators; then cost all indicators"
            />
            <RadioButton
              className={styles.radioButton}
              value={false}
              label="Enter scores and cost for each indicator sequentially"
            />
          </RadioButtonGroup>
        </div>
        <div className={styles.continueButtonContainer}>
          <RaisedButton
            primary={true}
            label="Start"
            containerElement={<Link to="/assessment/" />}
          />
        </div>
      </div>
    );
  }
}