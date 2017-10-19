Instant-Search Demo Addition
====================

This demo adds two small features to the already fully-featured [instant search demo](https://github.com/algolia/instant-search-demo).

### An autocomplete dropdown
The suggestions are pulled from a separate already existing suggestion index.  Rendering hits is delayed for a configurable amount of time, currently set to 600ms.  The motivation to create this was to have a not-NSW version of Alex's MindGeek demo where most users were on mobile and found it glitchy to have both suggestions and hits appear at the same time. 


### Query suggestions
Just for fun! 😁 
1) On a query containing 'best', filter for products w/ 5 stars
2) On a query containing 'video games', promote Guitar Hero games
3) On a query containing 'free shipping', display a free-shipping banner and filter results so only those with free shipping appear.
4) On a query containing 'smartphone', display banners for particular apple and samsung products
5) If a brand name is typed, filter on that brand

### Known issues
-[ ] The dropdown covers up the first hits. Originally I added additional padding to have those display the drop-down but I was advised to leave it as is. 

