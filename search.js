/* global instantsearch */

app({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search'
});

function app(opts) {
  // ---------------------
  //
  //  Init
  //
  // ---------------------
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
  });

  // ---------------------
  //
  //  Default widgets
  //
  // ---------------------

  // --- Replace with custom ---

  // search.addWidget(
  //   instantsearch.widgets.searchBox({
  //     container: '#search-input',
  //     placeholder: 'Search for products by name, type, brand, ...',
  //   })
  // );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 10,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
      transformData: {
        item: function (item) {
          item.starsLayout = getStarsHTML(item.rating);
          item.categories = getCategoryBreadcrumb(item);
          return item;
        },
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

  search.addWidget(
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [{
        name: opts.indexName, label: 'Most relevant',
      }, {
        name: `${opts.indexName}_price_asc`, label: 'Lowest price',
      }, {
        name: `${opts.indexName}_price_desc`, label: 'Highest price',
      }],
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );

  // ---------------------
  //
  //  Filtering widgets
  //
  // ---------------------
  search.addWidget(
    instantsearch.widgets.hierarchicalMenu({
      container: '#hierarchical-categories',
      attributes: [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2'],
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      showParentLevel: true,
      limit: 10,
      templates: {
        header: getHeader('Category'),
        item: '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{name}}</span class="facet-name"><span class="ais-hierarchical-menu--count">{{count}}</span></a>' // eslint-disable-line
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#brand',
      attributeName: 'brand',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 5,
      operator: 'or',
      showMore: {
        limit: 10,
      },
      searchForFacetValues: {
        placeholder: 'Search for brands',
        templates: {
          noResults: '<div class="sffv_no-results">No matching brands.</div>',
        },
      },
      templates: {
        header: getHeader('Brand'),
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'price',
      tooltips: {
        format: function (rawValue) {
          return `$${Math.round(rawValue).toLocaleString()}`;
        },
      },
      templates: {
        header: getHeader('Price'),
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.priceRanges({
      container: '#price-range',
      attributeName: 'price',
      labels: {
        currency: '$',
        separator: 'to',
        button: 'Apply',
      },
      templates: {
        header: getHeader('Price range'),
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.starRating({
      container: '#stars',
      attributeName: 'rating',
      max: 5,
      labels: {
        andUp: '& Up',
      },
      templates: {
        header: getHeader('Rating'),
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.toggle({
      container: '#free-shipping',
      attributeName: 'free_shipping',
      label: 'Free Shipping',
      values: {
        on: true,
      },
      templates: {
        header: getHeader('Shipping'),
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'type',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      showMore: true,
      templates: {
        header: getHeader('Type'),
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.start();
}


// ---------------------
//
//  Custom widget for Searchbox
//
// ---------------------

const customMenuRenderFn = function (renderParams, isFirstRendering) {
  // widgetParams contains all the original options used to instantiate the widget on the page.
  const container = renderParams.widgetParams.containerNode;
  const title = renderParams.widgetParams.title || 'My first custom menu widget';

  if (isFirstRendering) {
    // replace `document.body` with the container provided by the user
    // and also the new title
    $(container).append(
      '<h1>' + title + '</h1>' +
      '<select></select>'
    );

    const refine = renderParams.refine;
    $(container).find('select').on('click', function (event) {
      refine(event.target.value);
    });
  }

  const items = renderParams.items;
  const optionsHTML = items.map(item => {
    return (
      `<option value="${item.value}"${item.isRefined ? ' selected' : ''}>${item.label}(${item.count})</option>`
    );
  });
  $(container).find('select').html(optionsHTML);
}

const keywordDropdown = instantsearch.connectors.connectSearchBox(customMenuRenderFn);


console.log('CONNECTORS', instantsearch.connectors);
const lastQueryUpdatedAt = 0;
const DEBOUNCE_DELAY = 600;
const debounceTimer = null;


search.addWidget(
  keywordDropdown({
    container: '#search-input',
    placeholder: 'Search for products by name, type, brand, ...',
    // Query hook from Alex's MindGeek Demo
    queryHook: function (query, search) {
      var now = (new Date()).getTime();
      if ((now - lastQueryUpdatedAt) < DEBOUNCE_DELAY) {
        console.log("Clearing timeout");
        clearTimeout(debounceTimer);
      }

      lastQueryUpdatedAt = now;
      debounceTimer = setTimeout(function () { search(query); }, DEBOUNCE_DELAY);
      console.log("Setting timeout", debounceTimer);
      return false;
    }
  })
);

// ---------------------
//
//  Helper functions
//
// ---------------------
function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}

function getCategoryBreadcrumb(item) {
  const highlightValues = item._highlightResult.categories || [];
  return highlightValues.map(category => category.value).join(' > ');
}

function getStarsHTML(rating, maxRating) {
  let html = '';
  maxRating = maxRating || 5;

  for (let i = 0; i < maxRating; ++i) {
    html += `<span class="ais-star-rating--star${i < rating ? '' : '__empty'}"></span>`;
  }

  return html;
}
