# Wire loop game

These instructions capture the intended experience for the 2026 Christmas game. Keep mobile and desktop layouts and input handling distinct while sharing the routes and game rules.

## Mobile

- Treat the phone experience as mobile-first. The game fits the visible viewport without page scrolling, with the track running from bottom to top, the next section visible ahead, and controls below the track so fingers do not obscure it. Keep track labels upright and readable.
- Starting a run begins slow automatic forward movement. The left and right buttons steer smoothly; holding both stops the loop, while the timer, sparks, and other game effects continue. The middle button is labeled “Boost” in both languages and increases forward speed only while held. Players can steer and boost at the same time. Do not restore automatic acceleration near sparks.
- Keep the controls stationary and responsive. Prevent text selection, iOS long-press callouts, and visual movement or scaling of the buttons. Retain a visible pressed state. Explain the controls in both English and German.
- Balance forward speed, boost, sideways steering, track slopes, and sparks together. Players must have a practical opportunity to pass moving sparks, including the vertical section on day 24. Holding both arrows should provide a way to wait for an opening.
- Clouds must obscure the wire while retaining soft edges. Avoid expensive live blur and excessive particle updates on the moving mobile track: an iPhone 15 previously stuttered. Preserve smooth controls and continuously update hazard positions and collisions.

## Desktop and shared rules

- Preserve the horizontal desktop track and mouse controls. After pressing Start, the loop stays at the start until the player clicks it; moving the mouse or clicking elsewhere must not begin the run. Clicking the loop's edge should not cause immediate failure.
- The handle is a single visible loop with no grip or stem. Contact between the wire and the inner edge of the loop ends the run. Keep collision detection aligned with the visible loop and wire dimensions.
- Preserve the daily routes, day selection, timer, best times, spark and fog behavior, and existing visual style unless a request calls for changes. Changes to mobile must not inadvertently shrink or break the desktop track.

## Verification

- Run `node --check xmas-2026/wire-loop.js` and `git diff --check` after JavaScript or layout changes.
- Use a headless browser for interaction changes. Actually start the game and exercise the affected controls; check mobile steering, Boost, simultaneous-button stopping, and release behavior as applicable. Also verify desktop sizing, clicking the loop, mouse movement, and collision behavior when shared code changes.
- Check that the game, day picker, and result overlay fit representative mobile viewport sizes without page scrolling. Use a local `?day=24` URL when checking the late-game route; the day override is restricted to local hosts.
- Headless Chrome does not establish iOS Safari behavior or real-device performance. When relevant, test on an iPhone, including long presses, fog appearance, stutter, and whether the day 24 spark crossing is playable; report any verification not performed.
