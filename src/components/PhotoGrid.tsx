import React, { useState, useEffect } from 'react';
import { Calendar, Heart, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_path: string;
  created_at: string;
}

interface PhotoGridProps {
  refreshTrigger: number;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ refreshTrigger }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [user, refreshTrigger]);

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.image_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) {
        throw dbError;
      }

      // Remove from local state
      setPhotos(photos.filter(p => p.id !== photo.id));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No photos yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start sharing your memories by uploading your first photo!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative group">
            <img
              src={photo.image_url}
              alt={photo.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => deletePhoto(photo)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {photo.title}
            </h3>
            
            {photo.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {photo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(photo.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                <MoreHorizontal size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};