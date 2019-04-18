require('dotenv').config();

const XLSX = require('xlsx');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const {DATABASE_URL} = require('../config');
const Customer = require('../models/customer');
const Address = require('../models/address');
const User = require('../models/user');

const workbook = XLSX.readFile("C:/Users/Codey/Desktop/swws.xlsx");
const sheet_name = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheet_name];

let data = [];

for(z in worksheet) {
    if(z[0] === '!') continue;
    // parse out the column, row, and value
    let tt = 0;
    for (let i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
            tt = i;
            break;
        }
    };
    let col = z.substring(0,tt) + 1;
    let param = worksheet[col].v;
    param = param.toString()

    let row = parseInt(z.substring(tt));
    let value = worksheet[z].v;

    // info
    if(param === 'First Name') {
        param = 'firstName';
    }
    if(param === 'Last Name') {
        param = 'lastName';
    }
    if(param === 'Spouse' && value) {
        param = 'authorizedUsers';
        value = {spouse: value}
    }
    if(param === 'Company Name') {
        param = 'companyName';
    }

    // phones
    if(param === 'Business Phone #') {
        param = 'businessPhone';
    }
    if(param === 'Home #') {
        param = 'homePhone';
    }
    if(param === 'Cell #') {
        param = 'cellPhone';
    }
    if(param === 'Fax #') {
        param = 'fax';
    }

    // addresses
    if(param === 'Street Address') {
        param = 'address';
    }
    if(param === 'City') {
        param = 'city';
    }
    if(param === 'State') {
        param = 'state';
    }
    if(param === 'Zip Code') {
        param = 'zip';
    }
    if(param === 'Community Name') {
        param = 'community'
    }

    // extra info 
    if(param === 'E-mail') {
        param = 'emailAddress';
    }
    if(param === 'Notes') {
        param = 'notes';
    }
    if(param === 'Special Instructions') {
        param = 'instructions';
    }
    if(param === 'Contact_Status') {
        param = 'status'
    }

    let obj = {}
    obj[param] = value;

    // set all row values into obj
    if(!data[row]) data[row]={};
    data[row] = {...data[row], ...obj};
}
// drop those first two rows which are empty
data.shift();
data.shift();

// after all customers have had params fixed, iterate through each customer and use params to make all the necessary mongoose calls
let customerArr = [];
let addressArr = [];

// admin user
let user = {
    username: "admin",
    password: "password",
    emailAddress: "codeyworley@gmail.com",
    firstName: "Codey",
    lastName: "Worley",
    type: "Admin"
}

mongoose.connect(DATABASE_URL, { useNewUrlParser:true })
  .then(() => {
      console.log('Dropping database')
      mongoose.connection.db.dropDatabase()
    })
  .then(() => {
    console.log('Seeding data from workbook')
    for(let i = 0; i < data.length; i++) {
        let _id = new ObjectID();

        let customer = {
            _id,
            firstName: data[i].firstName || 'empty',
            lastName: data[i].lastName || 'empty',
            authorizedUsers: data[i].authorizedUsers,
            companyName: data[i].companyName,
            phoneNumbers: [
                {home: data[i].homePhone},
                {cell: data[i].cellPhone},
                {business: data[i].businessPhone},
                {fax: data[i].fax}
            ],
            emailAddress: data[i].emailAddress || 'empty',
            notes: data[i].notes,
            instructions: data[i].instructions,
            status: data[i].status
        }

        let address = {
            customerId: _id,
            address: data[i].address || 'empty',
            city: data[i].city || 'empty',
            state: data[i].state || 'empty',
            zip: data[i].zip || 'empty',
            community: data[i].community || 'empty',
            isBilling: true
        }

        customerArr.push(customer);
        addressArr.push(address);
    }
    return Promise.all([
      Customer.insertMany(customerArr),
      Address.insertMany(addressArr),
      User.insertMany(user)
    ]);
  })
  .then(results => {
    console.log('Success')
    console.info(`Inserted ${results[0].length} customers`);
    console.info(`Inserted ${results[1].length} addresses`);
    console.info(`Inserted ${results[2].length} users`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });