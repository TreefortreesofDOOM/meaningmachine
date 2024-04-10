import type {
  ActionAttempt,
  FailedActionAttempt,
  SuccessfulActionAttempt,
} from './action-attempt-types.js'
import type { SeamHttpActionAttempts } from './routes/index.js'

export interface ResolveActionAttemptOptions {
  timeout?: number
  pollingInterval?: number
}

export const resolveActionAttempt = async <T extends ActionAttempt>(
  actionAttempt: T,
  actionAttempts: SeamHttpActionAttempts,
  { timeout = 5000, pollingInterval = 500 }: ResolveActionAttemptOptions,
): Promise<SuccessfulActionAttempt<T>> => {
  let timeoutRef
  const timeoutPromise = new Promise<SuccessfulActionAttempt<T>>(
    (_resolve, reject) => {
      timeoutRef = globalThis.setTimeout(() => {
        reject(new SeamActionAttemptTimeoutError<T>(actionAttempt, timeout))
      }, timeout)
    },
  )

  try {
    return await Promise.race([
      pollActionAttempt<T>(actionAttempt, actionAttempts, { pollingInterval }),
      timeoutPromise,
    ])
  } finally {
    if (timeoutRef != null) globalThis.clearTimeout(timeoutRef)
  }
}

const pollActionAttempt = async <T extends ActionAttempt>(
  actionAttempt: T,
  actionAttempts: SeamHttpActionAttempts,
  options: Pick<ResolveActionAttemptOptions, 'pollingInterval'>,
): Promise<SuccessfulActionAttempt<T>> => {
  if (isSuccessfulActionAttempt(actionAttempt)) {
    return actionAttempt
  }

  if (isFailedActionAttempt(actionAttempt)) {
    throw new SeamActionAttemptFailedError(actionAttempt)
  }

  await new Promise((resolve) => setTimeout(resolve, options.pollingInterval))

  const nextActionAttempt = await actionAttempts.get({
    action_attempt_id: actionAttempt.action_attempt_id,
  })

  return await pollActionAttempt(
    nextActionAttempt as unknown as T,
    actionAttempts,
    options,
  )
}

export const isSeamActionAttemptError = <T extends ActionAttempt>(
  error: unknown,
): error is SeamActionAttemptError<T> => {
  return error instanceof SeamActionAttemptError
}

export class SeamActionAttemptError<T extends ActionAttempt> extends Error {
  actionAttempt: T

  constructor(message: string, actionAttempt: T) {
    super(message)
    this.name = this.constructor.name
    this.actionAttempt = actionAttempt
  }
}

export const isSeamActionAttemptFailedError = <T extends ActionAttempt>(
  error: unknown,
): error is SeamActionAttemptFailedError<T> => {
  return error instanceof SeamActionAttemptFailedError
}

export class SeamActionAttemptFailedError<
  T extends ActionAttempt,
> extends SeamActionAttemptError<T> {
  code: string

  constructor(actionAttempt: FailedActionAttempt<T>) {
    super(actionAttempt.error.message, actionAttempt)
    this.name = this.constructor.name
    this.code = actionAttempt.error.type
  }
}

export const isSeamActionAttemptTimeoutError = <T extends ActionAttempt>(
  error: unknown,
): error is SeamActionAttemptTimeoutError<T> => {
  return error instanceof SeamActionAttemptTimeoutError
}

export class SeamActionAttemptTimeoutError<
  T extends ActionAttempt,
> extends SeamActionAttemptError<T> {
  constructor(actionAttempt: T, timeout: number) {
    super(
      `Timed out waiting for action action attempt after ${timeout}ms`,
      actionAttempt,
    )
    this.name = this.constructor.name
  }
}

const isSuccessfulActionAttempt = <T extends ActionAttempt>(
  actionAttempt: T,
): actionAttempt is SuccessfulActionAttempt<T> =>
  actionAttempt.status === 'success'

const isFailedActionAttempt = <T extends ActionAttempt>(
  actionAttempt: T,
): actionAttempt is FailedActionAttempt<T> => actionAttempt.status === 'error'
