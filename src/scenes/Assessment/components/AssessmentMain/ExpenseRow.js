import React, { Component } from 'react';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import styles from './AssessmentMain.scss';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

export class ExpenseRow extends Component {
  constructor(props) {
    super(props);

    console.log(props.expense);

    this.state = {
      ...props.expense.multipliers,
      sourceOpen: false
    };

  }

  nullHintText = (value) => {
    if (value) {
      return '';
    }
    return 'n/a';
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  toggleSource = () => {
    this.setState({
      sourceOpen: !this.state.sourceOpen,
    })
  }

  formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.props.activeCurrency.key || 'USD',
      minimumFractionDigits: 2,
    });

    return formatter.format(value || 0);
  }

  reset = () => {
    this.setState({
      ...this.props.expense.defaults,
    });
  }

  cancel = () => {
    this.reset();
    this.props.toggleEditingExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0]);
  }

  save = () => {
    this.props.changeValues(this.props.expense.expense_id, this.props.expense.sophistication_level[0], this.state);
  }

  render() {
    return (
      <div className={styles.expenseRow} key={this.props.expense.sophistication_level[0]}>
        <div className={styles.expenseRowSummary}>
          <div className={styles.expenseRowSelect}>
            <Checkbox
              checked={this.props.expense.selected}
              onCheck={() => this.props.selectExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0])}
            />
          </div>
          <div className={styles.expenseRowName}>{this.props.expense.sophistication_name}</div>
          <div className={`${styles.expenseRowCosts} ${styles.expenseCurrency}`}>
            {this.formatCurrency([
              this.state.cost || 0,
              this.state.duration || 1,
              this.state.staff || 1,
              this.state.area || 1,
              this.state.population || 1,
              this.state.facility || 1,
            ].reduce((acc, el) => acc * el, 1))}
          </div>
          <div className={`${styles.expenseRowCosts} ${styles.expenseCurrency}`}>
            {
              this.formatCurrency(
                this.state.multiplier_depreciation ?
                  [
                    this.state.cost || 0,
                    this.state.duration || 1,
                    this.state.staff || 1,
                    this.state.area || 1,
                    this.state.population || 1,
                    this.state.facility || 1,
                    this.state.depreciation || 0,
                  ].reduce((acc, el) => acc * el, 1)
                  : 0
              )
            }
          </div>
          <div className={styles.expenseRowAction}>
            {
              !this.props.expense.editing ?
                <RaisedButton
                  label="Edit"
                  onClick={() => this.props.toggleEditingExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0])}
                />
                : null
            }
          </div>
        </div>
        {
          this.props.expense.editing ?
            <Card>
              <CardText>
                <div className={styles.expenseRowForm}>
                  <div className={styles.expenseRowFormStartup}>
                    <div>
                      <TextField
                        floatingLabelText={this.props.expense.cost_unit}
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.cost}
                        hintText={this.nullHintText(this.state.cost)}
                        onChange={(e) => this.handleChange('cost', e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText={this.props.expense.cost_duration_unit}
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.duration}
                        hintText={this.nullHintText(this.state.duration)}
                        onChange={(e) => this.handleChange('duration', e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="staff"
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.staff}
                        hintText={this.nullHintText(this.state.staff)}
                        disabled={this.props.expense.multiplier_staff === null}
                        onChange={(e) => this.handleChange('staff', e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="area"
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.area}
                        hintText={this.nullHintText(this.state.area)}
                        disabled={this.props.expense.multiplier_area === null}
                        onChange={(e) => this.handleChange('area', e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="population"
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.population}
                        hintText={this.nullHintText(this.state.population)}
                        disabled={this.props.expense.multiplier_population === null}
                        onChange={(e) => this.handleChange('population', e.target.value)}
                      />
                    </div>
                    <div>
                      <TextField
                        floatingLabelText="facilities"
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.facility}
                        hintText={this.nullHintText(this.state.facility)}
                        disabled={this.props.expense.multiplier_facility === null}
                        onChange={(e) => this.handleChange('facility', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.expenseRowFormRecurring}>
                    <div>
                      <TextField
                        floatingLabelText="depreciation factor"
                        floatingLabelFixed={true}
                        className={styles.expenseRowInput}
                        value={this.state.depreciation}
                        hintText={this.nullHintText(this.state.depreciation)}
                        disabled={this.props.expense.multiplier_depreciation === null}
                        onChange={(e) => this.handleChange('depreciation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardText>
              <CardActions>
                <RaisedButton
                  label="Set to defaults"
                  onClick={this.reset}
                />
                <RaisedButton
                  label="Cancel"
                  onClick={this.cancel}
                />
                <RaisedButton
                  label="Confirm"
                  onClick={this.save}
                />
                <RaisedButton
                  label="View sources"
                  // onClick={this.toggleSource}
                  // onRequestClose={this.toggleSource}
                />
                <Popover
                  open={this.state.sourceOpen}
                >
                  <Card>
                    <CardText>
                      {this.props.expense.sources}
                    </CardText>
                  </Card>
                </Popover>
              </CardActions>
            </Card>

            :null
        }
      </div>
    );
  }
}
