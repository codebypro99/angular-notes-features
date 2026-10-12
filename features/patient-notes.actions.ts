import { Note } from '../../../../shared/models/patient.models';

export class GetPatientNotes {
  static readonly type = '[Patients notes] Get Patient Notes';

  constructor(public patientId: string) {}
}

export class GetPatientNotesForSlide {
  static readonly type = '[Patients notes] Get Patient Notes for Slide';

  constructor(
    public patientId: string,
    public filters?,
  ) {}
}

export class CreatePatientNote {
  static readonly type = '[Patients notes] Create Patient Note';

  constructor(public payload) {}
}

export class SetCurrentNotes {
  static readonly type = '[Patients notes] Set current Note';

  constructor(public payload: Note) {}
}

export class EditPatientNote {
  static readonly type = '[Patients notes] Edit Patient Note';

  constructor(public payload: any) {}
}

export class DeletePatientNote {
  static readonly type = '[Patients notes] Delete Patient Note';

  constructor(public payload: { patientId: string; noteId: number }) {}
}
