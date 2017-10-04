/* global instantsearch autocomplete */


// const appId = '5NICTDJ5Q3';
// const apiKey = 'fe2708f4939640ae043e0a04008fbb10';


const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const indexName = 'instant_search';
const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

app({ appId, apiKey, indexName });

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
      scrollTo: '#aa-input-container',
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
        item: '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{value}}</span class="facet-name"><span class="ais-hierarchical-menu--count">{{count}}</span></a>' // eslint-disable-line
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

  // ---------------------
  //
  //  Custom widget for Searchbox
  //
  // ---------------------

  const keywordDropdown = instantsearch.connectors.connectSearchBox(customMenuRenderFn);
  search.addWidget(
    keywordDropdown({
      container: '#aa-input-container',
      placeholder: 'Search for products by name, type, brand, ...'
      //queryHook: debounceFn
    })
  );

  search.start();
}

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

function customMenuRenderFn(renderParams, isFirstRendering) {
  // widgetParams contains all the original options used to instantiate the widget on the page.
  const container = renderParams.widgetParams.container;
  const placeholder = renderParams.widgetParams.placeholder;

  if (isFirstRendering) {
    $(container).append(
      `<input type="search" id="aa-search-input" placeholder="${placeholder}"/>`
    );

    autocomplete('#aa-search-input',
      { hint: false,
        templates: {
          dropdownMenu:
            '<div class="aa-dataset-product"></div>' +
            '<div class="aa-dataset-brand"></div>',
        }
      }, [
        {
          source: autocomplete.sources.hits(index, { hitsPerPage: 10, restrictSearchableAttributes: ['name'] }),
          displayKey: 'name',
          templates: {
            header: '<div class="aa-suggestions-category">Products</div>',
            suggestion: function (suggestion, answer) {
              return '<span>' + suggestion._highlightResult.name.value + '</span>'
            }
          }
        },
        {
          source: (query, cb) => {
            index.searchForFacetValues({
              facetName: 'brand',
              facetQuery: query
            })
            .then(res => {
              cb(res.facetHits);
            })
          },
          displayKey: 'brand',
          templates: {
            header: '<div class="aa-suggestions-category">Brands</div>',
            suggestion: function (facet) {
              console.log('FACET', facet);
              return '<div><span class="aa-facet-name">' + facet.highlighted + '</span><span class="aa-facet-count">' + facet.count + '</span></div>';
            }
          }
        }
      ]).on('autocomplete:selected', function (event, suggestion, dataset) {
        renderParams.refine(event.target.value);
      });

    // This is the regular instantSearch update of results
    $(container).find('input').on('input', function (event) {
      setTimeout(function () {
        renderParams.refine(event.target.value);
      }, 700);
    });
  }
}

