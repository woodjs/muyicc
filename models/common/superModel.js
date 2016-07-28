"use strict";

function SuperModel() {
  var self = this;

  this.create = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('super create!');
        resolve('create');
      }, 10);
    })
  };

  this.read = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('super read!');
        resolve('read');
      }, 10);
    });
  };

  this.update = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('super update!');
        resolve('update');
      }, 10);
    });
  };

  this.delete = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('super delete!');
        resolve('delete');
      }, 10);
    });
  };
}


module.exports = SuperModel;