import React, { Component } from 'react';

import AVPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import styles from './Peeper.css';

export class Peeper extends Component {
  render() {
	  if (this.props.bold) {
		return (
		  <div
			className={`${styles.peeper} ${this.props.show ? styles.peeperActive: null}`}
		  >
			<div
			  className={styles.peeperLabel}
			  onClick={this.props.togglePeeper}
			>
			  <AVPlayArrow/>
			  <h3>{this.props.label}</h3>
			</div>
			<div className={styles.peeperContent}>
			{this.props.children}
			</div>
		  </div>
		);
	  } else {
		 return (
		  <div
			className={`${styles.peeper} ${this.props.show ? styles.peeperActive: null}`}
		  >
			<div
			  className={styles.peeperLabel}
			  onClick={this.props.togglePeeper}
			>
			  <AVPlayArrow/>
			  <h3>{this.props.label}</h3>
			</div>
			<div className={styles.peeperContent}>
			{this.props.children}
			</div>
		  </div>
		); 
	  }
  }
}
