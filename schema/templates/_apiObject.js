'use strict';

// Module dependencies.
var mongoose = require('mongoose'),
Model = mongoose.models.<%= capSchemaName %>,
api = {},
l=require('../config').util;


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAll = function (skip,limit,cb) {
  var q=Model.find();
  
  if(skip!==undefined){
    q.skip(skip*1);
  }
  
  if(limit!==undefined){
    q.limit(limit*1);
  }
  
  return q.exec( (err, data)=>{
    cb(err,{data:data,count:data.length}); 
  });
};

// GET
api.get = function (id,cb) {
  
  Model.findOne({ '_id': id }, (err, data)=>{
    if(data===undefined) {
      return cb('No Data Found',404);
    }
    return cb(err,data);
  });
};

// POST
api.add = function (data,cb) {
  
  if(data === undefined){
    cb('No Model Provided. Please provide valid data data.');
  }
  
  data = new Model(data);
  
  data.save((err)=>{
    cb(err,data.toObject());
  });
};

// PUT
api.edit = function (id,updateData, cb) {
  
  if(updateData===undefined ){
    return cb('Invalid Data. Please Check data and/or updateData fields',null); 
  }
  
  Model.findById(id, (err, data)=>{
    
    //Force Error
    if(data===undefined){
      return cb('No Data Found',404); 
    }
    
    
    
    <% schemaFields.forEach(function(field, index) { %>
      if(typeof updateData.<%= field.split(':')[0] %> !== undefined){
        data.<%= field.split(':')[0] %> = updateData.<%= field.split(':')[0] %>;
      }
      <% }) %>
      
      
      return data.save( (err)=>{
        cb(err,data.toObject); 
      }); //eo data.save
    });// eo data.find
  };
  
  // DELETE
  api.delete = function (id,cb) {
    return Model.findById(id).remove().exec( (err, data)=>{
      var msg='The data got Deleted';
      if(err) {msg = 'Error in deleting this data';}
      return cb(err,msg);      
    });
  };
  
  
  /*
  ========= [ SPECIAL METHODS ] =========
  */
  
  
  //TEST
  //New Callback System in TEST, which returns a ResponseClass object's Output
  api.test=function (cb) {
    return cb(false,{name:'dummyValue'});
  };
  
  //DELETE ALL
  api.deleteAll = function (cb) {
    return Model.remove({}, (err)=>{
      var data='All <%= lowSchemaName %>s got Deleted';
      if(err) {data = 'Error in deleting all <%= lowSchemaName %>s';}
      return cb(err,data);      
    });
  };
  
  
  // SEARCH
  api.search = function (skip,limit,keywordObj,strict,cb) {
    var k={};
    
    if(strict){
      k=keywordObj;
    }else{
      Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
      });
    }
    
    var q=Model.find(k);
    
    if(skip!==undefined){
      q.skip(skip*1);
    }
    
    if(limit!==undefined){
      q.limit(limit*1);
    }
    
    return q.exec( (err, data)=>{
      cb(err,data); 
    });
  };
  
  
  module.exports = api;
  