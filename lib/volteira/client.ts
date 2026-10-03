import "server-only";
import type { VolteiraProvider, Result } from "./types";
const unavailable = async <T>(): Promise<Result<T>> => ({
  ok: false,
  code: "UNAVAILABLE",
  message:
    "The Volteira connection is not available. Please call Pacific Plains Electric.",
});
/** Fail closed. No guessed endpoints, availability, bookings, or AI responses. */
export class UnavailableVolteiraProvider implements VolteiraProvider {
  getBusinessProfile = unavailable<
    Awaited<ReturnType<VolteiraProvider["getBusinessProfile"]>> extends Result<
      infer T
    >
      ? T
      : never
  >;
  getServices: VolteiraProvider["getServices"] = unavailable;
  getAvailability: VolteiraProvider["getAvailability"] = unavailable;
  createAppointment: VolteiraProvider["createAppointment"] = unavailable;
  getAppointment: VolteiraProvider["getAppointment"] = unavailable;
  rescheduleAppointment: VolteiraProvider["rescheduleAppointment"] =
    unavailable;
  cancelAppointment: VolteiraProvider["cancelAppointment"] = unavailable;
  createServiceRequest: VolteiraProvider["createServiceRequest"] = unavailable;
  createAIConversation: VolteiraProvider["createAIConversation"] = unavailable;
  appendAIMessage: VolteiraProvider["appendAIMessage"] = unavailable;
}
export function getVolteiraProvider(): VolteiraProvider {
  return new UnavailableVolteiraProvider();
}
export const productionAdapterReady = false;
