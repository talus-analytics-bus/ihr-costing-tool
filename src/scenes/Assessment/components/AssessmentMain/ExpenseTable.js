import React, {Component} from 'react';

import styles from './AssessmentMain.scss';
import {ExpenseRowActive} from './ExpenseRowActive';

export class ExpenseTable extends Component {
  // get unique expense id's and set this as expense groups
  expenseGroups = () => {
    return this.props.expenses.reduce((acc, expense) => {
      if (!acc.unique.hasOwnProperty(expense.expense_id)) {
        acc.unique[expense.expense_id] = true;
        acc.expenses = acc.expenses.concat([{
          id: expense.expense_id,
          name: expense.name,
        }]);
      }
      return acc;
    }, {
      unique: {}, // this keeps track of the unique id's
      expenses: [], // this is the list of expenses
    }).expenses;
  }

  // filters expenses by expense group
  expensesInGroup = (expenses, group) => expenses
    .filter((expense) => {
      const countryHasNoIntermediate2 = this.props.geoLevels["Level 3"].name === null;
      const expenseIsIntermediate2 = expense.multiplier_area === "level_3";
      const expenseIsApplicable = !countryHasNoIntermediate2 || !expenseIsIntermediate2;
      const inGroup = expense.expense_id === group;
      const showExpense = inGroup && expenseIsApplicable;

      return showExpense;
    });

  render() {
    return (
      <div className={styles.expenseTable}>
        {
          this.expenseGroups().map((group) =>
            <div key={group.id}>
              <p>
                {group.name}
              </p>
              {
                this.expensesInGroup(this.props.expenses, group.id)
                  .map((expense, index) =>
                    <ExpenseRowActive expense={expense} activeCurrency={this.props.activeCurrency} key={index} target={this.props.target} />
                  )
              }
            </div>
          )
        }
      </div>
    )
  }
}
