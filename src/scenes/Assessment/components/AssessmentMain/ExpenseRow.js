import React, {Component} from 'react';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './AssessmentMain.scss';
import { ExpenseRowEdit } from './ExpenseRowEdit';

import { getStartupCosts, getRecurringCost, getConvertedCost } from '../../../../lib/costing';
import { valueAsCurrency } from '../../../../lib/util';

export class ExpenseRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.expense.multipliers,
      sourceOpen: false,
      // apply exchange rate to cost
      cost: getConvertedCost(props.expense.multipliers.cost, props.activeCurrency),
    };
  }

  getStartup = () => getStartupCosts(this.state);

  getRecurring = () => getRecurringCost(this.state);

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

  formatCurrency = (value) => valueAsCurrency(value, this.props.activeCurrency);

  reset = () => {
    this.setState({
      ...this.props.expense.defaults,
    });
    /* And apply exchange rate */

  }

  cancel = () => {
    this.reset();
    this.props.toggleEditingExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0], this.props.expense.sophistication_name);
  }

  save = () => {
    this.props.changeValues(this.props.expense.expense_id, this.props.expense.sophistication_level[0], this.props.expense.sophistication_name, this.state, this.props.target);
  }


  render() {

    return (
      <div className={styles.expenseRow} key={this.props.expense.sophistication_level[0]}>
        <div className={styles.expenseRowSummary}>
          <div className={styles.expenseRowName}>
            <Checkbox
              checked={this.props.expense.selected}
              label={this.props.expense.sophistication_name}
              onCheck={() => this.props.selectExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0], this.props.target)}
            />
            </div>
          <div className={`${styles.expenseRowCosts} ${styles.expenseCurrency}`}>
            {this.formatCurrency(this.getStartup())}
          </div>
          <div className={`${styles.expenseRowCosts} ${styles.expenseCurrency}`}>
            {this.formatCurrency(this.getRecurring())}
          </div>
          <div className={styles.expenseRowAction}>
            {
              this.props.expense.editing ||
                <RaisedButton
                  label="Edit"
                  onClick={() => this.props.toggleEditingExpense(this.props.expense.expense_id, this.props.expense.sophistication_level[0], this.props.expense.sophistication_name)}
                />
            }
          </div>
        </div>
        {
          this.props.expense.editing &&
            <ExpenseRowEdit
              expense={this.props.expense}
              currentState={this.state}
              handleChange={this.handleChange}
              handleReset={this.reset}
              handleCancel={this.cancel}
              handleSave={this.save}
              handleSource={this.toggleSource}
            />
        }
      </div>
    );
  }
}
