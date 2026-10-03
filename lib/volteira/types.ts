import type { ServiceRequestInput } from "@/lib/security/validation";
export type IntegrationMode = "mock" | "production" | "unavailable";
export type AvailabilitySlot = {
  id: string;
  startsAt: string;
  endsAt: string;
  technicianId: string;
};
export type Appointment = {
  id: string;
  status: "confirmed" | "cancelled";
  startsAt: string;
  endsAt: string;
  managementToken: string;
};
export type Result<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: "UNAVAILABLE" | "CONFLICT" | "UNAUTHORIZED" | "INVALID";
      message: string;
    };
export interface VolteiraProvider {
  getBusinessProfile(): Promise<
    Result<{ name: string; timezone: string; schedulingEnabled: boolean }>
  >;
  getServices(): Promise<Result<{ id: string; name: string }[]>>;
  getAvailability(
    serviceId: string,
    from: string,
  ): Promise<Result<AvailabilitySlot[]>>;
  createAppointment(
    input: ServiceRequestInput & { slotId: string },
  ): Promise<Result<Appointment>>;
  getAppointment(token: string): Promise<Result<Appointment>>;
  rescheduleAppointment(
    token: string,
    slotId: string,
    idempotencyKey: string,
  ): Promise<Result<Appointment>>;
  cancelAppointment(
    token: string,
    idempotencyKey: string,
  ): Promise<Result<Appointment>>;
  createServiceRequest(
    input: ServiceRequestInput,
  ): Promise<Result<{ id: string }>>;
  createAIConversation(): Promise<Result<{ id: string }>>;
  appendAIMessage(
    conversationId: string,
    message: string,
  ): Promise<Result<{ message: string }>>;
}
