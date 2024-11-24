// Import necessary React hooks and modules
import React, { useEffect, useState } from 'react'; // For component rendering, managing state, and side effects
import { useNavigate } from 'react-router-dom'; // For navigation between routes
import { ArrowLeft } from 'lucide-react'; // Icon library for SVG icons
import { showToast } from '../components/Toast'; // Custom reusable toast component
import RichTextEditor from '../components/RichTextEditor'; // Custom rich text editor component
import { useStoryStore } from '../store/useStoryStore'; // Zustand store for managing global state

// Define TypeScript interface for form data structure
interface FormData {
  category: string;
  topic: string;
  country: string;
  title: string;
  description: string;
  tags: string[];
}

// Predefined categories and topics for the form
const CATEGORY_TOPICS = {
  Company: ['Toxic Work Culture', 'Burnout and Overwork', 'Compensation', 'Unethical Business Practices', 'Office Politics'],
  College: ['Placements', 'Curriculum', 'Faculty', 'Exams', 'Mental Health'],
  Government: ['Corruption', 'Favouring Rich', 'Scam', 'Healthcare Failure', 'Public Infrastructure', 'Judicial Misconduct'],
};

// Predefined list of countries for the dropdown
const COUNTRIES = ['India', 'USA', 'UK', 'Canada'];

// Main component for creating a story
export default function CreateStoryPage() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const addStory = useStoryStore((state) => state.addStory); // Fetch the `addStory` method from the global state

  // Retrieve the current user's anonymous ID from local storage, if available
  const anonymousId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  // Initialize state for form data with default values
  const [formData, setFormData] = useState<FormData>({
    category: '',
    topic: '',
    country: '',
    title: '',
    description: '',
    tags: [],
  });

  // Redirect the user to the identity claim page if no anonymous ID is found
  useEffect(() => {
    if (!anonymousId || !anonymousId.username) {
      navigate('/claim-identity');
    }
  }, [anonymousId, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate if all required fields are filled
    if (!formData.category || !formData.topic || !formData.country || !formData.title || !formData.description) {
      showToast.error('Please fill in all fields.'); // Show error toast if validation fails
      return;
    }

    try {
      // Call `addStory` to save the story data
      await addStory({
        category: formData.category,
        subCategory: formData.topic,
        insider: anonymousId.username, // Use the username from the anonymous ID
        location: formData.country,
        title: formData.title,
        content: formData.description,
        tags: [],
      });

      // Show success toast and navigate back to the home page
      showToast.success('Your story is submitted successfully!');
      navigate('/');
    } catch (error) {
      // Show error toast if submission fails
      showToast.error('Error submitting story. Please try again.');
    }
  };

  // Handle input changes and update the form data state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update the corresponding field
  };

  // Get the list of topics filtered by the selected category
  const filteredTopics = CATEGORY_TOPICS[formData.category] || [];

  // Render the form and layout
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Back button to navigate to the previous page */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">It's time to blow the whistle...</h1>
          <p className="text-gray-600">Make sure you don't reveal your personal details...</p>
        </div>

        {/* Form container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Insider Name field (disabled and prefilled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insider Name
              </label>
              <input
                type="text"
                value={anonymousId?.username || 'Anonymous'}
                disabled
                className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-500 outline-none"
              />
            </div>

            {/* Category, Topic, and Country dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category dropdown */}
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
                  {Object.keys(CATEGORY_TOPICS).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Topic dropdown (filtered by category) */}
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
                  {filteredTopics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Country dropdown */}
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
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title field */}
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

            {/* Description field with a rich text editor */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Story description
              </label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white rounded-lg w-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:w-[20rem]"
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
