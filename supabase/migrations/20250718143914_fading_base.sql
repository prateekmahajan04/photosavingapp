/*
  # Create photos table and storage

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `image_path` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create photos bucket for image storage
    - Enable public access for uploaded images

  3. Security
    - Enable RLS on photos table
    - Add policies for authenticated users to manage their own photos
    - Set up storage policies for photo uploads
*/

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  image_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own photos"
  ON photos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS photos_user_id_idx ON photos(user_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);