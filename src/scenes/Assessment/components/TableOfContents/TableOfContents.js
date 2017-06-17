import React, { Component } from 'react';

import { CapacityProgress } from './CapacityProgress.js';

import activeImage from '../../../../images/active.png';
import xMarkImage from '../../../../images/x.png';
import checkMarkImage from '../../../../images/check.png';
import arrowImage from '../../../../images/chevron_right.png';

import styles from './TableOfContents.scss';

class Capacity extends Component {
  isCurrent = () => this.props.active.capacity === this.props.capacityIndex && this.props.active.core === this.props.coreIndex;

  // determines icon
  imageSrc = (stage) => {
    const sameCapacityIndex = this.props.active.capacity === this.props.capacityIndex;
    const sameCoreCapacityIndex = this.props.active.core === this.props.coreIndex;
    const sameStage = this.props.active.stage === stage;
    const isActive = sameCapacityIndex && sameCoreCapacityIndex && sameStage;

    if (isActive) {
      return activeImage;
    }

    const isCompleted = this.props.capacity[`complete_${stage || 'assessment'}`] || false;

    if (isCompleted) {
      return checkMarkImage;
    }

    return xMarkImage;
  }

  render() {
    return (
      <div
        className={`${styles.capacity} ${this.props.active.capacity === this.props.capacityIndex && this.props.active.core === this.props.coreIndex ? styles.activeCapacity : null}`}
        onClick={() => this.props.goToCapacity(this.props.coreIndex, this.props.capacityIndex)}
      >
        {
          (this.props.active.capacity === this.props.capacityIndex && this.props.active.core === this.props.coreIndex)
            ? <img alt='Active capacity' className={styles.arrowImage} src={arrowImage} />
            : ''
        }
        <p>{this.props.capacity.name}</p>
        {
          this.isCurrent() &&
          <div className={styles.capacityChildContainer}>
            <div className={`${styles.capacityChild} ${this.props.capacity.stage === 'assessment' ? styles.ccActive : null}`}>
              <img
                alt=''
                className={styles.completeIcon}
                src={this.imageSrc('assessment')}
                onClick={() => true}
              />
              <span>Assessment</span>
            </div>
            <div className={`${styles.capacityChild} ${this.props.capacity.stage === 'costing' ? styles.ccActive : null}`}>
              <img
                alt=''
                className={styles.completeIcon}
                src={this.imageSrc('costing')}
                onClick={() => true}
              />
              <span>Costing</span>
            </div>
          </div>
        }

      </div>
    )
  }
}

class IndicatorGroup extends Component {
  render() {
    return (
      <div className={styles.indicatorGroup}>
        <div className={styles.indicatorTitle}>
          {this.props.indicator.name}
        </div>
        <div className={`${styles.capacities} ${this.props.indicator.capacities.length === 0 ? styles.capacitiesEmpty: null}`}>
          {
            this.props.indicator.capacities.map((capacity, index) =>
              <Capacity
                capacity={capacity}
                key={index}
                active={this.props.active}
                coreIndex={this.props.coreIndex}
                capacityIndex={index}
                goToCapacity={this.props.goToCapacity}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export class TableOfContents extends Component {
  render() {
    return (
      <div className={styles.tableOfContents}>
        <CapacityProgress entries={this.props.entries} />
        <div>
          {
            this.props.entries.map((indicator, index) =>
              <IndicatorGroup
                indicator={indicator}
                key={index}
                active={this.props.active}
                coreIndex={index}
                goToCapacity={this.props.goToCapacity}
              />
            )
          }
        </div>
      </div>
    )
  }
}
