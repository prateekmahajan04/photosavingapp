import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, Image as ImageIcon, FileText, Type } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface PhotoUploadProps {
  onPhotoUploaded: () => void;
}

interface FormData {
  title: string;
  description: string;
  file: FileList;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUploaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>();

  const selectedFile = watch('file');

  React.useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [selectedFile]);

  const onSubmit = async (data: FormData) => {
    if (!user || !data.file[0]) return;

    setUploading(true);
    try {
      const file = data.file[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Save photo record to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          image_url: publicUrl,
          image_path: fileName,
        });

      if (dbError) {
        throw dbError;
      }

      // Reset form and close modal
      reset();
      setPreview(null);
      setIsOpen(false);
      onPhotoUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPreview(null);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
      >
        <Upload size={20} />
        <span>Upload Photo</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upload Photo
              </h2>
              <p className="text-gray-600">
                Share your moment with the world
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    {...register('file', { required: 'Please select a photo' })}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer block"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="py-8">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Click to select a photo
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter photo title"
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about this photo..."
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};