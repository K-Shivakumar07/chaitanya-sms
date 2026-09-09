# Modern 3D Student Selection Page

## Goal
Redesign the B.Tech branch and semester selection page using the selected neumorphic glass direction, while preserving its current selection behavior and navigation.

## Implementation
- Replace the current page styling with a dimensional Electric Campus interface using deep navy, vivid blue, cyan, and crisp light surfaces.
- Apply Sora to headings and Manrope to supporting text through the shared design system.
- Present all seven branch choices as tactile 3D cards with clear selected, hover, focus, and keyboard states.
- Present all eight semesters in a compact dashboard grid, unlocked only after a branch is selected.
- Keep the module-switch action and direct semester-to-dashboard navigation unchanged.
- Add restrained depth motion, floating academic geometry, and reduced-motion support without adding unrelated features.
- Ensure the composition adapts cleanly to mobile and desktop screens.

## Technical details
- Add semantic color, shadow, and motion tokens to the global stylesheet and Tailwind theme.
- Rework only the student selection page presentation and shared typography setup.
- Validate the page in the running preview at desktop and mobile widths, then confirm the current build is clean.
