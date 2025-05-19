import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

const FirebaseContext = createContext(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
        role: "user"
      });
      toast.success('Cuenta creada con éxito');
    } catch (error) {
      let errorMessage = error.message || "Error al registrar el usuario";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "El correo electrónico ya está registrado. Intenta iniciar sesión o usa otro correo.";
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Iniciaste sesión correctamente');
    } catch (error) {
      const errorMessage = error.message || "Error al iniciar sesión";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
    
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google user:", user);

      if (!user || !user.uid || !user.email) {
        toast.error("No se pudo obtener el usuario de Google o falta el email/uid.");
        throw new Error("No se pudo obtener el usuario de Google o falta el email/uid.");
      }


      let userDoc;
      try {
        userDoc = await getDoc(doc(db, "users", user.uid));
      } catch (firestoreError) {
        toast.error("Error al acceder a Firestore. Revisa tu conexión o configuración.");
        console.error("Firestore error:", firestoreError);
        throw firestoreError;
      }

      if (!userDoc.exists()) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date(),
            role: "user"
          });
        } catch (firestoreError) {
          toast.error("No se pudo crear el usuario en Firestore.");
          console.error("Firestore setDoc error:", firestoreError);
          throw firestoreError;
        }
      }
      toast.success('Iniciaste sesión con Google correctamente');
    } catch (error) {
   
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("El popup de Google fue cerrado antes de completar el inicio de sesión.");
      } else if (error.code === "auth/cancelled-popup-request") {
        toast.error("El inicio de sesión con Google fue cancelado.");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("El inicio de sesión con Google no está habilitado en Firebase.");
      } else {
        const errorMessage = error.message || "Error al iniciar sesión con Google";
        toast.error(errorMessage);
      }
      
      console.error("loginWithGoogle error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      const errorMessage = error.message || "Error al cerrar sesión";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de recuperación enviado');
    } catch (error) {
      const errorMessage = error.message || "Error al enviar el email de recuperación";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    loading
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
