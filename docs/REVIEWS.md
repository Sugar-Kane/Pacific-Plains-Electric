# Customer reviews: a compliant workflow

Reviews are the strongest local trust signal for Google, and Google's rules for them are strict. This workflow stays inside them.

## The rules

- Ask **every** customer, not only the happy ones. Choosing who to ask based on how they feel ("review gating") violates Google's policy.
- Never offer a discount, gift, or entry into a drawing for a review.
- Never write, edit, or post a review for a customer, and never buy reviews.
- Don't ask family, friends, or employees to review the business.
- Reply to every review, positive or negative, briefly and without customer details.

## The routine

1. Finish the job and confirm the customer is satisfied with the work itself.
2. The same day, send the review link by text or email (templates below).
3. If there's no response, send one reminder after about a week. Then stop.
4. Reply to the review once it appears.

## Getting the link

Google Business Profile → **Ask for reviews** → copy the short link. Save it as `googleReviewUrl` in `config/business.ts`. The website shows a "Leave a Google review" button only when that is set.

## Templates

**Text**

> Hi {first name}, this is Nicholas with Pacific Plains Electric. Thanks for having me out for the {job}. If you have a minute, an honest review on Google helps other people in the area find us: {link}. Thank you!

**Email**

> Subject: Thanks from Pacific Plains Electric
>
> Hi {first name},
>
> Thank you for choosing Pacific Plains Electric for your {job}. If you have a couple of minutes, I'd appreciate an honest review on Google. It helps other homeowners in San Luis Obispo County find a local electrician.
>
> {link}
>
> If anything about the work isn't right, reply to this email and I'll take care of it.
>
> Nicholas Kane
> Pacific Plains Electric · CSLB #1162180

## Showing reviews on the website

Add real reviews to `config/reviews.ts` exactly as written, with the customer's permission (reviews already public on Google qualify). The reviews section appears on the home page once the list has entries. Don't add star-rating structured data: Google doesn't show review stars for a business's reviews of itself on its own site, and it can treat that markup as spam.
