# Reading guide — start here

This folder is an **onboarding map** for the MHP DAShboard repository. Read the files **in the order below** so each doc builds on the last.

## Step-by-step onboarding path

### Phase 1 — Orient yourself (about 5–10 minutes)

1. **[01_overview.md](./01_overview.md)**  
   What the product is, who uses it, and what problems it solves. No setup yet.

2. **[02_setup_and_run.md](./02_setup_and_run.md)**  
   Install dependencies, environment variables, and run the app locally. Stop when you can open the UI in a browser.

### Phase 2 — Mental model (about 15–20 minutes)

3. **[03_architecture.md](./03_architecture.md)**  
   Big picture: React + Express + Socket.IO + MQTT, and how they talk.

4. **[04_codebase_structure.md](./04_codebase_structure.md)**  
   Where folders live and what they own (client vs server, versioned UI).

5. **[05_execution_flow.md](./05_execution_flow.md)**  
   What runs first, how a page loads, and how a typical “live data” path works.

### Phase 3 — Features and domain (about 20–30 minutes)

6. **[06_feature_mapping.md](./06_feature_mapping.md)**  
   Each major screen/feature and the files that implement it (V2 / V3 / V4).

7. **[07_core_concepts.md](./07_core_concepts.md)**  
   DAS, MQTT topics, Socket.IO channels, bike versions, and shared `mhp` constants.

### Phase 4 — Day-to-day work (as needed)

8. **[08_testing_and_debugging.md](./08_testing_and_debugging.md)**  
   How to run linters/tests (limited today), and where to attach a debugger.

9. **[09_risks_and_complexity.md](./09_risks_and_complexity.md)**  
   Short list of “touch carefully” areas so you do not break live telemetry.

10. **[10_backlog_and_missing_pieces.md](./10_backlog_and_missing_pieces.md)**  
    High-level gaps and TODOs — useful for planning, not for blame.

11. **[11_how_to_start_contributing.md](./11_how_to_start_contributing.md)**  
    First tasks, safe edits, and a suggested “open these files” order for coding.

## After you finish the path

- Keep the **[repository root README.md](../README.md)** handy for copy-paste commands and the HTTP API table.
- Use **Storybook** in `client/` if you are changing isolated UI components (see `02_setup_and_run.md`).

## One-line summary

**Read 01 → 02 → 03 → 04 → 05, then 06 → 07, then dip into 08–11 as you code.**
