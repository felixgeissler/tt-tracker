import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  computed,
  inject,
  signal,
} from '@angular/core';
import { League, LeagueService } from '../league.service';

@Component({
  selector: 'app-league-list',
  standalone: true,
  imports: [],
  templateUrl: './league-list.component.html',
  styleUrl: './league-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueListComponent implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly leagueService = inject(LeagueService);

  private readonly perPage = 10;
  private readonly threshold = 100;

  page = 1;
  totalItems = signal(0);
  totalPages = signal(0);
  leagues = signal<League[]>([]);
  isLoading = signal(false);
  allLeaguesLoaded = computed(() => this.leagues().length >= this.totalItems());

  private unlistenScroll?: () => void;

  ngOnInit() {
    this.loadLeagues();

    this.unlistenScroll = this.renderer.listen(document, 'scroll', () => {
      this.ngZone.runOutsideAngular(() => {
        const currentPosition = window.innerHeight + window.scrollY;
        const endOfPage = document.documentElement.scrollHeight;
        const atBottomOfPage = currentPosition >= endOfPage - this.threshold;

        if (atBottomOfPage) {
          this.ngZone.run(() => {
            if (this.page < this.totalPages()) {
              this.page++;
              this.loadLeagues();
            }
          });
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.unlistenScroll) {
      this.unlistenScroll();
    }
  }

  async loadLeagues() {
    const result = await this.leagueService.getLeagueList(
      this.page,
      this.perPage
    );
    this.leagues.update(leagues => [...leagues, ...result.items]);
    this.totalItems.set(result.totalItems);
    this.totalPages.set(result.totalPages);
    this.cdr.markForCheck();
  }
}
