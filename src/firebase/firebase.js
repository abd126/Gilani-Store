// import app from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
// import 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyB4UZf_wPXBai18-4SFnm5_NqxfxdRiHvc",
//   authDomain: "ecommerce-react-84c61.firebaseapp.com",
//   databaseURL: "https://ecommerce-react-84c61.firebaseio.com",
//   projectId: "ecommerce-react-84c61",
//   storageBucket: "ecommerce-react-84c61.appspot.com",
//   messagingSenderId: "924117848816",
//   appId: "1:924117848816:web:c046c9a6bd61585dd3a835"
// };

// class Firebase {
//   constructor() {
//     app.initializeApp(firebaseConfig);

//     this.storage = app.storage();
//     this.db = app.firestore();
//     this.auth = app.auth();
//   }

  // AUTH ACTIONS 
  // --------
  import app from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import 'firebase/storage';

 
  const firebaseConfig = {
    apiKey: "AIzaSyC503jH0hKsOC_4pFV_n-k4iVc02mRxtYE",
    authDomain: "gilani-collections.firebaseapp.com",
    projectId: "gilani-collections",
    storageBucket: "gilani-collections.appspot.com",
    messagingSenderId: "219215617428",
    appId: "1:219215617428:web:a7a3c017b978fe5ba24381",
    measurementId: "G-7JGERJYZH6"
  };
  
  class Firebase {
    
    constructor() {
      app.initializeApp(firebaseConfig);

      this.storage = app.storage();
      this.db = app.firestore();
      this.auth = app.auth();
    }
  createAccount = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () => this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());
  
  signOut = () => this.auth.signOut();

  // passwordReset = email => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => { this.db.collection('users').doc(id).set(user)};
  getUser = id => this.db.collection('users').doc(id).get();

  passwordUpdate = password => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword).then(() => {
        const user = this. auth.currentUser;
        user.updatePassword(newPassword).then(()=> {
          resolve("Password Updated Successfully");
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  };

  updateEmail = (currentPassword, newEmail) => {
    return new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword).then(() => {
        const user = this. auth.currentUser;
        user.updateEmail(newEmail).then(()=> {
          resolve("Email Updated Successfully");
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  };
  
  updateProfile = (id, updates) => this.db.collection('users').doc(id).update(updates);

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(user.email, currentPassword);
    
    return user.reauthenticateWithCredential(cred);
  };
 
  onAuthStateChanged = () => {
    return new Promise ((resolve, reject) => {
      this.auth.onAuthStateChanged((user)=>{
        if(user){
          return resolve(user);
        }else {
          return reject(new Error('Auth State Changed Failed'));
        }
      });
    });
  };
 setAuthPersistence = () => this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);


 
  // // --------

  getProducts = (lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.db.collection('products').orderBy(app.firestore.FieldPath.documentId()).startAfter(lastRefKey).limit(12);
          const snapshot = await query.get();
          const products = [];
          snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];
          
          resolve({ products, lastKey });
        } catch (e) {
          reject(':( Failed to fetch products.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000); 

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);
          
          const totalQuery = await this.db.collection('products').get();
          const total = totalQuery.docs.length;
          const query = this.db.collection('products').orderBy(app.firestore.FieldPath.documentId()).limit(12);
          const snapshot = await query.get();

          clearTimeout(timeout);
          if (!didTimeout) {
            const products = [];
            snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];
            
            resolve({ products, lastKey, total});
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch products: An error occured while trying to fetch products or there may be no product ', e);
          reject(':( Failed to fetch products.');
        }
      }
    });
}
  
    

  addProduct = (id, product) => this.db.collection('products').doc(id).set(product);

  generateKey = () => this.db.collection('products').doc().id;

  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  }

  deleteImage = id => this.storage.ref('products').child(id).delete();

  editProduct = (id, updates) => this.db.collection('products').doc(id).update(updates);

  removeProduct = id => this.db.collection('products').doc(id).delete();
}

const firebase = new Firebase();

export default firebase;




