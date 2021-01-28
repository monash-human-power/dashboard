# Common Components

This folder contains react components that are **SHARED** between V2 and V3 views.

## Structure

All components that relate to a *specific view* should be stored in a subfolder.

```
# A Dashboard specific component should be in its own folder
./dashboard/DashboardDropDown.tsx
./dashboard/DashboardDropDown.stories.tsx
./dashboard/DashboardDropDown.module.css
```

All components that are not bound to one view should be stored in the base of the folder.

```
# A general component should be stored in the base of this folder
./BigButton.tsx
./BigButton.stories.tsx
./BigButton.module.css
```