Query Suggestions + an almost InstantSearch UX
====================

A recent client asked us for an interesting UX: it was a combination of query suggestions and Instant Search, with a delay on the instant search results to limit the visual noise when people are looking at query suggestions.  Alex C. demoed it for them and I built something similar so that we could have a not-NSFW version 😉 to show other prospects/customers who might be interested in the same. I've built it on top of of our generic [BestBuy IS](https://github.com/algolia/instant-search-demo) with a custom widget.  You can find the demo [here](https://internal-preview.algolia.com/delayed-hits-demo/).

![Autocomplete+IS](autocompleteIS-640.gif)

I'm interested in your feedback on some of the following points: Have you experienced a desire for this kind of UX either yourself or from customers? What could be improved about it? Can you think of a better name?  If you have the time and interest, I would greatly appreciate your responses [here](https://docs.google.com/forms/d/e/1FAIpQLScFP07aFtvyc5bt1H7Xjsef7JlROng7apRXcu5ruUQnmmNngg/viewform) or you are welcome to send them to me directly or create an issue.  If the feedback I receive confirms we should push this UX to our users, I will write a tutorial on how to create this custom widget so that others could easily create the same UX.

### The autocomplete dropdown
The suggestions are pulled from a separate suggestions index that was built using the SuggestQueries connector that is currently in beta.  The connector uses the most popular queries from analytics data on a chosen index and is updated at a regular, configurable basis.

### Query suggestions
I also included a few query rules, just for fun. 😊 Feel free to try them out.
1) On a query containing 'best', filter for products w/ 5 stars
2) On a query containing 'video games', promote Guitar Hero games
3) On a query containing 'free shipping', display a free-shipping banner and filter results so only those with free shipping appear.
4) On a query containing 'smartphone', display banners for particular apple and samsung products
5) If a brand name is typed, filter on that brand

### Code
- [`autocomplete-widget.js`](autocomplete-widget.js) holds the function to be passed to the SearchBox connector to -create the autocomplete widget.
- [`banner-widget.js`](banner-widget.js) holds the widget which displays promotional and free shipping banners
- [`config.js`](config.js) holds configurations for query rules and synonyms 

### Known issues
- [ ] The dropdown covers up the first hits. Originally I added additional padding to have those display the drop-down but I was advised to leave it as is. 

