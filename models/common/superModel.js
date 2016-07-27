"use strict";

function SuperModel() {

  this.create = function () {
    console.log('super create!');
  };

  this.read = function () {
    console.log('super read!');
  };

  this.update = function () {
    console.log('super update!');
  };

  this.delete = function () {
    console.log('super delete!');
  };
}

module.exports = SuperModel;