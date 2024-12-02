import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoadingButton from './LoadingButton';
import clsx from 'clsx';
import { useFeatureRequestStore } from '../store/useFeatureRequestStore';

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'feature' | 'category';

interface FeatureFormData {
  title: string;
  description: string;
}

interface CategoryFormData {
  category: string;
  topic: string;
  remark: string;
}

export default function FeatureRequestModal({ isOpen, onClose }: FeatureRequestModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('feature');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitRequest = useFeatureRequestStore(state => state.submitRequest);
  
  const [featureForm, setFeatureForm] = useState<FeatureFormData>({
    title: '',
    description: ''
  });

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    category: '',
    topic: '',
    remark: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (activeTab === 'feature') {
        await submitRequest({
          type: 'feature',
          data: featureForm
        });
      } else {
        await submitRequest({
          type: 'category',
          data: categoryForm
        });
      }
      onClose();
      // Reset forms
      setFeatureForm({ title: '', description: '' });
      setCategoryForm({ category: '', topic: '', remark: '' });
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeatureForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Submit a Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setActiveTab('feature')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              activeTab === 'feature' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Feature Request
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              activeTab === 'category' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Category/Topic Request
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'feature' ? (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={featureForm.title}
                  onChange={handleFeatureInputChange}
                  placeholder="Describe it in less than 5 words"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={featureForm.description}
                  onChange={handleFeatureInputChange}
                  placeholder="Can you please explain how this feature can be impactful..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={categoryForm.category}
                  onChange={handleCategoryInputChange}
                  placeholder="Write here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={categoryForm.topic}
                  onChange={handleCategoryInputChange}
                  placeholder="Write here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  value={categoryForm.remark}
                  onChange={handleCategoryInputChange}
                  placeholder="Anything else you want us to hear..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-center">
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting..."
              className="w-full max-w-xs"
            >
              SUBMIT
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}