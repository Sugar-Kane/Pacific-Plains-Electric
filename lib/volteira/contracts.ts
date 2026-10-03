/** Proposed capabilities for the future operational adapter. These are contracts, not implemented HTTP endpoints. */
import type { Result } from "./types";
export type Money = { amountCents: number; currency: "USD" };
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
export type WorkOrder = { id: string; customerId: string; status: string };
export type Estimate = {
  id: string;
  customerId: string;
  total: Money;
  status: "draft" | "sent" | "approved" | "declined";
};
export type Invoice = {
  id: string;
  customerId: string;
  total: Money;
  status: "open" | "paid" | "void";
};
export interface OperationalCapabilities {
  createCustomer(
    input: Omit<Customer, "id">,
    idempotencyKey: string,
  ): Promise<Result<Customer>>;
  findCustomer(input: {
    email?: string;
    phone?: string;
  }): Promise<Result<Customer | null>>;
  createWorkOrder(
    input: { customerId: string; appointmentId: string },
    idempotencyKey: string,
  ): Promise<Result<WorkOrder>>;
  getEstimate(
    customerToken: string,
    estimateId: string,
  ): Promise<Result<Estimate>>;
  approveEstimate(
    customerToken: string,
    estimateId: string,
    idempotencyKey: string,
  ): Promise<Result<Estimate>>;
  getInvoice(
    customerToken: string,
    invoiceId: string,
  ): Promise<Result<Invoice>>;
  getPaymentStatus(
    customerToken: string,
    invoiceId: string,
  ): Promise<Result<{ status: string }>>;
  sendCustomerMessage(
    input: { customerId: string; message: string; channel: "email" | "sms" },
    idempotencyKey: string,
  ): Promise<Result<{ providerId: string; delivered: boolean }>>;
  getAIKnowledge(): Promise<
    Result<{
      version: string;
      approvedEntries: { question: string; answer: string }[];
    }>
  >;
}
