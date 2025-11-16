# Migration from knockout to react

Note: I am not familiar with knockout so I will use react terminology
even when I am talking about the knockout legacy app

## Steps

1. Examine the data flow to see most used components
2. Identify which api endpoints are being used
    a. Preferably add tracing support to the apis to see which endpoints are being used more
3. Move authentication/authorization behind an api to simplify the migration (if used)

## Pilot

There are several options to do a pilot app: either we slowly add react to an existing app or
rewrite the whole app from top to bottom

I suggest a full rewrite because of these reasons:

1. Latest version of knockout is from 2019, so it is not actively developed and may contain some vulnerabilities
2. Adding react to an existing codebase will increase the amount of libraries used and may lead to a confusing mess

Initial pilot should only contain the main components and most important api calls

## Backend

Hopefully other than the authentication there won't be any major api changes, but if there are

- Notify the backend team of the potential changes
- Confirm the schema with them
- Keep them in the loop for next potential changes

## Risks and planning

Before the rewrite starts, evaluate:

- Which parts of the current Knockout codebase are tightly coupled or fragile
- Whether business logic is duplicated across UI and backend
- How to avoid regression by adding automated tests
- What infrastructure changes (build, CI/CD, bundling, versioning) must be introduced for React

## Implementation

- After a successful pilot run add other components step by step
- Add tests when applicable
- Add changes to api schema with the consultation of the backend team