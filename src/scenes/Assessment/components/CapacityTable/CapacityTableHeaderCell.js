import React, { Component } from 'react';
import styles from './CapacityTable.scss';
import ReactTooltip from 'react-tooltip';

export class CapacityTableHeaderCell extends Component {
  isActive = () => this.props.hasOwnProperty('active') ? this.props.active : true;

  activeText = () => this.props.longText &&
  <div className={styles.capacityHeaderCellActive}>
    <div className={styles.capacityHeaderCellHeading}>{this.props.shortText}</div>
    <div className={styles.capacityHeaderCellText}>{this.props.longText}</div>
  </div>;

  inactiveText = () => this.props.shortText &&
  <div>
    <p
      data-tip
      data-for={this.props.shortText}
    >{this.props.shortText}</p>
    <ReactTooltip
      id={this.props.shortText}
    >
      {this.props.longText}
    </ReactTooltip>
  </div>
  ;

  render() {
    return (
      <div
        className={`${styles.capacityHeaderCell} ${!this.isActive() ? styles.capacityCellInactive : null}`}
        onClick={this.props.handleClick}
      >
        {
          this.isActive() ?
            this.activeText() :
            this.inactiveText()
        }
      </div>
    );
  }
}
