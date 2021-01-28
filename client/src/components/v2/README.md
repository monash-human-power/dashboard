# V2 Components

This folder contains react components that are **only used for V2 views**.

## Structure

All components that relate to a *specific view* should be stored in a subfolder.

```
# A Dashboard specific component should be in its own folder
./dashboard/DashboardDropDown.tsx
./dashboard/DashboardDropDown.stories.tsx
./dashboard/DashboardDropDown.module.css
```

All components that are shared between V2 views can stay in this folder.

```
# A general V2 component should be stored in the base of this folder
./BigButton.tsx
./BigButton.stories.tsx
./BigButton.module.css
```
 