import React, { Component } from 'react';

import styles from './AssessmentMain.css';
import { Link } from 'react-router-dom';
import { AssessmentDescription } from './AssessmentDescription';
import { CapacityTable } from './CapacityTable';
import RaisedButton from 'material-ui/RaisedButton';
import { Costing } from './Costing';

export class AssessmentMain extends Component {


  render() {
    if (this.props.activeCapacity) {
      return (
        <div className={styles.assessmentMain}>
          <AssessmentDescription activeCapacity={this.props.activeCapacity} />
          {
            this.props.activeStage === 'assessment' ?
              <CapacityTable
                activeCapacity={this.props.activeCapacity}
                setActiveCapacityLevel={this.props.setActiveCapacityLevel}
                activeCountry={this.props.activeCountry}
              /> :
              <Costing
                activeCapacity={this.props.activeCapacity}
                activeCurrency={this.props.activeCurrency}
              />
          }
          <div className={styles.assessmentAction}>
            <RaisedButton
              className={styles.backButton}
              primary={true}
              label="Previous Capacity"
              onClick={() => this.props.prevStep(this.props.assessmentFirst)}
            />
             <RaisedButton
              className={styles.submitButton}
              primary={true}
              label="Proceed to Costing"
              onClick={() => this.props.nextStep(this.props.assessmentFirst)}
            />
          </div>
          <div className={styles.resultsButtonContainer}>
            <RaisedButton
              className={styles.resultsButton}
              primary={true}
              label="Go to Results Page"
              containerElement={<Link to="/results/" />}
            />
          </div>
        </div>
      )
    }
    return <div></div>;
  }
}
