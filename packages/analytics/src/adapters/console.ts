import type { GroupEvent, IdentifyEvent, PageEvent, TrackEvent } from '../types.js';

export class ConsoleAdapter {
  track(event: TrackEvent): void {
    console.log('[analytics:track]', event.name, event.properties);
  }

  identify(event: IdentifyEvent): void {
    console.log('[analytics:identify]', event.userId, event.traits);
  }

  page(event: PageEvent): void {
    console.log('[analytics:page]', event.path, event.properties);
  }

  group(event: GroupEvent): void {
    console.log('[analytics:group]', event.groupId, event.traits);
  }

  flush(): void {
    // no-op for console
  }
}
