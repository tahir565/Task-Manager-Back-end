var express = require('express');
var mongoose = require('mongoose');
var Request = require('../models/request');
var Book = require('../models/book')
var auth = require('../middleware/auth');

var router = new express.Router();

router.post('/requestExchange/:id', auth, async(req,res) =>{
  bookId = req.params.id;
  request = new Request({requestedBookId: bookId, userId: req.user._id});
  book = await Book.findById({_id:bookId});
  if(!book || book.owner.equals(req.user._id)){
    return res.status(400).send({error: 'Book is not found!'});
  }
  try{
    await request.save();
    res.status(201).send(request)
  }catch(e){
    res.status(400).send(e.message);
  }
});

router.post('/accept/:id', auth, async(req,res) =>{
  requestId = req.params.id;
  status = req.body.status;
  request = await Request.findById({_id:requestId});
  if(!request){
    return res.status(400).send({error: 'Request is not found!'});
  }
  if (req.body.exchangeBookId){

    book = await Book.findById({_id:req.body.exchangeBookId});
    
    if(!book || book.owner.equals(req.user._id)){
      return res.status(400).send({error: 'Book is not found!'});
    }
    try{
      request.exchangeBookId = req.body.exchangeBookId;
      await request.save();
      res.status(201).send(request)
    }catch(e){
      res.status(400).send(e.message);
    }
  }else{
    try{
      request.status = status;
      await request.save();
      res.status(201).send(request)
    }catch(e){
      res.status(400).send(e.message);
    }
  }
});

router.get('/requests', auth, async(req,res) =>{
  my_requests = await Request.find({userId:req.user._id});
  requests = await Request.find({userId: {$ne:req.user._id }}).populate('requestedBookId','owner');
  requests = requests.filter(request => request.requestedBookId.owner.equals(req.user._id));
  res.send({my_requests,requests});
});

router.delete('/request/:id', auth, async(req,res) => {
  try{
    request = await Request.findByIdAndDelete({_id:req.params.id});
    res.status(200).send(request);
  }catch(e){
    res.status(400).send(e.message);
  }

});

module.exports = router;