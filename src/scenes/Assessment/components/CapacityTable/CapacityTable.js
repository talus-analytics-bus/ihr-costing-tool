import React, { Component } from 'react';
import styles from './CapacityTable.scss';
import { levels } from '../../../../lib/capacities';
import { CapacityTableHeaderCell } from './CapacityTableHeaderCell';
import { CapacityTableCell } from './CapacityTableCell';

export class CapacityTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeColumn: 0,
    };
  }


  capacityRows = () => {
    const name = (index) => `${levels[index] === 'None' ? 'No' : levels[index]} Capacity - ${index + 1}`;

    const rows = [
      {
        color: 'red',
      },
      {
        color: 'yellow',
      },
      {
        color: 'yellow',
      },
      {
        color: 'green',
      },
      {
        color: 'green',
      },
    ].map((row, index) => ({
      ...row,
      name: name(index)
    }))

    return rows.map((row, index) => ({
      ...row,
      values: this.props.activeCapacity.indicators.map((indicator) => {
        return (indicator.score_descriptions || [])[index + 1] || ''
      }),
    }))
  }

  handleHeaderCellClick = (activeColumn) => this.setState({activeColumn});

  handleCellClick = (row, column) => {
    this.props.setActiveCapacityLevel(this.props.activeCapacity.indicators[column].jee_id, row);
    this.setState({
      activeColumn: column
    });
  }

  componentWillReceiveProps(nextProps) {
    // reset if active capacity has changed
    if (nextProps.activeCapacity && nextProps.activeCapacity._id !== this.props.activeCapacity._id) {
      this.setState({
        activeColumn: 0
      });
    }
  }

  render() {
    return (
      <div className={styles.capacityTableContainer}>
        <h4>Choose a score for each indicator below based on {this.props.activeCountry.details.name || 'the country'}&#39;s current capacity, per the JEE assessment:</h4>
        <div>
          <div className={styles.capacityTable}>
            <div className={styles.capacityRow}>
              <CapacityTableHeaderCell/>
              {
                this.props.activeCapacity.indicators.map((indicator, index) =>
                  <CapacityTableHeaderCell
                    key={index}
                    active={this.state.activeColumn === index}
                    longText={indicator.name}
                    shortText={indicator.jee_id}
                    handleClick={() => this.handleHeaderCellClick(index)}
                  />
                )
              }
            </div>
            {
              this.capacityRows().map((capacityRow, index) =>
                <div className={styles.capacityRow} key={index}>
                  <div className={styles.capacityCell}><p>{capacityRow.name}</p></div>
                  {
                    capacityRow.values.map((c, cIndex) =>
                      <CapacityTableCell
                        key={cIndex}
                        active={this.state.activeColumn === cIndex}
                        checked={this.props.activeCapacity.indicators[cIndex].selectedLevel === index}
                        handleClick={(e) => this.handleCellClick(index, cIndex)}
                        text={c}
                      />
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
