import React, { Component } from 'react';

import styles from './CountryPicker.css';
import {CountryDropdown} from "../CountryDropdown/CountryDropdown";
import {CurrencyDropdown} from "../CurrencyDropdown/CurrencyDropdown";
import { Api } from '../../../../data/api';

import {MapPicker} from "../MapPicker/MapPicker";

export class CountryPicker extends Component {
  componentDidMount() {
    Promise.all([
      Api.fetchCountries()
      .then((countries) => {
        this.props.populateCountries(countries);
      }),
      Api.fetchCurrencies()
        .then((currencies) => {
          this.props.populateCurrencies(currencies);
        }),
      Api.fetchMap()
        .then((countryMap) => {
          this.props.populateCountryMap(countryMap);
        }),
      ])
      .then(() => {
        this.selectCountry('US');
      })
  }

  getCurrencyOfCountry = (countryCode) => {
    const country = this.props.countries.find((c) => c.abbreviation === countryCode);

    return this.props.currencies
      .find((currency) => currency.key === country.currency).key;
  }

  getCountryDetails = (countryCode) => {
    return this.props.countries.find((c) => c.abbreviation === countryCode);
  }

  selectCountry = (countryCode) => {
    this.props.onCountrySelect(countryCode, this.getCurrencyOfCountry(countryCode), this.getCountryDetails(countryCode));
  }

  render() {
    return (
      <div className={styles.countryPicker}>
        <h2>Create Your Profile</h2>
        <div className={styles.countryPickerContent}>
          <div className={styles.countryPickerSelect}>
            <CountryDropdown
              handleChange={this.selectCountry}
              countries={this.props.countries}
              active={this.props.activeCountry}
            />
            <CurrencyDropdown
              handleChange={this.props.onCurrencySelect}
              currencies={this.props.currencies}
              active={this.props.activeCurrency}
            />
          </div>

          <MapPicker
            activeCountry={this.props.activeCountry}
            countryMap={this.props.countryMap}
            handleChange={this.selectCountry}
          />
        </div>
      </div>
    )
  }
}