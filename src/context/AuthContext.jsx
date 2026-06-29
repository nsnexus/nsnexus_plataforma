import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile and purchases for a given user ID
  const fetchUserProfile = async (userId, userEmail) => {
    try {
      // 1. Fetch profile from profiles table
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist yet, try syncing email or let trigger create it
        console.log("Profile not found in database. Retrying profile load shortly...");
        return null;
      }

      // 2. Fetch approved purchases for enrolledCourses
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('course_id')
        .eq('user_id', userId)
        .eq('status', 'approved');

      if (purchasesError) throw purchasesError;

      const enrolledCourses = (purchases || []).map(p => p.course_id);

      // Default avatar if none
      const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop";

      return {
        id: userId,
        email: userEmail,
        name: profile?.name || 'Sem nome',
        avatar_url: profile?.avatar_url || defaultAvatar,
        role: profile?.role || 'student',
        progress: profile?.progress || {},
        enrolledCourses: enrolledCourses
      };
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  };

  // Sync session on mount
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && active) {
        let profileData = await fetchUserProfile(session.user.id, session.user.email);
        
        // Retry logic in case profile trigger is slightly delayed
        if (!profileData && active) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          profileData = await fetchUserProfile(session.user.id, session.user.email);
        }

        setUser(profileData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      
      if (session?.user) {
        setLoading(true);
        const profileData = await fetchUserProfile(session.user.id, session.user.email);
        setUser(profileData);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign In function
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  // Sign Up function
  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    return data.user;
  };

  // Sign Out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Update progress helper
  const updateProgress = async (courseId, lessonId, isCompleted = true) => {
    if (!user) return;

    const currentProgress = { ...user.progress };
    if (!currentProgress[courseId]) {
      currentProgress[courseId] = { completedLessons: [], percentage: 0 };
    }

    let completedLessons = [...(currentProgress[courseId].completedLessons || [])];
    
    if (isCompleted) {
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
    } else {
      completedLessons = completedLessons.filter(id => id !== lessonId);
    }

    // Get total lessons count for course from courses data
    // Assuming COURSES_DATA from platformData, we will compute percentage inside pages or here if needed
    // For now we'll store completedLessons, and the caller can specify percentage or we can calculate it
    currentProgress[courseId].completedLessons = completedLessons;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ progress: currentProgress })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser(prev => ({
        ...prev,
        progress: currentProgress
      }));
    } catch (err) {
      console.error("Error updating progress in Supabase:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProgress, reloadUser: async () => {
      if (user) {
        const profileData = await fetchUserProfile(user.id, user.email);
        setUser(profileData);
      }
    }}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
