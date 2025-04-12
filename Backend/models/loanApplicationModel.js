const pool = require('../config/db');

const submitLoanApplication = async (data) => {
  const {
    fullName,
    dob,
    mobile,
    pan,
    employmentType,
    income,
    loanAmount,
    loanPurpose,
    loanTenure,
    address,
    accountNumber,
    bankName,
    ifscCode,
    repaymentPlan,
  } = data;

  const query = `
    INSERT INTO loan_applications (
      full_name, dob, mobile, pan, employment_type,
      income, loan_amount, loan_purpose, loan_tenure,
      address, account_number, bank_name, ifsc_code,
      repayment_plan
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;
  `;

  const values = [
    fullName, dob, mobile, pan, employmentType,
    income, loanAmount, loanPurpose, loanTenure,
    address, accountNumber, bankName, ifscCode,
    repaymentPlan,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllLoanApplications = async () => {
  const result = await pool.query(`SELECT * FROM loan_applications ORDER BY submitted_at DESC`);
  return result.rows;
};

module.exports = { submitLoanApplication, getAllLoanApplications };
