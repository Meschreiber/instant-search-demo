function autocompleteRenderFn(renderParams, isFirstRendering) {
  let {
      container,
    placeholder,
    delayTime,
    nbSuggestions,
    suggestionTemplate,
    suggestionsIndex
    } = renderParams.widgetParams;

  delayTime = delayTime ? delayTime : 500;
  nbSuggestions = nbSuggestions ? nbSuggestions : 5;
  //debounceTimer = null;


  if (isFirstRendering) {

    let $container = $(container);
    let inputClass = `autocomplete-input-${Date.now()}`;

    // If the autocomplete exists from a previous run of app(), remove it
    if ($container.find('.algolia-autocomplete')) {
      $container.find('.algolia-autocomplete').remove()
    }

    $container.append(
      `<input type="search" class="${inputClass}" id="aa-search-input" placeholder="${placeholder}"/>`
    );

    autocomplete(`.${inputClass}`, {
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
      $(`.${inputClass}`).val(suggestion.query);
      renderParams.refine(suggestion.query);
    });

    // This is the regular instantSearch update of results
    $container.find(`.${inputClass}`).on('input', function (event) {
      var lastQueryUpdatedAt = 0;
      var now = Date.now();
      
      if ((now - lastQueryUpdatedAt) < delayTime) {
      // console.log("Clearing timeout");
        clearTimeout(debounceTimer);
      }

      lastQueryUpdatedAt = now;
      debounceTimer = setTimeout(function () {
        renderParams.refine(event.target.value);
      }, delayTime);
      // console.log("Setting timeout", debounceTimer);
      return false;
    });
  }
}
