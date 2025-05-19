import { supabase } from './client';

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error };
  }
}

// Update user profile including display name
export async function updateUserProfile(displayName: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        display_name: displayName 
      }
    });
    
    if (error) throw error;
    
    // Store display name in localStorage for easy access
    localStorage.setItem("adminName", displayName);
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
}

// Check if user is admin
export async function isUserAdmin() {
  try {
    const { success, user, error } = await getCurrentUser();
    
    if (!success || !user) {
      return { success: false, isAdmin: false };
    }
    
    // Check if user has admin role in metadata
    // This depends on how you've set up your admin users
    const isAdmin = user.app_metadata?.role === 'admin' || 
                   user.user_metadata?.isAdmin === true;
    
    return { success: true, isAdmin };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { success: false, isAdmin: false, error };
  }
}
