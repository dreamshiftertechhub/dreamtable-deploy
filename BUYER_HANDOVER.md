# DreamTable — restaurant website sales and handover

DreamTable is a **customisable demonstration website**, not a live restaurant or turnkey verified payment system. Sell customisation, setup and deployment as a service. Do not advertise the demo as an operating kitchen.

## What a buyer receives
- Responsive branded landing page, menu with categories and item details, cart and example plate builder.
- Design previews for reservation, catering, customer account, loyalty and administration features.
- Restaurant-specific configuration and a deployment handover.
- Existing imagery is illustrative. Items without a matching approved photograph deliberately show a labelled placeholder.

## Buyer intake checklist
Collect written approval for: legal/trading name, logo and usage rights, brand palette, actual street address and map pin, contact number, WhatsApp and email, business hours, delivery coverage, pickup arrangements, complete menu, ingredients/allergens, real prices, availability, photos and image licences, refund/privacy terms, domain ownership, and payment provider/account ownership. Never carry DreamTable's sample details into a buyer launch.

## Customisation locations
1. Edit `src/data/restaurant-config.ts` for brand and launch settings. The default is `mode: "demo"`; all operational gates are false.
2. Replace `src/data/menu.ts` with buyer-approved menu and prices; adjust `src/data/types.ts` categories, plate builder, delivery fees, promotions and labels.
3. Replace assets in `public/food/` with licensed, accurately matched photographs; update `src/components/food/menu-photo.tsx` only for confirmed item-to-photo matches. Replace the hero and gallery too.
4. Audit hard-coded DreamTable text and imagery across `src/components/`, `src/routes/`, page metadata and email templates before handover. The central configuration is a starting point, **not full white-labelling**.
5. Update footer, contact, story, FAQ, legal pages, emails, account screens, reservations, catering, checkout, transfer details, admin and order status pages to buyer-specific verified data.

## Go-live checklist (mandatory)
- Obtain the buyer's written approval of menu, pricing, photos, branding, address, contacts, policies and hours.
- Confirm domain/DNS, production database, backups, access roles, secrets, authentication and password-reset email delivery using a verified sending domain.
- Implement and test real server-side order persistence, kitchen notifications, inventory/availability, delivery fees and fulfilment, and reservation capacity/confirmation. Demo UI alone is not proof.
- Connect payment gateway to the buyer's verified account; verify webhook signatures, idempotency, amounts, status and refunds in test mode, then perform authorised production smoke tests. Never rely on a static transfer number or a browser-only success message.
- Test desktop/mobile, accessibility, broken links, form failures, auth, customer data isolation, legal/privacy and operational handover.
- Only after those checks, intentionally remove demo notices and enable operational features in a reviewed release. Changing `mode` alone does not activate them.

## Delivery and sale
Quote separately for template customisation, real ordering/payment integrations, domain/hosting, copy/photography, ongoing maintenance and training. Transfer ownership/access appropriately; remove seller credentials and demo/customer data. Keep a staging preview and obtain sign-off before changing production. Do not promise exclusive ownership of third-party libraries, photos or services without the corresponding licences.

## Current limitations
This branch is a prelaunch preview. Booking, catering, payment and checkout are intentionally unavailable. Some other routes still demonstrate interactions and must be audited before representing them as live customer services. Password-reset email requires verified domain/sender setup. Image licences and final buyer content remain to be supplied.
