import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import UuidDisplay from '../components/UuidDisplay';

type Step = 'username' | 'uuid-display' | 'uuid-verify';

export default function ClaimIdentityPage() {
    const [step, setStep] = useState<Step>('username');
    const [anonymousId, setAnonymousId] = useState('');
    const [uuid, setUuid] = useState('');
    const [generatedUuid, setGeneratedUuid] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const existingUuid = localStorage.getItem('userUuid');
    if (existingUuid) {
      setUuid(existingUuid);
      setStep('uuid-verify');
    }
  }, []);

    const { checkUsername, generateUuid, confirmRegistration, getUserByUuid } = useUserStore();

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setAnonymousId(value);
        setError('');
        setSuccess('');

        if (value && value.length > 3) {
            setIsChecking(true);
            try {
                const taken = await checkUsername(value);
                if (taken) {
                    setError('Sorry, this username is taken. Please choose another one.');
                } else {
                    setSuccess('This username is available!');
                }
            } catch (err) {
                setError('Error checking username availability');
            } finally {
                setIsChecking(false);
            }
        }
    };

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!anonymousId.trim() || error) return;

        try {
            const newUuid = await generateUuid(anonymousId);
            setGeneratedUuid(newUuid);
            setStep('uuid-display');
        } catch (err) {
            setError('Error generating Insider ID. Please try again.');
        }
    };

  const handleUuidVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await getUserByUuid(uuid);
      if (user) {
        localStorage.setItem('userUuid', user.uuid);
        navigate('/create-story', { 
          state: { 
            anonymousId: user.username,
            uuid: user.uuid 
          } 
        });
      } else {
        setError('Invalid Insider ID. Please try again.');
      }
    } catch (err) {
      setError('Error verifying Insider ID');
    }
  };

  const handleContinueAfterUuid = async () => {
    try {
      const user = await confirmRegistration(generatedUuid);
      if (user) {
        localStorage.setItem('userUuid', user.uuid);
        navigate('/create-story', { 
          state: { 
            anonymousId: user.username,
            uuid: user.uuid 
          } 
        });
      } else {
        setError('Error confirming registration. Please try again.');
        setStep('username');
      }
    } catch (err) {
      setError('Error confirming registration');
      setStep('username');
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Thank you for raising your voice!</h1>
                    <p className="text-gray-600">We appreciate your courage, and support your anonymity!</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {step === 'username' && (
                        <form onSubmit={handleUsernameSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="anonymous-id" className="block text-lg font-medium text-gray-900 mb-4">
                                    Choose your anonymous identity...
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="anonymous-id"
                                        value={anonymousId}
                                        onChange={handleUsernameChange}
                                        className={`block w-full px-4 py-3 rounded-lg border ${error ? 'border-red-300' : success ? 'border-green-300' : 'border-gray-300'
                                            } focus:ring-2 focus:ring-black focus:border-transparent transition-colors`}
                                        placeholder="Enter your anonymous ID"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                {error && (
                                    <div className="mt-2 flex items-center text-red-600">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}
                                
                                    <div className="mt-2 flex items-center text-green-600 h-[2rem]">
                                       {
                                        success &&
                                        <>
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{success}</span>
                                        </>
                                       }
                                    </div>
            
                                <div className="mt-2 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep('uuid-verify')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium text-center"
                                    >
                                        I have my Insider ID
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!!error || !anonymousId.trim() || isChecking}
                                className={`min-w-full py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${error || !anonymousId.trim() || isChecking
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                            >
                                {isChecking ? `Checking...` : 'Generate My Insider ID'}
                            </button>
                        </form> 
                    )}

                    {step === 'uuid-display' && (
                        <UuidDisplay
                            uuid={generatedUuid}
                            username={anonymousId}
                            onContinue={handleContinueAfterUuid}
                        />
                    )}

                    {step === 'uuid-verify' && (
                        <form onSubmit={handleUuidVerification} className="space-y-6">
                            <div>
                                <label htmlFor="uuid" className="block text-lg font-medium text-gray-900 mb-4">
                                    Enter your Insider ID
                                </label>
                                <input
                                    type="text"
                                    id="uuid"
                                    value={uuid}
                                    onChange={(e) => {
                                        setUuid(e.target.value);
                                        setError('');
                                    }}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your Insider ID"
                                    required
                                />
                                {error && (
                                    <div className="mt-2 flex items-center text-red-600">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('username');
                                        setError('');
                                    }}
                                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800"
                                >
                                    Verify
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}