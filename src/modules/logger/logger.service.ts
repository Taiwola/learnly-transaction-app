import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class LoggerService {

    private readonly logger = createLogger({
         level: "info",// Set the default logging level
        format: format.combine(
          format.timestamp(), // Add timestamp to log entries
          format.json(), // Format logs as JSON
        ),
        transports: [
          new transports.Console(), // Log to console
          new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to file
          new transports.File({ filename: 'combined.log' }), // Log everything else to another file
        ],
      });

      info(message: string, meta?: any) {
        this.logger.info(message, meta);
      }

      logTransfer(sourceAccount:number, depositAccount:number, amount:number) {
        const message = `Money transfered from account ${sourceAccount} to ${depositAccount}, amount is ${amount}`;
        this.info(message);
      }

      logDeposit(accountNo: string, amount: number) {
        this.info(`Deposit of ${amount} to account ${accountNo}`);
      }
    
      logWithdrawal(accountNo: string, amount: number) {
        this.info(`Withdrawal of ${amount} from account ${accountNo}`);
      }
    
      error(message: string, trace?: string, meta?: any) {
        this.logger.error(message, { trace, ...meta });
      }
    
      warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
      }
    
      debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
      }
}
