 const readline = require('readline');
const fs = require('fs');
const EventEmitter = require('events');

const users = require('./users.json');
// Create the readline interface
/*
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//console.log(users)
function addUser(){
// Prompt the user for their name
rl.question('Hi user please enter your AccountID ! ', (accountID) => { 
    //prompt for user name 
rl.question('Please enter your pin ! ' ,(pin) =>{
  users.push({
    accountID:accountID,
    pin,
    balance: 0,
    transactions: []
  });
  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du fichier:', err);
    } else {
      console.log('Fichier mis à jour avec succès.');
    }
  });
    rl.question('Do you want to create another user? (yes/no)',(answer)=>{
        if (answer.toLowerCase() === 'yes'  ){
            addUser()
        }
        else{
            console.log(" \n allUsers : ");
            console.log(users); 
            rl.close(); 
        }
    });
 });
});
}
//addUser();

function checkBalance(user) { 
  mainMenu(user); // Revenir au menu
  console.log(`Your balance state is : ${user.balance}`);
 
}

function WithdrawingMoney(user) { 
  mainMenu(user); // Revenir au menu
  rl.question('How much do you want to withdraw?\n', (amountStr) => {
    const amount = Number(amountStr);
    if (!isNaN(amount) && amount > 0 && amount <= user.balance) {
      user.balance -= amount;
      user.transactions.push({
        type: 'withdraw',
        amount,
        date: new Date().toISOString()
      });
      fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
      console.log(`✅ Withdrawal successful. Your new balance is: ${user.balance}`);
    } else {
      console.log("❌ Invalid amount or insufficient balance.");
    }
   
  });
}

function DeposingMoney(user) {
  mainMenu(user); // Revenir au menu
  rl.question('💸 How much do you want to deposit?\n', (amountStr) => {
    const amount = Number(amountStr);
    if (!isNaN(amount) && amount > 0) {
      user.balance += amount;
      user.transactions.push({
        type: 'deposit',
        amount,
        date: new Date().toISOString()
      });
      fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
      console.log(`✅ Deposit successful. New balance: ${user.balance}`);
    } else {
      console.log("❌ Invalid amount.");
    }
    
  });
}

function transHistory(user) { 
  mainMenu(user); // Revenir au menu
  console.log('📜 Your transaction history:');
  user.transactions.forEach((t, index) => {
    console.log(`${index + 1}. [${t.date}] - ${t.type.toUpperCase()} : ${t.amount}`);
  });
 
}

function mainMenu(user) {
  console.log('\n=== Main Menu ===');
  console.log('1 - Check balance');
  console.log('2 - Deposit money');
  console.log('3 - Withdraw money');
  console.log('4 - View transaction history');
  console.log('5 - Exit\n');

  rl.question('Choose an option (1-5): ', (answer) => {
    switch (parseInt(answer)) {
      case 1:
        checkBalance(user);
        break;
      case 2:
        DeposingMoney(user);
        break;
      case 3:
        WithdrawingMoney(user);
        break;
      case 4:
        transHistory(user);
        break;
      case 5:
        console.log(`👋 Goodbye Mr. ${user.name}, see you next time.`);
        setTimeout(() => rl.close(), 2000);
        break;
      default:
        console.log('❌ Invalid choice. Please try again.');
        mainMenu(user);
    }
  });
}
function Auth() {
  console.log("\nWelcome back user!");
  rl.question('Please enter your ID:\n', (accountID) => {
    const user = users.find(user => user.accountID === accountID);
    if (user) {
      rl.question('Please enter your PIN:\n', (pin) => {
        if (user.pin === pin) {
          console.log(`✅ Welcome again Mr. ${user.name}!\n`);
          mainMenu(user); // Aller directement au menu
        } else {
          console.log("❌ Incorrect PIN. Try again.");
          Auth(); // Retry login
        }
      });
    } else {
      console.log("❌ ID not found. Try again.");
      Auth(); // Retry login
    }
  });
}
//Auth();
 */

function greetUser(name, callback1 ) {
  console.log(`Hi, ${name}!`);
  callback1();

}
 function sayBye() {
  console.log("Goodbye!");
}
function Nice(){
  console.log('Nice to meet you !')
}
greetUser("Yassine", sayBye)
setTimeout(Nice, 3000)




