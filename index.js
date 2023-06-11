// Step 1: User Registration and Data Model
class User {
  constructor(username, password, phone_number, is_mfa_enabled = false, mfa_secret = null) {
    this.username = username;
    this.password = password;
    this.phone_number = phone_number;
    this.is_mfa_enabled = is_mfa_enabled;
    this.mfa_secret = mfa_secret;
  }
}

// Step 2: User Login Flow
const randomstring = require('randomstring');
const smsGateway = require('<YOUR_SMS_GATEWAY_MODULE>');

// Mock user data
const users = [
  new User('user1', 'password1', '+123456789', true, 'MFA_SECRET_1'),
  new User('user2', 'password2', '+987654321', false)
];

function generateOTP() {
  // Generate a 6-digit OTP
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
}

function sendOTP(phoneNumber, otp) {
  // Use the SMS gateway service to send the OTP to the user's phone number
  // Example using Twilio:
  // smsGateway.send({
  //     to: phoneNumber,
  //     message: `Your OTP for BudPay: ${otp}`
  // });
  console.log(`OTP sent to ${phoneNumber}: ${otp}`);
}

function getUserByUsername(username) {
  // Find and return the user with the given username
  return users.find(user => user.username === username);
}

function login(username, password, enteredOTP) {
  const user = getUserByUsername(username);

  if (!user) {
    return "User not found";
  }

  if (user.password !== password) {
    return "Invalid password";
  }

  if (user.is_mfa_enabled) {
    if (!enteredOTP) {
      const otp = generateOTP();
      sendOTP(user.phone_number, otp);
      return "OTP sent";
    } else if (enteredOTP !== otp) {
      return "Invalid OTP";
    }
  }

  return "Login successful";
}

// Example usage
console.log(login('user1', 'password1')); // OTP sent
console.log(login('user1', 'password1', '123456')); // Login successful
console.log(login('user1', 'wrongpassword')); // Invalid password
console.log(login('unknownuser', 'password')); // User not found
