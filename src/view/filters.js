import AbstractView from '../framework/view/abstract-view.js';

const createFiltersItemTemplate = (filter, isChecked) => {
  const {name, isActive} = filter;

  return `
    <div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>
  `;
};


const createFiltersTemplate = (filters) => {
  const filtersList = filters.map((filter, index) => {
    const isChecked = index === 0;

    return createFiltersItemTemplate(filter, isChecked);
  }).join('');

  return `
    <form class="trip-filters" action="#" method="get">

      ${filtersList}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template () {
    return createFiltersTemplate(this.#filters);
  }
}
