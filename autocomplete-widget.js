function customMenuRenderFn(renderParams, isFirstRendering) {
    var {
      container,
      placeholder,
      delayTime,
      nbSuggestions,
      suggestionTemplate
    } = renderParams.widgetParams;
    delayTime = delayTime ? delayTime : 500;
    nbSuggestions = nbSuggestions ? nbSuggestions : 5;

    if (isFirstRendering) {
        // If the autocomplete exists from a previous run of app(), remove it
      if ($('.algolia-autocomplete').length > 0) {
        $('.algolia-autocomplete').remove()
      }

      $(container).append(
        `<input type="search" id="aa-search-input" placeholder="${placeholder}"/>`
      );

      autocomplete('#aa-search-input', {
        hint: false
      }, [{
        source: autocomplete.sources.hits(suggestionsIndex, {
          hitsPerPage: nbSuggestions,
          restrictSearchableAttributes: ['query']
        }),
        displayKey: 'name',
        templates: {
          suggestion: suggestionTemplate
        }
      }]).on('autocomplete:selected', function (event, suggestion, dataset) {
        $('#aa-search-input').val(suggestion.query);
        renderParams.refine(suggestion.query);
      });

      // This is the regular instantSearch update of results
      $(container).find('input').on('input', function (event) {
        var lastQueryUpdatedAt = 0;
        var debounceTimer = null;
        var now = (new Date()).getTime();
        if ((now - lastQueryUpdatedAt) < delayTime) {
          clearTimeout(debounceTimer);
        }

        lastQueryUpdatedAt = now;
        debounceTimer = setTimeout(function () {
          renderParams.refine(event.target.value);
        }, delayTime);
        return false;
      });
    }
  }
