using API.Resend.Models;
using API.Resend.Payloads;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Reflection;
using System.Security;

namespace API.Resend;

/// <summary>
/// Resend client implementation.
/// https://github.com/filipetoscano/resend.net/tree/master
/// </summary>
public class ResendClient : IResendClient
{
    private readonly bool _throw;
    private readonly HttpClient _http;


    /// <summary>
    /// Initializes a new instance of ResendClient client.
    /// </summary>
    /// <param name="options">
    /// Configuration options.
    /// </param>
    /// <param name="httpClient">
    /// HTTP client instance.
    /// </param>
    /// <param name="config">
    /// App settings configuration
    /// </param>
    public ResendClient( IOptions<ResendClientOptions> options, HttpClient httpClient, IConfiguration config)
    {
        /*
         * Authentication
         */
        var opt = options.Value;
        var url = opt.ApiUrl;
        var token = !String.IsNullOrEmpty(opt.ApiToken) ? opt.ApiToken : config["ResendAPIKey"];

        if(String.IsNullOrEmpty(url)) throw new Exception("Resend Api Url is empty");
        if(String.IsNullOrEmpty(token)) throw new Exception("Missing Resend API Key");

        httpClient.BaseAddress = new Uri( url );
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue( "Bearer", token );


        /*
         * Ask for JSON responses. Not necessar atm, since Resend always/only
         * answers in JSON -- but good for future proofing.
         */
        httpClient.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue( "application/json" ) );


        /*
         * Identification
         */
        var productValue = new ProductInfoHeaderValue( "resend-sdk", Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "0.0.0" );
        var dotnetValue = new ProductInfoHeaderValue( "dotnet", Environment.Version.ToString() );

        httpClient.DefaultRequestHeaders.UserAgent.Add( productValue );
        httpClient.DefaultRequestHeaders.UserAgent.Add( dotnetValue );

        _http = httpClient;
        _throw = options.Value.ThrowExceptions;
    }


    /// <inheritdoc />
    public async Task<ResendResponse<Guid>> EmailSendAsync( EmailMessage email, CancellationToken cancellationToken = default )
    {
        var resp = await _http.PostAsJsonAsync( "/emails", email, cancellationToken );

        resp.EnsureSuccessStatusCode();

        var obj = await resp.Content.ReadFromJsonAsync<ObjectId>( cancellationToken: cancellationToken );

        if ( obj == null )
            throw new InvalidOperationException( "Received null response" );

        return new ResendResponse<Guid>( obj.Id );
    }
}