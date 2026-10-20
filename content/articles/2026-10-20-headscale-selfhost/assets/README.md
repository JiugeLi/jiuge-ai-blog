# Article illustrations

- Generated through SoloAPI CLI using gpt-image-2.5; conceptual diagrams, not management screenshots.
- control-data.webp: Headscale coordination versus encrypted client data; original 1774 x 887.
- verification.webp: service, node, application and path-quality checks; original 1024 x 1536.
- Requested size was 1536 x 1024 for both; provider returned the dimensions above. Preserved original aspect ratios, visually checked Chinese labels and arrows, exported WebP using sharp with metadata stripped.
- Only generic labels were used. No production domains, device addresses, usernames, identifiers or credentials were included in generation prompts.

## Peer connection explanation

- peer-connection.webp: generated through SoloAPI CLI with gpt-image-2.5. Diagram specification: Headscale exchanges public keys and endpoint information with A/B; clients attempt UDP hole punching and WireGuard direct communication; a separate DERP path carries encrypted packets when direct communication is unavailable. Relay may be used first while clients keep trying direct paths.
- This is a conceptual diagram, not a packet trace. No production values or credentials were included. Preserve the returned aspect ratio and inspect labels/arrows before publication.

## Actual deployment screenshot

- headplane-redacted.webp: real Headplane Machines page, captured 2026-10-20 with eight Connected devices. Not AI-generated.
- Playwright screenshot masks cover the name/account text and address column with opaque blocks. Browser chrome, control hostname, cookies and credentials are absent. Exported with sharp without metadata; checked visually before publication.
- Keep screenshot masks opaque; blur or pixelation is not the publication privacy boundary. Do not commit an unredacted capture or browser session state.
