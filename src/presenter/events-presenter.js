import {render} from '../render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import NewWaypointView from '../view/create-form.js';

export default class EventsPresenter {
  eventsListComponent = new EventsListView();

  constructor(container) {
    this.container = container;
  }

  init() {
    render(new SortingView(), this.container);
    render(this.eventsListComponent, this.container);
    render(new NewWaypointView(), this.eventsListComponent.getElement());
    render(new EditWaypointView(), this.eventsListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.eventsListComponent.getElement());
    }
  }
}
