import { PAYSTACK_SECRET_KEY } from '../config';
import axios from 'axios';

export const acceptPayment = async (amount:number, description='Fund Deposit')=>{
   return axios.post(`${PAYSTACK_HOSTNAME}/page`, {
      amount:amount*100, 
      description, 
      name:'Wallet Sample'
   }, { headers:{Authorization:`Bearer ${PAYSTACK_SECRET_KEY}`}})
}


const PAYSTACK_HOSTNAME = 'https://api.paystack.co'