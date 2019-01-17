import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Budget, BudgetService } from './budget.service';
import { DisplayNotificationService } from './display.notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  title = 'Monthly Budget Diary';

  public options = {
    position: ['bottom', 'right'],
    timeOut: 15000,
    lastOnBottom: false,
    rtl: false
  };

  //variable to hold error message
  errorMessage: any;

  // variable to hold all the budget details
  budgetData: Budget[]

  // variable to hold budget details
  budget = new Budget();

  // variable to hold expense types
  expenseTypes = ['Debit', 'Credit'];

  // variable to hold user list
  usersList = new Array();

  // variable to hold user list
  servicesList = new Array();

  // Flag to change the state of the navigation menu in case of responsive mode.
  responsiveNavMenuFlag = false;

  // Flag to hold loader status
  loading = true;

  // variable to hold credit amount
  creditAmount: number = 0;

  // variable to hold debit amount
  debitAmount: number = 0;

  constructor(private budgetService: BudgetService, private displayNotificationService: DisplayNotificationService) { }

  ngOnInit() {
    this.budget.paidDate = new Date();
    this.getMetadata();
  }

  /**
   * Method to load data from store
   */
  getMetadata() {
    this.budgetService.getUsers().subscribe(
      response => {
        this.usersList = Array.from(response);
      },
      error => () => {
        this.loading = false;
        console.log('Error in loading users from data store.', error);
        this.displayNotificationService.showToastNotification('Error in loading users from data store.', 'error');
      });

    this.budgetService.getServices().subscribe(
      response => {
        this.servicesList = Array.from(response);
      },
      error => () => {
        this.loading = false;
        console.log('Error in loading services from data store.', error);
        this.displayNotificationService.showToastNotification('Error in loading services from data store.', 'error');
      });

    this.budgetService.getPaymentDetails().subscribe(
      response => {
        this.budgetData = Array.from(response);
        this.budgetData.forEach(payment => {
          this.calculateTotals(payment)
        })
        this.loading = false;
      },
      error => () => {
        this.loading = false;
        console.log('Error in loading payment details from data store.', error);
        this.displayNotificationService.showToastNotification('Error in loading payment details from data store.', 'error');
      });
  }

  /**
   * Method to add payment details in store
   */
  submit() {
    if (this.budget.paidBy && this.budget.paidTo && this.budget.expenseType) {
      this.budgetService.addPaymentDetails(this.budget).subscribe(
        response => {
          this.budgetData.push(Object.assign({}, this.budget));
          this.calculateTotals(this.budget)
          this.displayNotificationService.showToastNotification('Successfully added payment details!!!', 'success');
        },
        error => () => {
          console.log('Error something went wrong in the service', error);
          this.displayNotificationService.showToastNotification('Error in adding payment details in data store.', 'error');
        }
      );
    } else {
      this.displayNotificationService.showToastNotification('Please select Paid By, Paid To and Expense Type.', 'warning');
    }
  }

  /**
 * Method to open / close the navigation menu when it is in responsive mode.
 */
  toggleResponsiveNavMenuState() {
    const bool = this.responsiveNavMenuFlag;
    this.responsiveNavMenuFlag = bool === false ? true : false;
  }

  /**
   * Method to calculate totals
   * @param payment 
   */
  private calculateTotals(payment) {
    if (payment.expenseType === 'Debit') {
      this.debitAmount = this.debitAmount + payment.amount;
    } else if (payment.expenseType === 'Credit') {
      this.creditAmount = this.creditAmount + payment.amount;
    }
  }
}
