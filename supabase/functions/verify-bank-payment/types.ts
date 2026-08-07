export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{
      mimeType: string;
      body?: { data?: string };
      parts?: Array<any>;
    }>;
  };
}

export interface ParsedTransaction {
  gmailMessageId: string;
  senderName: string;
  amount: number;
  description: string;
  transactionTime: string;
  rawContent?: string;
}

export interface BankTransactionRecord {
  id?: string;
  gmail_message_id: string;
  sender_name: string;
  amount: number;
  description: string;
  transaction_time: string;
  matched: boolean;
  created_at?: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  payment_code: string;
  amount: number;
  status: "PENDING" | "MATCHED" | "FAILED" | "EXPIRED" | "MANUAL";
  paid_at?: string | null;
}

export interface MatchResult {
  success: boolean;
  matched: boolean;
  transactionId?: string;
  paymentId?: string;
  orderId?: string;
  reason?: string;
}
