import React, { Component } from 'react';
import {Peeper} from "../../../../components/Peeper/Peeper";
import { ExpenseTable } from './ExpenseTable';

export class Costing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peep: this.props.activeCapacity.indicators.reduce((prev, indicator) => {
        prev[indicator.jee_id] = false;
        return prev;
      }, {})
    }
  }

  handlePeep = (key) => {
    this.setState({
      peep: {
        ...this.state.peep,
        [key]: !this.state.peep[key]
      }
    })
  }

  render() {

    return (
      <div>
      {
        this.props.activeCapacity.indicators.map((indicator, index) =>
        <Peeper
          label={`Indicator ${index + 1} of ${this.props.activeCapacity.indicators.length}: ${indicator.name}`}
          show={this.state.peep[indicator.jee_id]}
          togglePeeper={() => this.handlePeep(indicator.jee_id)}
        >
          <div>
            <p>Current Capacity: <strong>({(indicator.selectedLevel || 0) + 1})</strong></p>
            <p>Upgrade capacity to <strong>({(Math.min(indicator.selectedLevel || 0) + 2, 5)})</strong></p>
          </div>
          <ExpenseTable expenses={indicator.expenses} />
        </Peeper>
        )
      }
      </div>
    )
  }
}
