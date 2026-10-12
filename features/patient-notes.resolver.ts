import { ResolveFn } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetPatientNotes } from '../store/patient-notes/patient-notes.actions';
import { GetPatientNoteReasonsFilters } from '../store/patient-static/patient-static.action';
import { GetRepresentativeListForFilter } from '../../../dashboard/store/employees/employees.actions';

export const patientNotesResolver: ResolveFn<Observable<void> | Promise<void>> = (route, state, store = inject(Store)) => {
  const actions = [];
  if (route?.params?.id) {
    actions.push(new GetPatientNotes(route?.params?.id));
    actions.push(new GetPatientNoteReasonsFilters(route?.params?.id));
    actions.push(new GetRepresentativeListForFilter());
  }
  return store.selectOnce(stateStore => stateStore).pipe(switchMap(() => store.dispatch(actions)));
};
