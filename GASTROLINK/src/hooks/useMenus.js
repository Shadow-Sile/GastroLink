import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useFirebase } from "../context/FirebaseContext";

// ...elimina las interfaces y los tipos...

export const useMenus = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useFirebase();

  // ...existing code, pero sin tipos ni interfaces...
};

export default useMenus;
