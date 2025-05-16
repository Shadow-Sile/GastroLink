import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';


export const createMenu = async (userId, menuData) => {
  try {
    const menuRef = await addDoc(collection(db, "menus"), {
      ...menuData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { menuId: menuRef.id };
  } catch (error) {
    return { error };
  }
};


export const getUserMenus = async (userId) => {
  try {
    const q = query(collection(db, "menus"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const menus = [];
    querySnapshot.forEach((doc) => {
      menus.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { menus };
  } catch (error) {
    return { error };
  }
};


export const getMenu = async (menuId) => {
  try {
    const menuDoc = await getDoc(doc(db, "menus", menuId));
    
    if (menuDoc.exists()) {
      return { menu: { id: menuDoc.id, ...menuDoc.data() } };
    } else {
      return { error: 'Menu not found' };
    }
  } catch (error) {
    return { error };
  }
};


export const updateMenu = async (menuId, menuData) => {
  try {
    await updateDoc(doc(db, "menus", menuId), {
      ...menuData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};


export const deleteMenu = async (menuId) => {
  try {
    await deleteDoc(doc(db, "menus", menuId));
    return { success: true };
  } catch (error) {
    return { error };
  }
};


export const addCategory = async (menuId, categoryData) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuDoc = await getDoc(menuRef);
    
    if (!menuDoc.exists()) {
      return { error: 'Menu not found' };
    }
    
    const menuData = menuDoc.data();
    const categories = menuData.categories || [];
    

    const categoryId = `cat_${Date.now()}`;
    
    const newCategory = {
      id: categoryId,
      ...categoryData,
      items: []
    };
    
    categories.push(newCategory);
    
    await updateDoc(menuRef, {
      categories,
      updatedAt: serverTimestamp()
    });
    
    return { categoryId };
  } catch (error) {
    return { error };
  }
};


export const addMenuItem = async (menuId, categoryId, itemData) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuDoc = await getDoc(menuRef);
    
    if (!menuDoc.exists()) {
      return { error: 'Menu not found' };
    }
    
    const menuData = menuDoc.data();
    const categories = menuData.categories || [];
    

    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      return { error: 'Category not found' };
    }
    

    const itemId = `item_${Date.now()}`;
    
    const newItem = {
      id: itemId,
      ...itemData
    };
    
    categories[categoryIndex].items.push(newItem);
    
    await updateDoc(menuRef, {
      categories,
      updatedAt: serverTimestamp()
    });
    
    return { itemId };
  } catch (error) {
    return { error };
  }
};


export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { imageUrl: downloadURL };
  } catch (error) {
    return { error };
  }
};


export const deleteImage = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { error };
  }
};