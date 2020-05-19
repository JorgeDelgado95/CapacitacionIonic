import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  endpoint = 'https://crudcrud.com/api/423e644fcd0b45a798602390b3955c50/items';
  items: Item[] = [];

  constructor(private httpClient: HttpClient) { }

  saveItem(item: Item) {
    let itemForService = {
      title: item.title,
      quantity: item.quantity.toString()
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
      quantity: item.quantity.toString()
    };
    return this.httpClient.put(this.endpoint + '/' + item._id, itemForService);
  }

  deleteItem(item: Item){
    return this.httpClient.delete(this.endpoint + '/' + item._id);
  }

}
