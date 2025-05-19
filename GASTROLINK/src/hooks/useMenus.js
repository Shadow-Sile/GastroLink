import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useFirebase } from "../context/FirebaseContext";


export const useMenus = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useFirebase();

};

export default useMenus;
