# Implementation notes for your own walkthrough

This is a reference plan, not a claim that the integrations have been built. The speaker asks for your own technical reasoning. Review these decisions, implement the parts you choose and explain them in your own words.

## Copy ready to use

Headline: Less scrambling. More peace of mind.

Subheadline: Get The Family Health Playbook — a free, practical guide to organize the essentials and start a simple plan for the people you love.

Benefits:
- Keep trusted contacts and important document locations in one place.
- Make a simple backup plan with a 20-minute family check-in.
- Start asking useful questions about your family's financial protection.

Button: Get my free playbook

Optional checkbox, two-line core copy:
“Yes — help me understand how life insurance could help protect my family's financial future.
I'd like a no-obligation conversation with a life insurance advisor.”

Supporting explanation: An advisor may contact me about this request. This is optional — I'll get the playbook either way.

The guide download does not depend on agreeing to a call. Leave this checkbox unchecked by default. The live business should supply the named advisor/business, privacy information and approved contact-consent text before launch.

## WordPress and WPForms setup

1. Build the landing page on staging using Elementor or Gutenberg. Embed a real WPForms form, using the demo as the design/copy reference.
2. Fields: first name, email, agreed qualification questions, optional consultation checkbox, conditional callback phone, optional callback preference and time zone. Use visible labels. Collect only the fields needed for the selected path.
3. Confirm the actual qualification rule. The video says “let's say” income above $100,000; the demo uses this illustrative rule. Do not infer actual insurance eligibility from this answer.
4. Use WPForms conditional logic to show the consultation offer when the agreed criteria match. Show and require phone only when a consultation is requested. On the backend, ignore stale hidden call values when the request is not selected.
5. Create two published thank-you pages: /playbook-ready/ for general leads and /playbook-ready-next-step/ for qualified leads. Both provide the guide. The qualified page can show an optional next step; it must not claim a call is requested unless explicit consent was recorded.
6. In Settings > Confirmations, use the general route as the fallback and a qualified conditional redirect for matching entries. A third conditional confirmation/page can distinguish qualified + consultation requested if desired. The single static thank-you.html in this demo demonstrates these variants using harmless state flags; it is not a secure production classifier.
7. On successful form processing, save the entry and send a transactional email with the PDF link. Configure an authenticated email sender. Download delivery should not depend on the CRM automation succeeding.

## WPForms -> Zapier -> chosen CRM

Use the WPForms Zapier addon and New Form Entry trigger; select this form. Connect to one chosen CRM, such as GHL or HubSpot, rather than duplicating contacts in both by default.

Suggested mapping:
- WPForms entry ID -> source entry ID / idempotency key
- First name and email -> contact fields
- Qualification result -> qualification status
- Consultation checkbox -> explicit consultation_requested boolean
- Phone and callback preference -> call fields only when requested
- Timestamp and displayed consent-copy version -> consent evidence
- Source page and campaign tags -> attribution, if collected appropriately

On every valid entry, find/update the CRM contact and mark the guide request. Preserve separate submission records so retries do not duplicate tasks, and do not replace unrelated marketing permissions.

Route by two independent facts:
- General lead: guide delivery, general source tag, no advisor task.
- Qualified + no consultation request: guide delivery and qualification status, no advisor task.
- Qualified + consultation requested: guide delivery, qualification status and an advisor follow-up task/notification with the contact request.

Use filters/paths to stop advisor follow-up unless both conditions are true. Store an automation success marker per entry; retry failed syncs without resending the guide or duplicating the advisor task. Log failures and notify the operator. Keep API keys in the integration's secure connection settings.

Do not send callback requests from browser query strings; route from the validated saved entry. Do not put email, phone or income answers in redirect URLs.

## Meta Pixel measurement plan

Install the client's actual Pixel through the site's chosen integration after checking for an existing installation. This demo loads no trackers.

Plan a Lead event after successful guide form processing. Track a distinct qualified-lead signal only for server-validated qualified entries. Track consultation-request as a request, not as a completed appointment. Agree on event names and reporting definitions before implementation.

Prevent refresh/revisit duplicates with per-entry event state. If browser Pixel and server Conversions API both report the same conversion, use the same event name and event ID to deduplicate. Respect the site's consent controls; send no raw income answers or contact details as event custom parameters. A thank-you page URL alone is not proof that a valid entry was created.

## Test before production

- Invalid email and missing required fields: no successful entry or conversion event.
- Below/at the example threshold and unanswered/prefer-not-to-say: general route, guide available, no advisor task.
- Above threshold + unchecked offer: qualified route, guide available, no advisor task.
- Above threshold + checked offer: phone required, guide available, advisor task created once.
- Change income after checking offer: clear checkbox and call details, no stale callback request.
- Email delivery and PDF download work on mobile and desktop.
- CRM failure does not break the download; retry does not duplicate records/tasks.
- Pixel disabled without required consent; refresh does not duplicate conversion events.

## Suggested walkthrough order

Show the landing copy. Open the sample PDF. Demonstrate a general lead and a qualified lead, first without and then with the consultation checkbox. Explain why qualification and permission to contact are separate. Show your real WPForms conditions and Zapier mapping when implemented. State clearly which parts are only a demo.

## Official setup references

- WPForms confirmation types: https://wpforms.com/docs/setup-form-confirmation-wpforms/
- WPForms conditional confirmations: https://wpforms.com/docs/how-to-create-conditional-form-confirmations/
- Zapier prerequisites and WPForms connection: https://help.zapier.com/hc/en-us/articles/8496033440269-How-to-get-started-with-WPForms-on-Zapier

At the time checked, the official Zapier guide lists WPForms Pro or higher, the Zapier addon, a verified license and an HTTPS site as prerequisites. Verify your installed plan before building the live connection.
