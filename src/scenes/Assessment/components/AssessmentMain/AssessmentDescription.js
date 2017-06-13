import React, { Component } from 'react';

import { Peeper } from '../../../../components/Peeper/Peeper'

import styles from './AssessmentMain.scss';

export class AssessmentDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingDetails: false,
    }
  }

  handlePeeperToggle = (key) => {
    this.setState({
      [key]: !this.state[key],
    })
  }

  render() {
    return (
      <div className={styles.assessmentDescription}>
        <h1>{this.props.activeCapacity.name}</h1>
        <Peeper
          label="Capacity Description"
          show={this.state.showingDetails}
          togglePeeper={() => this.handlePeeperToggle('showingDetails')}
        >
          <div className={styles.assessmentDescriptionContent}>
            <div>
              <p>
                <b>Target: </b>
                {this.props.activeCapacity.target_description}
              </p>
            </div>
            {
              this.props.activeCapacity.as_measured_by
              ? <div>
                <p>
                  <b>As Measured By: </b>
                  {this.props.activeCapacity.as_measured_by}
                </p>
              </div>
              : ''
            }
            {
              this.props.activeCapacity.desired_impact
              ? <div>
                <p>
                  <b>Desired Impact: </b>
                  {this.props.activeCapacity.desired_impact}
                </p>
              </div>
              : ''
            }
            {
              this.props.activeCapacity.notes
              ? <div>
                <p>
                  <b>Additional Notes: </b>
                  {this.props.activeCapacity.notes}
                </p>
              </div>
              : ''
            }
          </div>
        </Peeper>
      </div>
    )
  }
}
