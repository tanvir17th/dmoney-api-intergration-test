# dMoney API Integration Testing

## Project Overview

This project contains automated API integration tests for the dMoney transaction system using JavaScript, Mocha, Chai, Axios, and Dotenv.

The test suite validates end-to-end financial transaction workflows including:

- Admin Authentication
- User Creation (Customers, Agent, Merchant)
- User Activation & Status Update
- System & Agent Money Deposit
- OTP Verification Workflow
- Customer Send Money
- Customer Cash Out
- Merchant Payment
- Balance & Commission Assertions

The primary objective of this repository is to verify that all core financial transactions and user management workflows in the dMoney API operate accurately end-to-end.

---

## Technology Stack

- **Runtime:** Node.js
- **Language:** JavaScript (ES6 Modules)
- **Test Runner:** Mocha
- **Assertion Library:** Chai
- **HTTP Client:** Axios
- **Environment Management:** Dotenv

---

## Project Structure

```bash
dmoney-api-integration-testing
│
├── test/
│   └── dmoney.spec.js
│
├── screenshots/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

---

DMoney Integration Testing
    ✔ Admin Login
    ✔ Create Customer 1
    ✔ Create Customer 2
    ✔ Create Agent
    ✔ Create Merchant
    ✔ Activate Customer 1
    ✔ Activate Customer 2
    ✔ Activate Agent
    ✔ Activate Merchant
    ✔ System Login
    ✔ System Deposit 5000 Tk To Agent
    ✔ Agent Login
    ✔ Search Agent By ID
    ✔ Agent Verify OTP
    ✔ Customer 1 Login
    ✔ Search Customer 1
    ✔ Customer 1 Verify OTP
    ✔ Customer 1 Send Money To Customer 2
    ✔ Customer 2 Login
    ✔ Search Customer 2
    ✔ Customer 2 Verify OTP
    ✔ Customer 2 Cashout 500 Tk
    ✔ Customer 2 Pay Merchant 400 Tk
    ✔ Agent Deposit 2000 Tk To Customer 1

  24 passing (5s)

## Test Evidence

### Test Execution Screenshot

The following screenshot demonstrates the successful execution of the automated dMoney API Integration Testing suite, including API requests, assertions, and transaction validation workflows.

📷 **Execution Screenshot (Google Drive):**

[📷 View Execution Screenshot](https://drive.google.com/file/d/1CWOAuEdhuauc4KFLkiYPu1iTpEKu5mkZ/view?usp=sharing)
---

## Business Workflow Covered

### Admin Activities

- Login as Admin
- Create Agent
- Create Merchant
- Create Customer 1
- Create Customer 2
- Activate Users
- Deposit Money to Agent

### Agent Activities

- Login as Agent
- Verify OTP
- Deposit Money to Customer

### Customer Activities

- Login as Customer
- Verify OTP
- Send Money to Another Customer
- Cash Out through Agent
- Pay Merchant

---

## Test Scenarios

### User Management

✅ Create Customer 1

✅ Create Customer 2

✅ Create Agent

✅ Create Merchant

✅ Activate All Users

---

### Financial Transactions

✅ System Deposit to Agent

✅ Agent Deposit to Customer

✅ Customer Send Money

✅ Customer Cash Out

✅ Customer Merchant Payment

---

### Verification

✅ Status Code Validation

✅ Response Body Validation

✅ Balance Verification

✅ Transaction Information Validation

---

## Installation

### Clone Repository

```bash
git clone [https://github.com/tanvir17th/dmoney-api-intergration-testing.git](https://github.com/tanvir17th/dmoney-api-intergration-test)
```

### Navigate to Project Directory

```bash
cd dmoney-api-integration-testing
```

### Install Dependencies

```bash
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root and configure the following variables:

```env
BASE_URL=YOUR_BASE_URL

ADMIN_PHONE=YOUR_ADMIN_PHONE
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```

> Do not commit the `.env` file to GitHub.

---

## Execute Tests

Run all test cases:

```bash
npm test
```

Run specific test file:

```bash
npx mocha .\test\transaction.test.js
```

---

## Sample Test Output

```bash
24 passing
0 failing
```

---

## Challenges Faced

During the testing process, some transaction-related APIs occasionally returned:

```json
{
  "message": "Internal RTC Server Error"
}
```

and HTTP:

```bash
502 Bad Gateway
```

These issues were identified as server-side/backend service availability problems rather than test script implementation issues.

---

## Key Learning Outcomes

- API Automation Testing
- Token-Based Authentication Testing
- OTP Verification Workflow Testing
- Financial Transaction Validation
- Automated Assertion Design
- Integration Testing Best Practices
- Test Data Management
- Response Validation Using Chai

---

## Author

**MD. Tanvir Ahamed**