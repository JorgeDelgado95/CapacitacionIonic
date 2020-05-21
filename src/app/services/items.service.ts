import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private isLoading: Subject<boolean> = new Subject<boolean>();
  endpoint = 'https://supermarket-rest.herokuapp.com/test/JorgeDelgado';
  items: Item[] = [];

  constructor(private httpClient: HttpClient) { }

  setIsLoading(loading: boolean){
    this.isLoading.next(loading);
  }

  getIsLoading(){
    return this.isLoading.asObservable();
  }

  saveItem(item: Item) {
    let itemForService = {
      title: item.title,
      quantity: item.quantity.toString(),
      image: item.image
    };
    return this.httpClient.post(this.endpoint, itemForService);
  }

  getItems(){
    return this.httpClient.get<[Item]>(this.endpoint);
  }

  getSingleItem(id: string){
    return this.httpClient.get<Item>(this.endpoint + '/' + id);
  }

  updateItem(item: Item){
    let itemForService = {
      title: item.title,
      quantity: item.quantity.toString(),
      image: item.image
    };
    return this.httpClient.put(this.endpoint + '/' + item._id, itemForService);
  }

  deleteItem(item: Item){
    return this.httpClient.delete(this.endpoint + '/' + item._id);
  }

}
