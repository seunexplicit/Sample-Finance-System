import { DepositDto } from "@/dtos/deposit.dto";
import { TransferDto } from "@/dtos/transfer.dto";
import { Account, AccountType } from "@/interfaces/account.interface";
import { RequestWithUser } from '@/interfaces/auth.interface';
import { acceptPayment } from './paystack.service';
import { ServiceError } from '@/interfaces/service.interface';
import { accountModel, transactionModel, userModel } from "@/models";
import { NAME } from './../constants/schema-name.constant';
import { Accounts } from './../constants/account-type.constant';
import { TransactionHistory, TransactionType } from './../interfaces/transaction.interface';
import { HttpException } from "@/exceptions/HttpException";

export class TransactionService{


   async deposit(transactionData:DepositDto, request:RequestWithUser):Promise<Account>{
     
      const [user, account] = await Promise.all([
         userModel.findById(request.user._id),
         accountModel.findOne({accountNumber:transactionData.account})
      ])
      const userHasAccount = (user.accounts as string[])?.findIndex(each=>each==`${account._id}`);
      if(userHasAccount==-1) throw new HttpException(400,'Invalid Account Number')
      const paystackResponse  = await acceptPayment(transactionData.amount)
      if(!paystackResponse.data?.status){
         console.log(paystackResponse)
         throw new HttpException(500,'Transaction could not be processed')
      }
      account.amount = account.amount+transactionData.amount;
      await account.save()
      this.createFundHistory(transactionData.amount, account)
      return account
      
   }


   async transfer(transactionData:TransferDto, request:RequestWithUser):Promise<Account>{

      const [beneficiaryAccount, sender, senderAccount] = await Promise.all([
         accountModel.findOne({accountNumber:transactionData.beneficiary}),
         userModel.findById(request.user._id),
         accountModel.findOne({accountNumber:transactionData.account})

      ]);
      
      const senderHasAccount = (sender.accounts as string[])?.findIndex(each=>each==`${senderAccount._id}`)
      if(senderHasAccount==-1) throw new HttpException(400,'Invalid account number')
      if(!beneficiaryAccount) throw new HttpException(400, `Invalid beneficiary account number`)
      if(senderAccount.amount<transactionData.amount) throw new HttpException(400,'Insufficient funds') 
      beneficiaryAccount.amount = beneficiaryAccount.amount+transactionData.amount
      senderAccount.amount = senderAccount.amount-transactionData.amount;
      await Promise.all([senderAccount.save(), beneficiaryAccount.save()]);
      this.createDepositHistory(
         transactionData.amount,transactionData.narration,
         senderAccount, beneficiaryAccount
         )
      this.createWithdrawalHistory(
         transactionData.amount,transactionData.narration,
         senderAccount, beneficiaryAccount
      )
      return senderAccount;
         
   }

   async createAccount(userId:string, accountType:AccountType):Promise<Account>{

         const accounts = await accountModel.find({user:userId});
         for(let account of accounts){
            if(account.type===accountType) throw new HttpException(400, `You already have a ${(Accounts.find(each=>each.id==accountType)).name} `)
         }
         let accountNumber = this.randomAccount()
         let account = await accountModel.findOne({accountNumber})
         while(account){
            accountNumber = this.randomAccount();
            account = await accountModel.findOne({accountNumber})

         }
         const newAccount = await accountModel.create({
            accountNumber,
            user:userId,
            type:accountType,
         })
         this.addNewAccountToUser(userId, newAccount._id)
         return newAccount
   }

   async fetchAccounts(userId:string):Promise<Account[]>{
      const accounts = accountModel.find({user:userId});
      return accounts

      
   }

   async fetchUserTransaction(userId:string):Promise<TransactionHistory[]>{
      const transaction = await transactionModel.find({user:userId});
      return transaction
   }

   async fetchAccountTransaction(userId:string, accountId:string):Promise<TransactionHistory[]>{
      const transaction = await transactionModel.find({user:userId, account:accountId});
      return transaction
   }

   async fetchOneTransaction(userId:string, transactionId:string):Promise<TransactionHistory>{
      const transaction = await transactionModel.findOne({user:userId, _id:transactionId})
      .populate([
         {
            path:'sender', select:'firstName lastName'
         },
         {
            path:'beneficiary', select:'firstName lastName'
         },
         {
            path:'user', select:'firstName lastName'
         },
         {
            path:'account'
         },
      ]);
      return transaction
   }

   randomAccount= ()=>{
      return `060${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
   }

   async addNewAccountToUser(userId:string, accountId:string){
      const user = await userModel.findById(userId);
      (user.accounts as string[]) = [...(user.accounts as string[]), accountId];
      user.save()
   }

   async createDepositHistory(
      amount:number, 
      narration:string, 
      senderAccount:Account, 
      beneficiaryAccount:Account
      ){
     try{
      const  history:TransactionHistory = {
         amount,
         amountATransaction:beneficiaryAccount.amount,
         amountBTransaction:beneficiaryAccount.amount-amount,
         narration:narration||`Wallet Sample \\${new Date().toDateString()}//`,
         sender:senderAccount.user,
         type:TransactionType.DEPOSIT,
         user:beneficiaryAccount.user,
         account:beneficiaryAccount._id
      }

      const transaction = new transactionModel(history)
      const [user] = await Promise.all([
         userModel.findById(beneficiaryAccount.user),
         transaction.save()
      ]);

      (user.transactions as string[]) = [...(user.transactions as string[]), transaction._id];
      user.save();
   }
   catch(err){
      console.log(err);
   }
   }

   async createFundHistory(
      amount:number,  
      account:Account,
   ){
      try{
         const  history:TransactionHistory = {
            amount,
            amountATransaction:account.amount,
            amountBTransaction:account.amount-amount,
            narration:`Wallet Sample \\${new Date().toDateString()}//`,
            type:TransactionType.FUND,
            user:account.user,
            account:account._id
         }

         const transaction = new transactionModel(history)
         const [user] = await Promise.all([
            userModel.findById(account.user),
            transaction.save()
         ]);

         (user.transactions as string[]) = [...(user?.transactions as string[]), transaction._id];
         user.save();
      }
      catch(err){
         console.log(err);
      }
   }

   async createWithdrawalHistory(
      amount:number, 
      narration:string, 
      senderAccount:Account, 
      beneficiaryAccount:Account
   ){
      try{
         const  history:TransactionHistory = {
            amount,
            amountATransaction:senderAccount.amount,
            amountBTransaction:senderAccount.amount+amount,
            narration:narration||`Wallet Sample \\${new Date().toDateString()}//`,
            beneficiary:beneficiaryAccount.user,
            type:TransactionType.WITHDRAWAL,
            user:senderAccount.user,
            account:senderAccount._id
         }

         const transaction = new transactionModel(history)
         const [user] = await Promise.all([
            userModel.findById(senderAccount.user),
            transaction.save()
         ]);

         (user.transactions as string[]) = [...(user.transactions as string[]), transaction._id];
         user.save();
      }
      catch(err){
         console.log(err)
      }
   }
}

