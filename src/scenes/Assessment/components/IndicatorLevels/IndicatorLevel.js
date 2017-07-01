import React, { Component } from 'react';
import styles from './IndicatorLevels.scss';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

const styleMap = [
  'danger',
  'warning',
  'warning',
  'success',
  'success',
];

export class IndicatorLevel extends Component {
  levelStyle = (index) => styles[styleMap[index] || 'none'];

  render() {
    return (
      <Chip
        className={`${styles.indicatorLevel} ${this.levelStyle(this.props.index)}`}
      >
        <Avatar
          className={styles.indicatorLevelNumber}
        >{this.props.index + 1}</Avatar>
        {this.props.label}
      </Chip>
    );
  }
}
