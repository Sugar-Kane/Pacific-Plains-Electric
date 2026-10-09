import type { VolteiraProvider, Result, Appointment } from "./types";
import { business } from "@/config/business";
import { requestableServices as services } from "@/config/content";
/** Test-only in-memory provider. Never selected by deployed website routes. */
export class MockVolteiraProvider implements VolteiraProvider {
  private appointments = new Map<string, Appointment>();
  private keys = new Map<string, Appointment>();
  private usedSlots = new Set<string>();
  async getBusinessProfile() {
    return {
      ok: true as const,
      data: {
        name: business.name,
        timezone: business.timezone,
        schedulingEnabled: false,
      },
    };
  }
  async getServices() {
    return {
      ok: true as const,
      data: services.map((s) => ({ id: s.slug, name: s.name })),
    };
  }
  async getAvailability() {
    return { ok: true as const, data: [] };
  }
  async createAppointment(
    input: Parameters<VolteiraProvider["createAppointment"]>[0],
  ): Promise<Result<Appointment>> {
    const previous = this.keys.get(input.idempotencyKey);
    if (previous) return { ok: true, data: previous };
    if (this.usedSlots.has(input.slotId))
      return {
        ok: false,
        code: "CONFLICT",
        message: "That appointment was just booked.",
      };
    this.usedSlots.add(input.slotId);
    const a: Appointment = {
      id: crypto.randomUUID(),
      status: "confirmed",
      startsAt: input.slotId,
      endsAt: input.slotId,
      managementToken: crypto.randomUUID() + crypto.randomUUID(),
    };
    this.appointments.set(a.managementToken, a);
    this.keys.set(input.idempotencyKey, a);
    return { ok: true, data: a };
  }
  async getAppointment(token: string): Promise<Result<Appointment>> {
    const a = this.appointments.get(token);
    return a
      ? { ok: true, data: a }
      : {
          ok: false,
          code: "UNAUTHORIZED",
          message: "Invalid appointment link.",
        };
  }
  async cancelAppointment(token: string) {
    const r = await this.getAppointment(token);
    if (r.ok) r.data.status = "cancelled";
    return r;
  }
  async rescheduleAppointment(
    token: string,
    slotId: string,
  ): Promise<Result<Appointment>> {
    const r = await this.getAppointment(token);
    if (!r.ok) return r;
    if (this.usedSlots.has(slotId))
      return {
        ok: false,
        code: "CONFLICT",
        message: "That appointment was just booked.",
      };
    this.usedSlots.delete(r.data.startsAt);
    this.usedSlots.add(slotId);
    r.data.startsAt = slotId;
    r.data.endsAt = slotId;
    return r;
  }
  async createServiceRequest() {
    return { ok: true as const, data: { id: "MOCK-" + crypto.randomUUID() } };
  }
  async createAIConversation() {
    return { ok: true as const, data: { id: "MOCK-" + crypto.randomUUID() } };
  }
  async appendAIMessage() {
    return {
      ok: true as const,
      data: { message: "MOCK: no live AI is connected." },
    };
  }
}
