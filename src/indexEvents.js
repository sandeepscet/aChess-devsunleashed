import {InvocationError, InvocationErrorCode} from '@forge/events'
import {asApp, route} from '@forge/api'

export async function run(event, context) {
 console.log({event});
 console.log({context});
}