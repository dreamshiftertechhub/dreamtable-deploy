# RealMeal owner recovery — controlled operation

Intended new owner email: gbolahanolatunde111@gmail.com. This is NOT an automatic admin allowlist. Never assign owner privilege from a public registration email.

1. Verify control of the inbox through a one-time email link. Never share passwords or tokens in chat.
2. Configure RESEND_API_KEY and a verified sender in encrypted Vercel settings; verify reset email delivery end-to-end.
3. Authorized database operator backs up production and checks current owner house_members row, target Better Auth user ID and order/staff references.
4. Register target normally if absent; verify identity and explicit authorization for ownership transfer.
5. In one controlled database transaction, transfer only the owner seat to the verified target user ID, preserving orders, customers, staff and other roles; enforce one owner.
6. Revoke former owner sessions; reset target password via verified link; test /admin and /admin/staff, and verify customer accounts cannot gain staff access.
7. Record an internal audit entry without secrets.

No database change or ownership transfer is performed by this document. Do not expose the owner's personal email in public website copy. Never delete the entire auth database as a shortcut.
