using System;
using Newtonsoft.Json;

namespace API.FDC.Models;

public class Aggregations
{
    public DataType? dataType { get; set; }
    public Nutrients? nutrients { get; set; }
}

public class DataType
{
    public int Branded { get; set; }

    [JsonProperty("Survey (FNDDS)")]
    public int SurveyFNDDS { get; set; }

    [JsonProperty("SR Legacy")]
    public int SRLegacy { get; set; }
    public int Foundation { get; set; }
}

public class Food
{
    public int fdcId { get; set; }
    public string? description { get; set; }
    public string? dataType { get; set; }
    public string? gtinUpc { get; set; }
    public string? publishedDate { get; set; }
    public string? brandOwner { get; set; }
    public string? brandName { get; set; }
    public string? ingredients { get; set; }
    public string? marketCountry { get; set; }
    public string? foodCategory { get; set; }
    public string? modifiedDate { get; set; }
    public string? dataSource { get; set; }
    public string? packageWeight { get; set; }
    public string? servingSizeUnit { get; set; }
    public double servingSize { get; set; }
    public string? householdServingFullText { get; set; }
    public List<string>? tradeChannels { get; set; }
    public string? allHighlightFields { get; set; }
    public double score { get; set; }
    public List<object>? microbes { get; set; }
    public List<FoodNutrient>? foodNutrients { get; set; }
    public List<object>? finalFoodInputFoods { get; set; }
    public List<object>? foodMeasures { get; set; }
    public List<object>? foodAttributes { get; set; }
    public List<object>? foodAttributeTypes { get; set; }
    public List<object>? foodVersionIds { get; set; }
}

public class FoodNutrient
{
    public int nutrientId { get; set; }
    public string? nutrientName { get; set; }
    public string? nutrientNumber { get; set; }
    public string? unitName { get; set; }
    public string? derivationCode { get; set; }
    public string? derivationDescription { get; set; }
    public int derivationId { get; set; }
    public double value { get; set; }
    public int foodNutrientSourceId { get; set; }
    public string? foodNutrientSourceCode { get; set; }
    public string? foodNutrientSourceDescription { get; set; }
    public int rank { get; set; }
    public int indentLevel { get; set; }
    public int foodNutrientId { get; set; }
    public int percentDailyValue { get; set; }
}

public class FoodSearchCriteria
{
    public List<string>? dataType { get; set; }
    public string? query { get; set; }
    public string? generalSearchInput { get; set; }
    public int pageNumber { get; set; }
    public int numberOfResultsPerPage { get; set; }
    public int pageSize { get; set; }
    public bool requireAllWords { get; set; }
    public List<string>? foodTypes { get; set; }
}

public class Nutrients
{
}

public class SearchResult
{
    public int totalHits { get; set; }
    public int currentPage { get; set; }
    public int totalPages { get; set; }
    public List<int>? pageList { get; set; }
    public FoodSearchCriteria? foodSearchCriteria { get; set; }
    public List<Food>? foods { get; set; }
    public Aggregations? aggregations { get; set; }
}


