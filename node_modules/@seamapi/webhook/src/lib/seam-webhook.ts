import type { SeamEvent } from 'seamapi-types'
import { Webhook } from 'svix'

// UPSTREAM: This type should come from @seamapi/types.
export type SeamWebhookEvent = Distribute<SeamEvent['event_type']>

export class SeamWebhook {
  readonly #webhook: Webhook

  constructor(secret: string) {
    this.#webhook = new Webhook(secret)
  }

  verify(payload: string, headers: Record<string, string>): SeamWebhookEvent {
    return this.#webhook.verify(payload, headers) as SeamWebhookEvent
  }
}

type Distribute<EventType> = EventType extends SeamEvent['event_type']
  ? {
      event_type: EventType
    } & Extract<SeamEvent, { event_type: EventType }>['payload']
  : never
