using API.Resend.Models;

namespace API.Resend;

public interface IResendClient
{
    /// <summary>
    /// Send an email.
    /// </summary>
    /// <param name="email">
    /// Email.
    /// </param>
    /// <param name="cancellationToken">
    /// Cancellation token.
    /// </param>
    /// <returns>
    /// Email identifier.
    /// </returns>
    /// <see href="https://resend.com/docs/api-reference/emails/send-email"/>
    Task<ResendResponse<Guid>> EmailSendAsync( EmailMessage email, CancellationToken cancellationToken = default );
}
