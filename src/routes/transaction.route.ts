import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import { TransactionControllers } from './../controllers/transaction.controller';
import validationMiddleware from './../middlewares/validation.middleware';
import { TransferDto } from '../dtos/transfer.dto';
import authMiddleware from "@/middlewares/auth.middleware";
import { DepositDto } from '@/dtos/deposit.dto';
import { historyBodyDto, historyParamsDto, createAccountDto } from './../dtos/transaction.dto';

export class TransactionsRoute implements Routes {
   public path = '/transaction';
   public router = Router();
   public transactionController = new TransactionControllers();
 
   constructor() {
     this.initializeRoutes();
   }
 
   private initializeRoutes() {
     this.router.post(`${this.path}/transfer`, authMiddleware, validationMiddleware(TransferDto), this.transactionController.transfer);
     this.router.post(`${this.path}/fund`, authMiddleware, validationMiddleware(DepositDto), this.transactionController.deposit);
     this.router.get(`${this.path}/accounts`, authMiddleware, this.transactionController.fetchAccount);
     this.router.post(`${this.path}/create-account`, authMiddleware, validationMiddleware(createAccountDto), this.transactionController.createAccount )
     this.router.post(`${this.path}/history`, authMiddleware, validationMiddleware(historyBodyDto, 'body'), this.transactionController.fetchUserTransactionHistory);
     this.router.get(`${this.path}/history/:transactionId`, authMiddleware, validationMiddleware(historyParamsDto, 'params'), this.transactionController.fetchOneTransaction);
   }
 }