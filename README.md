# Angular Notes Management Feature Samples

Angular and NGXS excerpts demonstrating note-loading actions, selected-note state, API mutation coordination, and route-level preloading.

## Purpose

These samples show how I separate note operations into action contracts, state handlers, and a resolver. Original patient-domain identifiers are retained; no patient records are included in these files.

## Action Contracts

**Source:** [patient-notes.actions.ts](./features/patient-notes.actions.ts)

Defines actions for loading notes with shared filters, loading notes with caller-supplied filters, creating, selecting, editing, and deleting a note.

**What this demonstrates:** distinguishing data-loading contexts and mutation operations through explicit action classes.

## Notes State

**Source:** [patient-notes.state.ts](./features/patient-notes.state.ts)

- Stores the notes list, total count, and current note.
- Exposes selectors for those three values.
- Converts search, sorting, pagination, author, and reason filters into request parameters.
- Loads the standard list using the shared notes filter model and clears the previous list before fetching.
- Supports a separate loading action with caller-supplied filters, writing into the same list/count state.
- Stores the newly created note as currentNote after a successful create operation.
- Allows direct selection of a note through a synchronous state action.
- Returns service observables for editing and deletion.

**What this demonstrates:** coordinating list loading and note selection while keeping API access in a dedicated service.

## Route Preloading

**Source:** [patient-notes.resolver.ts](./features/patient-notes.resolver.ts)

When the route contains an id parameter, the resolver dispatches actions to load notes, reason-filter options, and representative-filter options. It takes one store snapshot before returning the dispatch observable to the router.

**What this demonstrates:** coordinating feature data and filter prerequisites at the navigation boundary.

## Technologies

Angular dependency injection and Router resolvers, NGXS actions and selectors, TypeScript, and RxJS observables.

## Excerpt Context and Behavior Boundaries

The note model, API service, shared filter state, reason and representative actions, consuming components, and route registration belong to the surrounding application.

Edit and delete handlers do not patch the list or current note; refresh coordination is outside the excerpts. Both loading actions write to the same state fields. The optional filters argument is passed to a helper that destructures it without a fallback, so callers must supply a suitable object for that path.

The state initializes currentNote to null despite declaring it as Note; compatibility depends on the surrounding type definition and compiler settings. Some action payloads and filter values use broad or implicit types. Loading flags, error state, and overlapping-request coordination are not implemented here.

Original source code and imports are preserved. The files are grouped for portfolio review rather than recreating their original workspace layout. Descriptions are based on source inspection; the excerpts have not been compiled or executed in isolation.

## Portfolio Message

I can organize Angular notes features around explicit operations, selector-based state access, shared filter preparation, and route-level prerequisite loading.
