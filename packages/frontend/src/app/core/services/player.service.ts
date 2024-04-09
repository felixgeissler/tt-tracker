import { Injectable, inject, signal } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { PocketbaseService } from './pocketbase.service';

type CreatePlayerBody = {
  name: string;
};

type PlayerModel = RecordModel & {
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private pocketBaseService = inject(PocketbaseService);

  private readonly collectionName = 'players';
  readonly allPlayers = signal<PlayerModel[]>([]);

  constructor() {
    this.initPlayers();
  }

  private initPlayers = async () => {
    const players = await this.getFullList();
    this.allPlayers.set(players);

    this.pocketBaseService.pb
      .collection<PlayerModel>(this.collectionName)
      .subscribe('*', e => {
        if (e.action === 'create') {
          this.allPlayers.update(all => [...all, e.record]);
        }
        if (e.action === 'update') {
          this.allPlayers.update(all =>
            all.map(p => (p.id === e.record.id ? e.record : p))
          );
        }
        if (e.action === 'delete') {
          this.allPlayers.update(all => all.filter(p => p.id !== e.record.id));
        }
      });
  };

  getFullList() {
    return this.pocketBaseService.pb
      .collection<PlayerModel>(this.collectionName)
      .getFullList();
  }

  create(body: CreatePlayerBody) {
    return this.pocketBaseService.pb
      .collection(this.collectionName)
      .create(body);
  }
}
