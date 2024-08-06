﻿using System.Text.Json.Serialization;

namespace API.Resend.Models;

/// <summary>
/// Email address.
/// </summary>
[JsonConverter( typeof( EmailAddressConverter ) )]
public class EmailAddress
{
    /// <summary>
    /// Email address.
    /// </summary>
    public string Email { get; set; } = default!;

    /// <summary>
    /// Display name.
    /// </summary>
    public string? DisplayName { get; set; }


    /// <summary />
    public static implicit operator EmailAddress( string email ) => new EmailAddress() { Email = email };
}