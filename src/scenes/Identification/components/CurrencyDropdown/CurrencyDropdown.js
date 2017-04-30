import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import styles from './CurrencyDropdown.css';

export class CurrencyDropdown extends Component {
  render() {
    return (
      <div className={styles.currencyDropdown}>
        <p>
          What currency would you like to work with?
        </p>
        <DropDownMenu value={this.props.active} onChange={ (e, i, v) => this.props.handleChange(v) }>
          {
            this.props.currencies
              .map((currency) => (
                <MenuItem key={currency.key} value={currency.key} primaryText={`${currency.name} (${currency.key})`} />
              ))
          }
        </DropDownMenu>
      </div>
    )
  }
}
