using System;
using System.Net.Http.Headers;
using API.DTOs;
using API.FDC.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.FDC;

public class FDCClient : IFDCClient
{
    private readonly bool _throw;
    private readonly HttpClient _http;

    private readonly string _apiKey;

    public FDCClient( IOptions<FDCClientOptions> options, HttpClient httpClient, IConfiguration config)
    {
        var opt = options.Value;
        var url = opt.ApiUrl;
        _apiKey = config["FDCApiKey"]!;

        if(String.IsNullOrEmpty(url)) throw new Exception("FDC Url is empty");
        if(String.IsNullOrEmpty(_apiKey)) throw new Exception("Missing FDC API Key");

        httpClient.BaseAddress = new Uri( url );

        httpClient.DefaultRequestHeaders.Accept.Add( new MediaTypeWithQualityHeaderValue( "application/json" ) );
        _http = httpClient;
        _throw = options.Value.ThrowExceptions;
    }

    public async Task<SearchResult> SearchFood(SearchFoodRequestDto searchFoodRequestDto)
    {
      if(searchFoodRequestDto.Query == null)
        throw new Exception("Missing Query");

      var request = new FDCRequest{
        Query = searchFoodRequestDto.Query,
        DataType = [
            "Foundation",
            "SR Legacy",
            "Branded"
        ],
        PageSize = 50,
        PageNumber = 1
    };
      var resp = await _http.PostAsJsonAsync( "foods/search?api_key=" + _apiKey, request );

       var obj = await resp.Content.ReadFromJsonAsync<SearchResult>();

        if ( obj == null )
            throw new InvalidOperationException( "Received null response" );

        return obj;
    }

}
