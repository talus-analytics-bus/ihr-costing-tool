import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import styles from './GeoLevels.css';

export class GeoLevels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'Level 1': null,
      'Level 2': null,
      'Level 3': null,
      'Level 4': null,
    }
  }

  handleChange = (event, key) => {
    this.setState({
      [key]: event.target.value,
    })
  }

  geoLevel = (key) => {
    return (

      <div className={styles.geoLevel}>
        <div className={styles.geoLevelRow}>
          <p>{key}</p>
        </div>
        <div className={styles.geoLevelName}>
          <p>{ this.props.geoLevels[key].name }</p>
        </div>
        <div className={styles.geoLevelCount}>
          {
          !this.props.geoLevels[key].editing && (
            <p
              className={styles.geoLevelCountNumber}
            >
              { this.props.geoLevels[key].value && Number(this.props.geoLevels[key].value).toLocaleString() }
            </p>
          )
        }
        {
          this.props.geoLevels[key].editing && (
            <TextField defaultValue={this.props.geoLevels[key].value || 0} onChange={(e) => this.handleChange(e, key)}/>
          )
        }
        </div>
        <div className={styles.geoLevelAction}>
          <RaisedButton
            className={styles.geoLevelActionButton}
            label={this.props.geoLevels[key].editing ? 'Save' : 'Modify'}
            onClick={() => this.props.toggleEdit(`geo_${key}`, this.props.geoLevels[key].editing, this.state[key])}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.geoLevels}>
        <div className={`${styles.geoLevel} ${styles.geoLevelHeadings}`}>
          <div className={styles.geoLevelRow}>
            <p>Geographic Level</p>
          </div>
          <div className={styles.geoLevelName}>
            <p>Name</p>
          </div>
          <div className={styles.geoLevelCount}>
            <p>Approximate Count</p>
          </div>
          <div className={styles.geoLevelAction}>
            &nbsp;
          </div>
        </div>
        {
          Object.keys(this.props.geoLevels)
            .map(this.geoLevel.bind(this))
        }
      </div>
    )
  }
}