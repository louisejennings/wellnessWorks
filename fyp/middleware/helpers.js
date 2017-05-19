var Event = require('../models/event');
var User = require('../models/user');
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var router = express.Router();

var Handlebars = require('handlebars');
/* ----- Capitalize first letter of username ------------*/
Handlebars.registerHelper('toUpperCase', function(username) {
	return username.charAt(0).toUpperCase() + username.slice(1);
});

/* ----- Capitalize first letter of name and surname ------------*/
Handlebars.registerHelper('capitalize', function(name) {
    var name = name.toLowerCase().split(' ');
    for (var i = 0; i < name.length; i++) {
       name[i] = name[i].charAt(0).toUpperCase() + name[i].substring(1);   
    }
   return name.join(' '); 
});


/* ----- Equal Helper ------------*/
/* ----- Used to check role is admin (display analytics) ------------*/
Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Need 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

/* ----- Capitalize first letter of Current Event ------------*/
Handlebars.registerHelper('capital', function(eventName) {
    return eventName.charAt(0).toUpperCase() + eventName.slice(1);
});

/*-----------Get First Name and Capitalise ---------*/
Handlebars.registerHelper('firstNameCap', function(name) {
    var name = name.toLowerCase().split(' ');
    for (var i = 0; i < name.length; i++) {
       name[i] = name[i].charAt(0).toUpperCase() + name[i].substring(1);   
    }
   return name[0]; 
});

/* ----- Get Badge Type ------------*/
Handlebars.registerHelper('checkImage', function(specialBadges) {
    
    var mystring = specialBadges;
    var arr = [] ;
    arr = mystring.split(" ", 2);

    var firstWord = arr[0].toLowerCase(); //change string to lowercase to match images src
    return firstWord
});









