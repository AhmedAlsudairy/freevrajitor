-- Drop existing policies on the profiles table
DROP POLICY IF EXISTS profiles_insert_policy ON profiles;
DROP POLICY IF EXISTS profiles_select_policy ON profiles;
DROP POLICY IF EXISTS profiles_update_policy ON profiles;
DROP POLICY IF EXISTS profiles_delete_policy ON profiles;

-- Create a more permissive insert policy for profiles
-- This allows users to insert their own profile during registration
CREATE POLICY profiles_insert_policy ON profiles 
FOR INSERT WITH CHECK (
  -- Allow users to insert their own profile
  auth.uid() = id OR
  -- OR allow inserts during registration (when no session exists yet)
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = profiles.id
  )
);

-- Select policy - users can read all profiles
CREATE POLICY profiles_select_policy ON profiles 
FOR SELECT USING (true);

-- Update policy - users can only update their own profile
CREATE POLICY profiles_update_policy ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Delete policy - users can only delete their own profile
CREATE POLICY profiles_delete_policy ON profiles 
FOR DELETE USING (auth.uid() = id);

-- Similar policies for freelancer_profiles and client_profiles
DROP POLICY IF EXISTS freelancer_profiles_insert_policy ON freelancer_profiles;
CREATE POLICY freelancer_profiles_insert_policy ON freelancer_profiles 
FOR INSERT WITH CHECK (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = freelancer_profiles.id
  )
);

DROP POLICY IF EXISTS client_profiles_insert_policy ON client_profiles;
CREATE POLICY client_profiles_insert_policy ON client_profiles 
FOR INSERT WITH CHECK (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = client_profiles.id
  )
);
