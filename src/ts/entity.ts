import {Destination, Game, htmlElement} from './app';

export default class Entity {
  game = htmlElement('#game') as Game;
  livesList = htmlElement('#lives-list');
  destination: Destination;
  w = 0;
  h = 0;

  constructor(destination: Destination) {
    this.destination = destination;
  }
}
