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


const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersList = filters.map((filter) => {
    const isChecked = filter.name === currentFilterType;

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
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, handleFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = handleFilterTypeChange;

    this.element.addEventListener('change', this.#onFilterTypeChange);
  }

  get template () {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #onFilterTypeChange = (evt) => {
    evt.preventDefault();

    this.#handleFilterTypeChange(evt.target.value);
  };
}
