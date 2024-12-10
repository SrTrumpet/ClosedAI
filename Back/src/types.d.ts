import { PubSub } from 'graphql-subscriptions';

declare module 'graphql-subscriptions' {
  interface PubSub {
    asyncIterator<T>(triggerName: string): AsyncIterator<T>;
  }
}