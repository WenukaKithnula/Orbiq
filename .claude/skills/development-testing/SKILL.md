---
name: development-testing
description: Mandatory post-implementation testing workflow — after implementing, modifying, or completing any feature, bug fix, UI change, or API change, use the browser automation tool to actually run the affected use case end-to-end (open the app, click through it, submit forms, check the network/console) rather than assuming the code works. If testing reveals a failure, stop and report what happened instead of silently fixing it, unless the user explicitly asks for a fix. Use this whenever a code change is about to be reported as done, whenever the user asks "does this actually work," "test this in the browser," "verify this feature," or similar, and always before saying a change was "implemented successfully."
---

# Development Testing Skill

## Purpose

Whenever you implement, modify, or complete any feature, bug fix, UI change, API change, or other code implementation, you MUST perform development testing against the running application before considering the task complete.

The goal is to verify that the implementation actually works from the user's perspective.

## Core Rule

After implementing any change:

1. Start or use the application's local development server.
2. Open the application in the browser.
3. Identify the use cases affected by the implementation.
4. Test those use cases yourself.
5. Verify the actual behavior in the browser.
6. Check for frontend errors, API errors, failed requests, and unexpected behavior.
7. If the implementation does not work correctly, DO NOT fix the problem automatically.
8. Instead, stop and clearly report what is happening, where it happens, and what appears to be causing it.
9. Only fix the problem if the user explicitly asks you to fix it.

## Browser Testing

Use the available browser automation tool to interact with the application.

Do not only inspect the source code and assume the feature works.

Actually perform the relevant actions, such as:

* Open the application
* Navigate between pages
* Click buttons
* Fill forms
* Submit forms
* Select values
* Search
* Create records
* Edit records
* Delete records
* Verify validation messages
* Verify success/error messages
* Verify API responses
* Verify data displayed in the UI
* Verify routing
* Verify authentication behavior

## Test the Complete Use Case

Do not test only the code that was changed.

For example, if implementing:

"Add a Create Workspace feature"

Test the complete flow:

1. Open the application.
2. Login if required.
3. Navigate to the workspace page.
4. Click "Create Workspace".
5. Enter valid data.
6. Submit the form.
7. Verify the API request succeeds.
8. Verify the new workspace appears in the UI.
9. Refresh the page.
10. Verify the workspace still exists if persistence is expected.

Also test important negative cases where appropriate:

* Empty input
* Invalid input
* Duplicate data
* API failure
* Unauthorized access
* Invalid route

## Regression Testing

After implementing a change, consider whether existing functionality could have been affected.

Run relevant existing tests and perform relevant browser checks.

For example, if changing authentication:

* Login
* Logout
* Protected routes
* Session persistence
* Unauthorized access

If changing a shared component:

* Test the affected page
* Test other pages using the component when practical

## Console and Network Checks

During browser testing, check for:

* JavaScript errors
* React errors
* Failed API requests
* HTTP 4xx responses
* HTTP 5xx responses
* CORS errors
* Failed network requests
* Unexpected redirects
* Authentication errors

Do not ignore browser console errors simply because the UI appears to work.

## If Something Fails

DO NOT automatically modify the code to fix the failure.

Instead, report:

### What I Tested

Describe the exact use case.

### What Happened

Describe the actual behavior.

### Expected Behavior

Describe what should have happened.

### Evidence

Include useful information such as:

* Browser error
* Console error
* API endpoint
* HTTP status
* Request/response issue
* Screenshot if available
* Relevant stack trace

### Suspected Cause

If you can identify a likely cause, explain it clearly.

Do not present speculation as confirmed fact.

### Example

FAIL: Create Workspace

Steps:

1. Opened `/workspaces`
2. Clicked `Create Workspace`
3. Entered `Test Workspace`
4. Clicked `Create`

Expected:

A new workspace should appear in the workspace list.

Actual:

The button triggers a POST request to `/api/workspaces`, but the request returns HTTP 500.

Evidence:

`POST /api/workspaces → 500 Internal Server Error`

The frontend receives the error and does not add the workspace.

Suspected cause:

The backend appears to be failing while inserting the workspace. Further backend investigation is required.

Do NOT fix this automatically.

## Do Not Claim Success Without Testing

Never say:

"Implemented successfully"

unless the implementation has actually been tested.

Never assume that:

* The code compiles
* The API exists
* The UI works
* The database operation succeeds
* Routing works
* Authentication works

just because the source code looks correct.

## Test Boundaries

Focus testing on the implementation and its affected use cases.

Do not spend excessive time testing unrelated parts of the application.

If the application cannot be started, report that instead of pretending the feature was tested.

If browser automation is unavailable, clearly state:

"Browser testing could not be performed because browser automation is unavailable."

Do not claim that browser testing was completed.

## Important Instruction

The user's explicit implementation request takes priority over this testing workflow.

However, after implementation, always perform development testing before reporting completion.

If testing reveals a problem:

STOP.

Do not fix the problem unless the user explicitly asks you to fix it.

Report the problem clearly so the user can decide what to do next.
