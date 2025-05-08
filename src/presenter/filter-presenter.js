import { UpdateType } from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import { filter } from '../utils/filter.js';
import FiltersView from '../view/filters.js';


export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #tripModel = null;

  #filtersComponent = null;

  constructor({filtersContainer, filterModel, tripModel}) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#tripModel = tripModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#tripModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#tripModel.waypoints;

    return Object.entries(filter).map(([filterName, applyFilter]) => ({
      name: filterName,
      isActive: applyFilter(points).length > 0
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      handleFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
