'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// calculations

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${i + 1} days ago</div>
            <div class="movements__value">${mov} ₹</div>
          </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = Number(acc.movements.reduce((acc, curr) => acc + curr, 0));

  labelBalance.textContent = `₹ ${acc.balance}`;
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(deposit => deposit > 0)
    .reduce((total, curr) => total + curr, 0);

  labelSumIn.textContent = `${incomes} ₹`;

  const withdrawals = account.movements
    .filter(withdrawal => withdrawal < 0)
    .reduce((total, curr) => total + curr, 0);

  labelSumOut.textContent = `${Math.abs(withdrawals)} ₹`;

  const interst = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interst} ₹`;
};

const createUsernames = accs => {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

createUsernames(accounts);

// update ui
const updateUI = acc => {
  // display balance
  calcDisplayBalance(acc);

  // display Movements
  displayMovements(acc.movements);

  // display Summary
  calcDisplaySummary(acc);
};

// Event Handler

let currentAccount;

// login btn event
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  // find account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// transfer btn event
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // clear transfer money input field
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // transfer from one acc to another acc
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update ui
    updateUI(currentAccount);
  }
});

// loan btn event
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const loanCondition = currentAccount.movements.some(
    mov => mov >= loanAmount * 0.1
  );

  if (loanAmount > 0 && loanCondition) {
    currentAccount.movements.push(loanAmount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// close btn event
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const userIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(userIndex, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// sort event
let sorted = true;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});
