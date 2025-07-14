# V4 Components

This folder holds components that are needed only for V4 views.

## Structure

All components that relate to a _specific view_ should be stored in a subfolder.

```
# A Dashboard specific component should be in its own folder
./dashboard/DashboardDropDown.tsx
./dashboard/DashboardDropDown.stories.tsx
./dashboard/DashboardDropDown.module.css
```

All components that are shared between V4 views can stay in this folder.

```
# A general V4 component should be stored in the base of this folder
./BigButton.tsx
./BigButton.stories.tsx
./BigButton.module.css
```
