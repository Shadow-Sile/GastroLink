import { collection, doc, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';


export const createQrCode = async (menuId, userId) => {
  try {
   
    const qrCodeRef = await addDoc(collection(db, "qrcodes"), {
      menuId,
      userId,
      createdAt: serverTimestamp(),
      active: true
    });
    
   
    const qrId = qrCodeRef.id;
    

    await updateDoc(doc(db, "menus", menuId), {
      qrCodeId: qrId,
      updatedAt: serverTimestamp()
    });
    
   
    const menuUrl = `${window.location.origin}/menu/${qrId}`;
    
    return { 
      qrId, 
      menuUrl 
    };
  } catch (error) {
    return { error };
  }
};


export const getMenuByQrCode = async (qrId) => {
  try {

    const qrDoc = await getDoc(doc(db, "qrcodes", qrId));
    
    if (!qrDoc.exists()) {
      return { error: 'QR code not found' };
    }
    
    const qrData = qrDoc.data();
    

    if (!qrData.active) {
      return { error: 'QR code is inactive' };
    }
    

    const menuDoc = await getDoc(doc(db, "menus", qrData.menuId));
    
    if (!menuDoc.exists()) {
      return { error: 'Menu not found' };
    }
    
    return { 
      menu: { id: menuDoc.id, ...menuDoc.data() },
      qrInfo: { id: qrDoc.id, ...qrData }
    };
  } catch (error) {
    return { error };
  }
};

export const deactivateQrCode = async (qrId) => {
  try {
    await updateDoc(doc(db, "qrcodes", qrId), {
      active: false,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};


export const reactivateQrCode = async (qrId) => {
  try {
    await updateDoc(doc(db, "qrcodes", qrId), {
      active: true,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};