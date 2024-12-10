import { PubSub } from 'graphql-subscriptions';

// Extiende la interfaz de PubSub para incluir el método asyncIterator
declare module 'graphql-subscriptions' {
  interface PubSub {
    asyncIterator<T>(triggerName: string): AsyncIterator<T>;
  }
}
