export const eventNames = [
  "schedule_started",
  "service_selected",
  "appointment_booked",
  "service_request_submitted",
  "work_phone_clicked",
  "direct_phone_clicked",
  "email_clicked",
  "ai_chat_opened",
  "ai_booking_started",
  "ai_booking_completed",
  "estimate_viewed",
  "estimate_approved",
] as const;
export type AnalyticsEvent = (typeof eventNames)[number];
/** No arbitrary properties: prevents contact details and free text leaking into analytics. Transport intentionally disabled. */
export function trackEvent(event: AnalyticsEvent): void {
  void event;
}
