// Pages that exist behind the app shell today.
export const MAIN_NAV = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Habits', path: '/habits' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Friends', path: '/friends' },
  { label: 'Weekly Review', path: '/weekly-review' },
];


// Groups has no backend yet (no DB table or API routes) -- hardcoded here
// until that's built, so the sidebar has something to show. Workspaces is
// now real data, fetched via api.getworkspaces() in AppLayout.
export const PLACEHOLDER_GROUPS = ['Finals Study Group'];
