import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firestore-crud';
  items!: any[];
  item: any;


  form = new FormGroup({
    newItemName: new FormControl(''),
    newItemDescription: new FormControl('')
  })



  constructor(private firestore: AngularFirestore) {
    this.firestore.collection('items').valueChanges().subscribe(items => {
      this.items = items;
    });
  }

  addNewItem() {
    this.firestore.collection('items').add({
      name: String(this.form.value.newItemName),
      description: String(this.form.value.newItemDescription)
    }).then(() => {
      console.log('Item added successfully!');
      this.form.value.newItemName = '';
      this.form.value.newItemDescription = '';
    }).catch((error) => {
      console.error('Error adding item: ', error);
    });
  }

  createNestedDoc() {
    const itemID = "lwY2FKupVoYaoUhvJtTX"
    const postId = "1"

    const postRef = this.firestore.collection('items').doc(itemID).collection('posts').doc(postId);

    const post = {
      title: "Food",
      content: "Food is life."
    }
    postRef.set(post).then(()=>console.log("success" + postRef));
  }

  deleteItem(itemName: string){
    const itemCollection = this.firestore.collection('items', ref => ref.where('name', '==', itemName));
    itemCollection.get().toPromise().then(querySnapshot=>{
      querySnapshot?.forEach(doc=>{
        const itemRef = itemCollection.doc(doc.id);
        itemRef.delete();
      })
    })
  }
}
