import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatientsService } from '../../../../dashboard/services/patients.service';
import { Observable } from 'rxjs';
import { FiltersKeyEnum } from '../../../../shared/enums/filtersKey.enum';
import { tap } from 'rxjs/operators';
import { removeEmptyObjectValues } from '../../../../shared/helpers/other';
import { Note } from '../../../../shared/models/patient.models';
import {
  CreatePatientNote,
  DeletePatientNote,
  EditPatientNote,
  GetPatientNotes,
  GetPatientNotesForSlide,
  SetCurrentNotes,
} from './patient-notes.actions';
import { List } from '../../../../shared/models';

export interface PatientNotestModel {
  notesList: Note[];
  notesTotal: number;
  currentNote: Note;
}

export const defaultState: PatientNotestModel = {
  notesList: [],
  notesTotal: 0,
  currentNote: null,
};

@State({
  name: 'patientNotes',
  defaults: defaultState,
})
@Injectable({
  providedIn: 'root',
})
export class PatientNotesState {
  constructor(
    private service: PatientsService,
    private store: Store,
  ) {}

  @Selector() static notesList(state: PatientNotestModel) {
    return state.notesList;
  }

  @Selector() static notesTotal(state: PatientNotestModel) {
    return state.notesTotal;
  }

  @Selector() static currentNote(state: PatientNotestModel) {
    return state.currentNote;
  }

  getFilters(filtersValue: any): any {
    const { search, order, dir, page, perPage, authors, reasons } = filtersValue;
    return removeEmptyObjectValues({
      page,
      perPage,
      order,
      dir,
      search,
      '[authors]': authors,
      '[reasons]': reasons,
    });
  }

  @Action(GetPatientNotesForSlide)
  getPatientNoteListForSlide(ctx: StateContext<PatientNotestModel>, { patientId, filters }: GetPatientNotesForSlide): Observable<List<Note[]>> {
    return this.service
      .getPatientNotes(patientId, {
        ...this.getFilters(filters),
      })
      .pipe(
        tap(({ data, total }: List<Note[]>) => {
          ctx.patchState({
            notesList: data,
            notesTotal: total,
          });
        }),
      );
  }

  @Action(GetPatientNotes)
  getPatientNoteList(ctx: StateContext<PatientNotestModel>, { patientId }: GetPatientNotes): Observable<List<Note[]>> {
    const filtersValue = this.store.selectSnapshot(({ filters }) => filters[FiltersKeyEnum.PatientNotes].model);
    ctx.patchState({
      notesList: [],
      notesTotal: 0,
    });
    return this.service
      .getPatientNotes(patientId, {
        ...this.getFilters(filtersValue),
      })
      .pipe(
        tap(({ data, total }: List<Note[]>) => {
          ctx.patchState({
            notesList: data,
            notesTotal: total,
          });
        }),
      );
  }

  @Action(CreatePatientNote)
  createPatientNote(ctx: StateContext<PatientNotestModel>, { payload }: CreatePatientNote): Observable<Note> {
    return this.service.createPatientNote(payload).pipe(
      tap(data => {
        ctx.patchState({
          currentNote: data,
        });
      }),
    );
  }

  @Action(SetCurrentNotes)
  setCurrentNotes(ctx: StateContext<PatientNotestModel>, { payload }: SetCurrentNotes): void {
    ctx.patchState({
      currentNote: payload,
    });
  }

  @Action(DeletePatientNote)
  deletePatientNote(ctx: StateContext<PatientNotestModel>, { payload }: DeletePatientNote): Observable<void> {
    return this.service.deletePatientNote(payload);
  }

  @Action(EditPatientNote)
  editPatientNote(ctx: StateContext<PatientNotestModel>, { payload }: EditPatientNote): Observable<any> {
    return this.service.editPatientNote(payload);
  }
}
