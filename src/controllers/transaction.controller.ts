import { TransactionService } from '@/services/transaction.service';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from './../interfaces/auth.interface';
import { ServiceError } from '@/interfaces/service.interface';

export class TransactionControllers {

  transactionService = new TransactionService()

  constructor() {}

  transfer = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try{
      const transaction = await this.transactionService.transfer(req.body, req);
      res.status(200).send({status:true, message:'Transaction Successful', data:transaction})
    }
    catch(err){
      next(err)
    }
  }

  deposit = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try{
      const transaction = await this.transactionService.deposit(req.body, req);
      res.status(200).send({status:true, message:'Transaction Successful', data:transaction})
    }
    catch(err){
      next(err)
    }
  }

  createAccount = async (req: RequestWithUser, res: Response, next: NextFunction)=>{
    try{
      const account = await this.transactionService.createAccount(req.user._id, req.body.accountType);
      res.status(201).send({status:true, message:'Account Created', data:account})
    }
    catch(err){
      next(err)
    }
  }

  fetchAccount= async (req: RequestWithUser, res: Response, next: NextFunction)=>{
    try{
      const accounts = await this.transactionService.fetchAccounts(req.user._id);
      res.status(200).send({status:true, message:'Success', data:accounts})
    }
    catch(err){
      next(err)
    }
  }

  fetchUserTransactionHistory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try{
      console.log("444444444")
        const transactions  = req.body?.account? 
          (await this.transactionService.fetchAccountTransaction(req.user._id, req.body?.account)):
          (await this.transactionService.fetchUserTransaction(req.user._id))
          res.status(200).send({status:true, message:'Success', data:transactions})

    }
    catch(err){
      console.log(err)
      next(err)
    }
  }

  fetchOneTransaction = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try{
      const transaction = await this.transactionService.fetchOneTransaction(req.user._id, req.params.transactionId);
      res.status(200).send({status:true, message:'Success', data:transaction})
    }
    catch(err){
      next(err)
    }
  } 
}
