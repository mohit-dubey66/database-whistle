import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { useStoryStore } from '../store/useStoryStore';

// Defines expected location state structure
// interface LocationState {
//   anonymousId: string;
// }

interface FormData {
  category: string;
  topic: string;
  country: string;
  title: string;
  description: string;
  tags: string[];
}

// Category to topics mapping
const CATEGORY_TOPICS = {
  Company: ['Toxic Work Culture', 'Burnout and Overwork', 'Compensation', 'Unethical Business Practices', 'Office Politics'],
  College: ['Exams', 'Faculty', 'Mental Health', 'Placements', 'Curriculum'],
  Government: ['Corruption', 'Healthcare Failure', 'Government Favouring Rich', 'Public Infrastructure Neglect', 'Police and Judicial Misconduct'],
  School: ['Bullying', 'Curriculum', 'Teacher-student Relations', 'Mental Health', 'Safety Issues'],
  Other: ['Other'],
};

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Other'];

export default function CreateStoryPage() {
  const navigate = useNavigate(); // For navigation
  let anonymousId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : '';
  const addStory = useStoryStore((state) => state.addStory); // Zustand store action

  const [formData, setFormData] = useState<FormData>({
    category: '',
    topic: '',
    country: '',
    title: '',
    description: '',
    tags: [],
  });

  useEffect(() => {
    if (!anonymousId) {
      navigate("/claim-identity");
    }
  },[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.description) {
    addStory({
      category: formData.category,
      subCategory: formData.topic,
      insider: anonymousId,
      location: formData.country,
      title: formData.title,
      content: formData.description,
      tags: formData.tags.map(tag => ({ label: tag })),
    });
    navigate('/');
  }
  else {
    alert("Please fill the story description");
  }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dynamic Topics based on selected Category
  const filteredTopics = CATEGORY_TOPICS[formData.category] || [];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">It's time to blow the whistle...</h1>
          <p className="text-gray-600">Make sure you don't reveal your personal details...</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insider Name
              </label>
              <input
                type="text"
                value={anonymousId.username}
                disabled
                className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select your category</option>
                  {Object.keys(CATEGORY_TOPICS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Topic Dropdown */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={!formData.category}
                >
                  <option value="">Choose your topic</option>
                  {filteredTopics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select your location</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title of your story"
                required
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Story description
              </label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
