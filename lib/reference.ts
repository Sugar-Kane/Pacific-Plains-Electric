/**
 * The reference number a customer is shown after submitting a request: the first
 * eight characters of the request's id, in capitals (e.g. "3F2A9C1B"). The owner
 * email and the admin tracker show the same code, so either side can quote it.
 */
export const shortReference = (id: string) => id.slice(0, 8).toUpperCase();
