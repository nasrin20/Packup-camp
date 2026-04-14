import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendJoinRequestEmail({
  hostEmail,
  hostName,
  requesterName,
  tripTitle,
  tripId,
}: {
  hostEmail: string
  hostName: string
  requesterName: string
  tripTitle: string
  tripId: string
}) {
  await resend.emails.send({
    from: 'PackUp <noreply@packup.com.au>',
    to: hostEmail,
    subject: `${requesterName} wants to join your trip!`,
    html: `
      <h2>Hey ${hostName}!</h2>
      <p><strong>${requesterName}</strong> has requested to join your trip: <strong>${tripTitle}</strong></p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-trips" 
           style="background:#e8c87a;color:#0f1a0e;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">
          Review Request
        </a>
      </p>
      <p>Happy camping! 🏕️<br/>The PackUp Team</p>
    `,
  })
}

export async function sendRequestApprovedEmail({
  requesterEmail,
  requesterName,
  tripTitle,
  tripId,
  hostName,
}: {
  requesterEmail: string
  requesterName: string
  tripTitle: string
  tripId: string
  hostName: string
}) {
  await resend.emails.send({
    from: 'PackUp <noreply@packup.com.au>',
    to: requesterEmail,
    subject: `You're in! ${tripTitle}`,
    html: `
      <h2>You're going camping, ${requesterName}! 🎉</h2>
      <p><strong>${hostName}</strong> approved your request to join <strong>${tripTitle}</strong>.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/trips/${tripId}/chat"
           style="background:#e8c87a;color:#0f1a0e;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">
          Open Trip Chat
        </a>
      </p>
      <p>Happy camping! 🏕️<br/>The PackUp Team</p>
    `,
  })
}
