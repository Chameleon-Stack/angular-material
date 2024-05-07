import {
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ICard } from '@interfaces/card/card.interface';
import { IUser } from '@interfaces/user/user.interface';
import { CardService } from '@services/card/card.service';
import { FilterEventService } from '@services/filter-event/filter-event.service';
import { TaskEventService } from '@services/task-event/task-event.service';

import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChildren(CdkDropList) public dropLists!: QueryList<CdkDropList>;
  public headers: string[] = ['Não iniciado', 'Em progresso', 'Completo'];
  public cards: ICard[] = [];
  private user!: IUser;

  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private taskEventService: TaskEventService,
    private dialog: MatDialog,
    private filterEventService: FilterEventService,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
        this.updateCards(user.id);
      }
    });

    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.taskEventService.get().subscribe(() => {
      if (this.user) {
        this.updateCards(this.user.id);
      }
    });

    this.filterEventService.get().subscribe((filter: string) => {
      if (filter && this.user) {
        this.updateCards(this.user.id, { title: filter });
      }
    });
  }

  private updateCards(userId: string, filter?: { title: string }): void {
    this.cardService.get(userId, filter).subscribe((cards: ICard[]) => {
      this.cards = cards;
    });
  }

  public getCardsByStatus(status: string): ICard[] {
    return this.cards.filter((card) => card.status === status) || [];
  }

  public openDialog(status?: string): void {
    this.dialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { status: status },
    });
  }

  public drop(event: CdkDragDrop<ICard[]>): void {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedItem = event.container.data[event.currentIndex];
      movedItem.status = event.container.id;

      this.cardService.update(movedItem.id, movedItem).subscribe({
        next: (updatedCard: ICard) => {
          this.snackBar.open(
            'Status do cartão atualizado com sucesso!',
            'Fechar',
            {
              duration: 2000,
            }
          );
        },
        error: (error: any) => {
          this.snackBar.open(
            'Erro ao atualizar o status do cartão.',
            'Fechar',
            {
              duration: 2000,
            }
          );
        },
      });
    }
  }
}
