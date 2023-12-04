import { Injectable, inject } from '@angular/core';
import {
  BaseResponse,
  PocketbaseService,
} from 'src/app/core/services/pocketbase.service';

type CreateLeagueBody = {
  name: string;
  zip: string;
  city: string;
  description: string;
  openForApplication: boolean;
};

export interface League extends BaseResponse {
  id: string;
  name: string;
  zip: string;
  city: string;
  description: string;
  openForApplication: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private readonly pb = inject(PocketbaseService).pb;

  getLeague(id: string) {
    return this.pb.collection('leagues').getOne<League>(id);
  }

  getLeagueList(page = 1, perPage = 16) {
    return this.pb
      .collection('leagues')
      .getList<League>(page, perPage, { sort: '-name' });
  }

  createLeague(body: CreateLeagueBody) {
    return this.pb.collection('leagues').create<League>(body);
  }

  updateLeague(id: string, body: Partial<CreateLeagueBody>) {
    return this.pb.collection('leagues').update<League>(id, body);
  }

  deleteLeague(id: string) {
    return this.pb.collection('leagues').delete(id);
  }
}
